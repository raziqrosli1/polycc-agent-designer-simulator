import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { t } from '../lib/copy'
import { ROUTES } from '../lib/routes'
import { getValidationMap } from '../lib/validation'
import { useAppStore } from '../store/appStore'
import type { LayerKey, LogicDraft, RuleDraft } from '../types'

const layerOrder: LayerKey[] = ['goal', 'priority', 'rules', 'logic', 'decision']

const canAccessLayer = (layer: LayerKey, completionSet: Set<LayerKey>) => {
  const index = layerOrder.indexOf(layer)
  if (index === 0) return true
  return completionSet.has(layerOrder[index - 1])
}

const clampIndex = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const parseMultiline = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter((line, index, array) => !(line === '' && index === array.length - 1))

const joinNonEmpty = (lines: string[]) => lines.filter(Boolean).join('\n')

const normalizePrefixedLine = (value: string, prefixes: string[]) => {
  const trimmed = value.trim()
  const hit = prefixes.find((prefix) => trimmed.toLowerCase().startsWith(prefix.toLowerCase()))
  if (!hit) return trimmed
  return trimmed.slice(hit.length).trim().replace(/^[:-]\s*/, '')
}

const stringifyLogicCard = (language: 'en' | 'ms', item: LogicDraft) => {
  const labels =
    language === 'ms'
      ? { if: 'Jika', then: 'Maka', because: 'Sebab', else: 'Jika tidak', coord: 'Kerjasama' }
      : { if: 'If', then: 'Then', because: 'Because', else: 'Else', coord: 'Coordination' }

  const lines = [
    `${labels.if}: ${item.if}`.trimEnd(),
    `${labels.then}: ${item.then}`.trimEnd(),
    `${labels.because}: ${item.because}`.trimEnd(),
  ]

  if (item.else?.trim()) {
    lines.push(`${labels.else}: ${item.else}`.trimEnd())
  }
  if (item.agentCoordination?.trim()) {
    lines.push(`${labels.coord}: ${item.agentCoordination}`.trimEnd())
  }

  return joinNonEmpty(lines)
}

const parseLogicCardText = (language: 'en' | 'ms', value: string) => {
  const lines = parseMultiline(value)
  const labels =
    language === 'ms'
      ? {
          if: ['Jika', 'IF'],
          then: ['Maka', 'THEN'],
          because: ['Sebab', 'BECAUSE'],
          else: ['Jika tidak', 'ELSE'],
          coord: ['Kerjasama', 'Coordination'],
        }
      : {
          if: ['If', 'IF'],
          then: ['Then', 'THEN'],
          because: ['Because', 'BECAUSE'],
          else: ['Else', 'ELSE'],
          coord: ['Coordination', 'Kerjasama'],
        }

  const valueFor = (keys: string[]) => {
    const hit = lines.find((line) => keys.some((key) => line.toLowerCase().startsWith(key.toLowerCase())))
    return hit ? normalizePrefixedLine(hit, keys) : ''
  }

  const rawIf = valueFor(labels.if)
  const rawThen = valueFor(labels.then)
  const rawBecause = valueFor(labels.because)
  const rawElse = valueFor(labels.else)
  const rawCoord = valueFor(labels.coord)

  return {
    if: rawIf,
    then: rawThen,
    because: rawBecause,
    else: rawElse,
    agentCoordination: rawCoord,
  }
}

const stringifyTwoPart = (language: 'en' | 'ms', statement: string, reasoning: string) => {
  if (!reasoning.trim()) return statement
  const label = language === 'ms' ? 'Sebab' : 'Because'
  return `${statement}\n\n${label}: ${reasoning}`.trim()
}

const parseTwoPart = (language: 'en' | 'ms', value: string) => {
  const raw = value.replace(/\r\n/g, '\n')
  const parts = raw.split('\n')
  const statement = (parts[0] ?? '').trim()
  const rest = parts.slice(1).join('\n').trim()
  const label = language === 'ms' ? ['Sebab'] : ['Because']
  const reasoning = rest
    ? normalizePrefixedLine(rest, label)
    : ''

  return { statement, reasoning }
}

function CoachBubble({ tone, children }: { tone: 'calm' | 'success' | 'warn'; children: string }) {
  const style =
    tone === 'success'
      ? 'bg-[color:rgba(52,211,153,0.10)]'
      : tone === 'warn'
        ? 'bg-[color:rgba(245,158,11,0.10)]'
        : 'bg-[color:rgba(91,123,245,0.10)]'

  return (
    <div className={`rounded-[18px] ${style} px-4 py-3`}>
      <p className="text-sm font-medium text-[var(--text)]">{children}</p>
    </div>
  )
}

function WorkspacePage() {
  const navigate = useNavigate()
  const language = useAppStore((state) => state.language)
  const scenario = useAppStore((state) => state.activeScenario)
  const draft = useAppStore((state) => state.activeDraft)
  const updateGoal = useAppStore((state) => state.updateGoal)
  const updatePriorityValue = useAppStore((state) => state.updatePriorityValue)
  const setConflictNote = useAppStore((state) => state.setConflictNote)
  const addRule = useAppStore((state) => state.addRule)
  const updateRule = useAppStore((state) => state.updateRule)
  const removeRule = useAppStore((state) => state.removeRule)
  const addLogicRule = useAppStore((state) => state.addLogicRule)
  const updateLogic = useAppStore((state) => state.updateLogic)
  const removeLogic = useAppStore((state) => state.removeLogic)
  const updateDecision = useAppStore((state) => state.updateDecision)
  const markLayerComplete = useAppStore((state) => state.markLayerComplete)
  const submitDraft = useAppStore((state) => state.submitDraft)
  const [notice, setNotice] = useState('')
  const [activeLayer, setActiveLayer] = useState<LayerKey>('goal')
  const [ruleIndex, setRuleIndex] = useState(0)
  const [logicIndex, setLogicIndex] = useState(0)
  const [coachMessage, setCoachMessage] = useState('')

  const completionSet = useMemo(
    () => new Set(draft?.completedLayers ?? []),
    [draft?.completedLayers],
  )

  const ui =
    language === 'ms'
      ? {
          title: 'Ruang Latihan',
          subtitle: 'Kita buat satu langkah pada satu masa.',
          showStory: 'Lihat cerita latihan',
          hideStory: 'Tutup cerita',
          storyLabel: 'Cerita',
          objectiveLabel: 'Matlamat latihan',
          situationLabel: 'Situasi',
          progressLabel: 'Kemajuan',
          stepOf: (current: number) => `Langkah ${current} daripada 5`,
          completePct: (pct: number) => `${pct}% siap`,
          back: 'Kembali',
          continue: 'Teruskan',
          submit: 'Hantar untuk semakan AI',
          helperTitle: 'Apa yang perlu ditulis',
          exampleTitle: 'Contoh',
          hintTitle: 'Petua',
          inputLabel: 'Jawapan anda',
          optional: 'Pilihan (jika perlu)',
          addRule: 'Tambah peraturan',
          removeRule: 'Buang peraturan',
          ruleCount: (current: number, total: number) => `Peraturan ${current} daripada ${total}`,
          addLogic: 'Tambah kad',
          removeLogic: 'Buang kad',
          logicCount: (current: number, total: number) => `Kad ${current} daripada ${total}`,
          statusLocked: 'Langkah ini terkunci. Siapkan langkah sebelum ini dahulu.',
          coachStart: {
            goal: 'Jangan risau. Kita mula dengan satu matlamat yang jelas.',
            priority: 'Bagus. Sekarang kita susun apa yang paling penting dulu.',
            rules: 'Sekarang kita tulis peraturan supaya AI tak tersasar.',
            logic: 'Mari tulis “jika… maka…” supaya aliran keputusan nampak.',
            decision: 'Akhir sekali, tulis jawapan akhir dan sebabnya.',
          } as Record<LayerKey, string>,
          coachAfter: {
            goal: 'Bagus! Sekarang kita teruskan ke keutamaan.',
            priority: 'Bagus! Sekarang kita tulis peraturan AI.',
            rules: 'Bagus! Sekarang kita bina cara AI berfikir.',
            logic: 'Bagus! Sekarang kita buat keputusan akhir.',
            decision: 'Tahniah. Jawapan anda sedia untuk disemak.',
          } as Record<LayerKey, string>,
          steps: {
            goal: {
              title: '🎯 Matlamat',
              question: 'Apakah hasil akhir yang anda mahu AI capai?',
              explanation: 'Tulis hasil yang jelas. Biar senang semak betul atau tidak.',
              example: 'Bantu pesakit dengan selamat dalam 10 minit.',
              hint: 'Masukkan masa, jumlah, atau standard yang jelas.',
              placeholder: 'Contoh: Bantu pesakit dengan selamat dalam 10 minit.',
              secondaryLabel: 'Matlamat tambahan (jika ada)',
              secondaryPlaceholder: 'Contoh: Kurangkan masa menunggu di kaunter.',
            },
            priority: {
              title: '⭐ Keutamaan',
              question: 'Apa yang paling penting dahulu?',
              explanation: 'Senaraikan 3 perkara. Baris pertama paling penting.',
              example: '1) Keselamatan pesakit\n2) Ketepatan maklumat\n3) Kelajuan',
              hint: 'Kalau dua benda bertembung, yang mana anda sanggup utamakan?',
              placeholder: 'Tulis 3 baris.\nContoh:\nKeselamatan\nKetepatan\nKelajuan',
              conflictLabel: 'Nota bila keutamaan bertembung (pilihan)',
              conflictPlaceholder: 'Contoh: Jika masa dan keselamatan bertembung, utamakan keselamatan.',
            },
            rules: {
              title: '📋 Peraturan AI',
              question: 'Apakah peraturan yang AI mesti ikut?',
              explanation: 'Tulis sekurang-kurangnya 3 peraturan. Satu peraturan satu masa.',
              example: 'AI mesti semak alergi dahulu.\nSebab: Untuk elak risiko.',
              hint: 'Peraturan yang baik boleh diuji. Jangan terlalu umum.',
              placeholder: 'Baris 1: peraturan\nBaris seterusnya: Sebab: ...',
            },
            logic: {
              title: '🧠 Cara AI Berfikir',
              question: 'Bila situasi berubah, AI patut buat apa?',
              explanation: 'Tulis kad “Jika… Maka… Sebab…”.',
              example: 'Jika: simptom kritikal muncul\nMaka: rujuk doktor segera\nSebab: risiko tinggi',
              hint: 'Jangan lompat terus ke tindakan. Tulis “Jika” dulu.',
              placeholder: 'Jika: ...\nMaka: ...\nSebab: ...\nJika tidak: ... (pilihan)',
            },
            decision: {
              title: '✅ Jawapan Akhir',
              question: 'Apakah jawapan akhir AI untuk situasi ini?',
              explanation: 'Baris pertama jawapan akhir. Lepas itu tulis sebabnya.',
              example: 'Rujuk pesakit kepada doktor sekarang.\nSebab: Selari dengan matlamat dan peraturan.',
              hint: 'Sebut Goal, Keutamaan, Peraturan, atau Logic dalam sebab.',
              placeholder: 'Baris 1: jawapan akhir\n\nSebab: ...',
            },
          } as Record<
            LayerKey,
            {
              title: string
              question: string
              explanation: string
              example: string
              hint: string
              placeholder: string
              secondaryLabel?: string
              secondaryPlaceholder?: string
              conflictLabel?: string
              conflictPlaceholder?: string
            }
          >,
        }
      : {
          title: 'Training Workspace',
          subtitle: 'One step at a time.',
          showStory: 'View training story',
          hideStory: 'Hide story',
          storyLabel: 'Story',
          objectiveLabel: 'Objective',
          situationLabel: 'Situation',
          progressLabel: 'Progress',
          stepOf: (current: number) => `Step ${current} of 5`,
          completePct: (pct: number) => `${pct}% complete`,
          back: 'Back',
          continue: 'Continue',
          submit: 'Submit for AI review',
          helperTitle: 'What to write',
          exampleTitle: 'Example',
          hintTitle: 'Hint',
          inputLabel: 'Your answer',
          optional: 'Optional',
          addRule: 'Add rule',
          removeRule: 'Remove rule',
          ruleCount: (current: number, total: number) => `Rule ${current} of ${total}`,
          addLogic: 'Add card',
          removeLogic: 'Remove card',
          logicCount: (current: number, total: number) => `Card ${current} of ${total}`,
          statusLocked: 'This step is locked. Finish the previous step first.',
          coachStart: {
            goal: 'No worries. Start with one clear goal.',
            priority: 'Nice. Now rank what matters most first.',
            rules: 'Now write rules so the AI stays on track.',
            logic: 'Write “If… Then…” so the thinking is traceable.',
            decision: 'Finally, write the final answer and the reason.',
          } as Record<LayerKey, string>,
          coachAfter: {
            goal: 'Nice! Now move on to priority.',
            priority: 'Nice! Now write the AI rules.',
            rules: 'Nice! Now build the logic.',
            logic: 'Nice! Now write the final answer.',
            decision: 'Well done. Your answer is ready for review.',
          } as Record<LayerKey, string>,
          steps: {
            goal: {
              title: '🎯 Goal',
              question: 'What final result do you want the AI to achieve?',
              explanation: 'Write a clear result that can be checked.',
              example: 'Help the patient safely within 10 minutes.',
              hint: 'Include a time, number, or clear standard.',
              placeholder: 'Example: Help the patient safely within 10 minutes.',
              secondaryLabel: 'Optional extra goal',
              secondaryPlaceholder: 'Example: Reduce waiting time at the counter.',
            },
            priority: {
              title: '⭐ Priority',
              question: 'What matters most first?',
              explanation: 'List 3 items. First line is the most important.',
              example: '1) Safety\n2) Accuracy\n3) Speed',
              hint: 'If two things clash, which one do you protect first?',
              placeholder: 'Write 3 lines.\nExample:\nSafety\nAccuracy\nSpeed',
              conflictLabel: 'Optional note if priorities clash',
              conflictPlaceholder: 'Example: If speed conflicts with safety, choose safety.',
            },
            rules: {
              title: '📋 Rules',
              question: 'What rules must the AI follow?',
              explanation: 'Write at least 3 rules. One rule at a time.',
              example: 'The AI must check allergies first.\nBecause: It reduces risk.',
              hint: 'Good rules are testable. Avoid vague wording.',
              placeholder: 'Line 1: rule\nNext line: Because: ...',
            },
            logic: {
              title: '🧠 Logic',
              question: 'When the situation changes, what should the AI do?',
              explanation: 'Write one “If… Then… Because…” card.',
              example: 'If: critical symptoms appear\nThen: refer to a doctor\nBecause: high risk',
              hint: 'Do not jump to actions. Start with “If”.',
              placeholder: 'If: ...\nThen: ...\nBecause: ...\nElse: ... (optional)',
            },
            decision: {
              title: '✅ Final Answer',
              question: 'What is the AI final answer for this situation?',
              explanation: 'First line is the final answer. Then write the reason.',
              example: 'Refer the patient to a doctor now.\nBecause: It follows the goal and rules.',
              hint: 'Mention Goal, Priority, Rules, or Logic in your reason.',
              placeholder: 'Line 1: final answer\n\nBecause: ...',
            },
          } as Record<
            LayerKey,
            {
              title: string
              question: string
              explanation: string
              example: string
              hint: string
              placeholder: string
              secondaryLabel?: string
              secondaryPlaceholder?: string
              conflictLabel?: string
              conflictPlaceholder?: string
            }
          >,
        }

  const preferredLayer =
    layerOrder.find(
      (layer) => canAccessLayer(layer, completionSet) && !completionSet.has(layer),
    ) ?? 'decision'

  useEffect(() => {
    setActiveLayer((current) => {
      if (canAccessLayer(current, completionSet)) return current
      return preferredLayer
    })
  }, [completionSet, preferredLayer])

  useEffect(() => {
    setCoachMessage(ui.coachStart[activeLayer])
    setNotice('')
  }, [activeLayer, language, ui.coachStart])

  useEffect(() => {
    if (!draft) return
    setRuleIndex((value) => clampIndex(value, 0, Math.max(0, draft.rules.length - 1)))
  }, [draft])

  useEffect(() => {
    if (!draft) return
    setLogicIndex((value) => clampIndex(value, 0, Math.max(0, draft.logic.length - 1)))
  }, [draft])

  if (!scenario || !draft) {
    return <Navigate to={ROUTES.generator} replace />
  }

  const validationMap = getValidationMap(scenario, draft, language)

  const currentStepIndex = layerOrder.indexOf(activeLayer) + 1
  const completedCount = completionSet.size
  const progressPercent = Math.round((completedCount / layerOrder.length) * 100)

  const canContinueCurrent = canAccessLayer(activeLayer, completionSet)
  const currentValidation = validationMap[activeLayer]
  const currentErrors = currentValidation.errors
  const currentWarnings = currentValidation.warnings

  const goNextLayer = () => {
    const index = layerOrder.indexOf(activeLayer)
    const next = layerOrder[index + 1]
    if (next) setActiveLayer(next)
  }

  const goPrevLayer = () => {
    const index = layerOrder.indexOf(activeLayer)
    const prev = layerOrder[index - 1]
    if (prev) setActiveLayer(prev)
  }

  const completeLayer = (layer: LayerKey) => {
    if (!validationMap[layer].ready) {
      const firstError = validationMap[layer].errors[0]
      setNotice(
        firstError
          ? `${t(language, 'finishLayer', layer)} ${firstError}`
          : t(language, 'finishLayer', layer),
      )
      return
    }

    markLayerComplete(layer)
    setNotice(t(language, 'layerMarked', layer))
  }

  const attemptContinue = () => {
    if (!canContinueCurrent) {
      setNotice(ui.statusLocked)
      return
    }

    if (activeLayer === 'decision') {
      if (!validationMap.decision.ready) {
        completeLayer('decision')
        return
      }

      const firstIncomplete = layerOrder.find(
        (layer) => layer !== 'decision' && !completionSet.has(layer),
      )
      if (firstIncomplete) {
        setNotice(t(language, 'submitFinishAll'))
        return
      }

      const firstInvalid = layerOrder.find((layer) => !validationMap[layer].ready)
      if (firstInvalid) {
        setNotice(t(language, 'resolveValidation', firstInvalid))
        return
      }

      markLayerComplete('decision')
      const attempt = submitDraft()
      if (attempt) {
        setCoachMessage(ui.coachAfter.decision)
        navigate(`${ROUTES.evaluation}/${attempt.id}`)
      }
      return
    }

    completeLayer(activeLayer)
    if (!validationMap[activeLayer].ready) return
    setCoachMessage(ui.coachAfter[activeLayer])
    goNextLayer()
  }

  const step = ui.steps[activeLayer]
  const locked = !canContinueCurrent

  const currentRule = draft.rules[ruleIndex] ?? null
  const currentLogic = draft.logic[logicIndex] ?? null

  const priorityText = draft.priority.orderedValues.join('\n').trim()

  const onPriorityChange = (value: string) => {
    const lines = parseMultiline(value)
    const next = [lines[0] ?? '', lines[1] ?? '', lines[2] ?? '']
    next.forEach((item, index) => updatePriorityValue(index, item))
  }

  const onRuleChange = (rule: RuleDraft, value: string) => {
    const parsed = parseTwoPart(language, value)
    updateRule(rule.id, 'statement', parsed.statement)
    updateRule(rule.id, 'reasoning', parsed.reasoning)
  }

  const onLogicChange = (item: LogicDraft, value: string) => {
    const parsed = parseLogicCardText(language, value)
    updateLogic(item.id, 'if', parsed.if)
    updateLogic(item.id, 'then', parsed.then)
    updateLogic(item.id, 'because', parsed.because)
    if (scenario.difficulty >= 5) {
      updateLogic(item.id, 'else', parsed.else)
    }
    if (scenario.difficulty >= 8) {
      updateLogic(item.id, 'agentCoordination', parsed.agentCoordination)
    }
  }

  const decisionText = stringifyTwoPart(language, draft.decision.statement, draft.decision.reasoning)
  const onDecisionChange = (value: string) => {
    const parsed = parseTwoPart(language, value)
    updateDecision('statement', parsed.statement)
    updateDecision('reasoning', parsed.reasoning)
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="rounded-[28px] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
        <p className="text-sm font-medium text-[var(--accent)]">{ui.title}</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{step.title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{ui.subtitle}</p>

        <div className="mt-5 rounded-[20px] bg-[var(--surface-raised)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-[var(--text)]">
              {ui.progressLabel}: {ui.stepOf(currentStepIndex)} · {ui.completePct(progressPercent)}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {scenario.domain} · {language === 'ms' ? `Tahap ${scenario.difficulty}` : `Level ${scenario.difficulty}`}
            </p>
          </div>
          <div className="mt-3 h-3 rounded-full bg-[var(--surface)]">
            <div
              className="h-3 rounded-full bg-[linear-gradient(90deg,var(--accent),rgba(52,211,153,0.9))] transition-[width] duration-200 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-5">
          <CoachBubble tone={locked ? 'warn' : 'calm'}>{locked ? ui.statusLocked : coachMessage}</CoachBubble>
        </div>

        <details className="mt-5 rounded-[20px] bg-[var(--surface-raised)] p-4">
          <summary className="cursor-pointer text-sm font-medium text-[var(--text)]">
            {ui.showStory}
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-[var(--text-muted)]">{ui.situationLabel}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text)]">{scenario.context}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">{ui.objectiveLabel}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text)]">{scenario.objective}</p>
            </div>
          </div>
        </details>
      </header>

      <main className="rounded-[28px] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
        <p className="text-sm font-semibold text-[var(--text)]">{step.question}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{step.explanation}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[20px] bg-[var(--surface-raised)] p-4">
            <p className="text-xs text-[var(--text-muted)]">{ui.exampleTitle}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">
              {step.example}
            </p>
          </div>
          <div className="rounded-[20px] bg-[var(--surface-raised)] p-4">
            <p className="text-xs text-[var(--text-muted)]">{ui.hintTitle}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text)]">{step.hint}</p>
          </div>
        </div>

        <div className={locked ? 'mt-6 pointer-events-none opacity-55' : 'mt-6'}>
          <p className="text-xs text-[var(--text-muted)]">{ui.inputLabel}</p>

          {activeLayer === 'goal' ? (
            <>
              <textarea
                value={draft.goal.primary}
                onChange={(event) => updateGoal('primary', event.target.value)}
                rows={4}
                placeholder={step.placeholder}
                aria-label={step.title}
                className="mt-2 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              />
              {scenario.difficulty >= 2 ? (
                <details className="mt-4 rounded-[20px] bg-[var(--surface-raised)] p-4">
                  <summary className="cursor-pointer text-sm font-medium text-[var(--text)]">
                    {ui.optional}
                  </summary>
                  <div className="mt-3">
                    <p className="text-xs text-[var(--text-muted)]">{step.secondaryLabel}</p>
                    <textarea
                      value={draft.goal.secondary}
                      onChange={(event) => updateGoal('secondary', event.target.value)}
                      rows={3}
                      placeholder={step.secondaryPlaceholder}
                      aria-label={step.secondaryLabel}
                      className="mt-2 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                    />
                  </div>
                </details>
              ) : null}
            </>
          ) : null}

          {activeLayer === 'priority' ? (
            <>
              <textarea
                value={priorityText}
                onChange={(event) => onPriorityChange(event.target.value)}
                rows={5}
                placeholder={step.placeholder}
                aria-label={step.title}
                className="mt-2 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              />
              {scenario.difficulty >= 4 ? (
                <details className="mt-4 rounded-[20px] bg-[var(--surface-raised)] p-4">
                  <summary className="cursor-pointer text-sm font-medium text-[var(--text)]">
                    {ui.optional}
                  </summary>
                  <div className="mt-3">
                    <p className="text-xs text-[var(--text-muted)]">{step.conflictLabel}</p>
                    <textarea
                      value={draft.priority.conflictNote}
                      onChange={(event) => setConflictNote(event.target.value)}
                      rows={3}
                      placeholder={step.conflictPlaceholder}
                      aria-label={step.conflictLabel}
                      className="mt-2 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                    />
                  </div>
                </details>
              ) : null}
            </>
          ) : null}

          {activeLayer === 'rules' ? (
            <>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--text)]">
                  {ui.ruleCount(ruleIndex + 1, draft.rules.length)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setRuleIndex((value) => clampIndex(value - 1, 0, draft.rules.length - 1))}
                    disabled={ruleIndex === 0}
                  >
                    {language === 'ms' ? 'Sebelum' : 'Prev'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setRuleIndex((value) => clampIndex(value + 1, 0, draft.rules.length - 1))}
                    disabled={ruleIndex >= draft.rules.length - 1}
                  >
                    {language === 'ms' ? 'Seterusnya' : 'Next'}
                  </Button>
                </div>
              </div>

              {currentRule ? (
                <textarea
                  value={stringifyTwoPart(language, currentRule.statement, currentRule.reasoning)}
                  onChange={(event) => onRuleChange(currentRule, event.target.value)}
                  rows={6}
                  placeholder={step.placeholder}
                  aria-label={ui.ruleCount(ruleIndex + 1, draft.rules.length)}
                  className="mt-3 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                />
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={addRule}
                  className="text-sm font-medium text-[var(--accent)]"
                >
                  {ui.addRule}
                </button>
                {currentRule && draft.rules.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => removeRule(currentRule.id)}
                    className="text-sm font-medium text-[var(--danger)]"
                  >
                    {ui.removeRule}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}

          {activeLayer === 'logic' ? (
            <>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--text)]">
                  {ui.logicCount(logicIndex + 1, draft.logic.length)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setLogicIndex((value) => clampIndex(value - 1, 0, draft.logic.length - 1))}
                    disabled={logicIndex === 0}
                  >
                    {language === 'ms' ? 'Sebelum' : 'Prev'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setLogicIndex((value) => clampIndex(value + 1, 0, draft.logic.length - 1))}
                    disabled={logicIndex >= draft.logic.length - 1}
                  >
                    {language === 'ms' ? 'Seterusnya' : 'Next'}
                  </Button>
                </div>
              </div>

              {currentLogic ? (
                <textarea
                  value={stringifyLogicCard(language, currentLogic)}
                  onChange={(event) => onLogicChange(currentLogic, event.target.value)}
                  rows={7}
                  placeholder={step.placeholder}
                  aria-label={ui.logicCount(logicIndex + 1, draft.logic.length)}
                  className="mt-3 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                />
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={addLogicRule}
                  className="text-sm font-medium text-[var(--accent)]"
                >
                  {ui.addLogic}
                </button>
                {currentLogic && draft.logic.length > scenario.difficultyProfile.logicCount ? (
                  <button
                    type="button"
                    onClick={() => removeLogic(currentLogic.id)}
                    className="text-sm font-medium text-[var(--danger)]"
                  >
                    {ui.removeLogic}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}

          {activeLayer === 'decision' ? (
            <>
              <textarea
                value={decisionText}
                onChange={(event) => onDecisionChange(event.target.value)}
                rows={7}
                placeholder={step.placeholder}
                aria-label={step.title}
                className="mt-2 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              />
              <details className="mt-4 rounded-[20px] bg-[var(--surface-raised)] p-4">
                <summary className="cursor-pointer text-sm font-medium text-[var(--text)]">
                  {ui.optional}
                </summary>
                <div className="mt-3">
                  <p className="text-xs text-[var(--text-muted)]">
                    {language === 'ms' ? 'Tahap keyakinan (pilihan)' : 'Confidence (optional)'}
                  </p>
                  <select
                    value={draft.decision.confidence}
                    onChange={(event) => updateDecision('confidence', event.target.value)}
                    aria-label={language === 'ms' ? 'Tahap keyakinan' : 'Confidence'}
                    className="mt-2 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                  >
                    <option value="low">{t(language, 'lowConfidence')}</option>
                    <option value="medium">{t(language, 'mediumConfidence')}</option>
                    <option value="high">{t(language, 'highConfidence')}</option>
                  </select>
                </div>
              </details>
            </>
          ) : null}
        </div>

        {notice ? (
          <div className="mt-4 rounded-[18px] bg-[color:rgba(245,158,11,0.10)] px-4 py-3">
            <p className="text-sm text-[var(--text)]">{notice}</p>
          </div>
        ) : null}

        {currentErrors.length > 0 || currentWarnings.length > 0 ? (
          <div className="mt-4 space-y-2">
            {currentErrors.map((error) => (
              <p key={error} className="text-sm text-[var(--danger)]">
                • {error}
              </p>
            ))}
            {currentWarnings.map((warning) => (
              <p key={warning} className="text-sm text-[var(--warning)]">
                • {warning}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--success)]">{t(language, 'layerReady')}</p>
        )}
      </main>

      <div className="sticky bottom-0 z-10">
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--shell-backdrop)] p-3 shadow-[var(--shadow-strong)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={goPrevLayer} disabled={activeLayer === 'goal'}>
                {ui.back}
              </Button>
            </div>

            <Button
              variant="primary"
              onClick={attemptContinue}
              disabled={locked}
              block
            >
              {activeLayer === 'decision' ? ui.submit : ui.continue}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspacePage
