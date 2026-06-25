import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SectionCard from '../components/SectionCard'
import Pill from '../components/ui/Pill'
import Button from '../components/ui/Button'
import { t } from '../lib/copy'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'
import type { LayerKey } from '../types'

const gradeLabel = (score: number, language: 'en' | 'ms') => {
  if (language === 'ms') {
    if (score >= 85) return 'Kemas dan meyakinkan'
    if (score >= 70) return 'Semakin jelas'
    if (score >= 55) return 'Dah mula nampak'
    return 'Perlu kemas lagi'
  }
  if (score >= 85) return 'Clear and strong'
  if (score >= 70) return 'Getting clearer'
  if (score >= 55) return 'Good start'
  return 'Needs more structure'
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value))

function ScoreRing({ value, label }: { value: number; label: string }) {
  const size = 148
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = clamp(value, 0, 100) / 100
  const dash = circumference * pct

  return (
    <div className="relative inline-flex h-[148px] w-[148px] items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={label}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.95)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-semibold leading-none">{Math.round(value)}</p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">/ 100</p>
      </div>
    </div>
  )
}

const listOrFallback = (
  items: string[],
  fallback: string,
  tone: 'success' | 'warning' | 'accent',
) => {
  const dot =
    tone === 'success'
      ? 'bg-[var(--success)]'
      : tone === 'warning'
        ? 'bg-[var(--warning)]'
        : 'bg-[var(--accent)]'

  return items.length > 0 ? (
    <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${dot} opacity-70`} />
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="mt-4 text-sm text-[var(--text-secondary)]">{fallback}</p>
  )
}

const uniqueList = <T extends string>(items: T[]): T[] => {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.trim()
    if (!key) return false
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const toTextBlock = (value: string) => value.replace(/\r\n/g, '\n').trim()

const translatePriorityToken = (language: 'en' | 'ms', value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (language !== 'ms') return trimmed
  const map: Record<string, string> = {
    Safety: 'Keselamatan',
    safety: 'Keselamatan',
    Accuracy: 'Ketepatan',
    accuracy: 'Ketepatan',
    Speed: 'Kelajuan',
    speed: 'Kelajuan',
    Fairness: 'Keadilan',
    fairness: 'Keadilan',
    Privacy: 'Privasi',
    privacy: 'Privasi',
    Compliance: 'Pematuhan',
    compliance: 'Pematuhan',
  }
  return map[trimmed] ?? trimmed
}

const layerEmojiLabel = (language: 'en' | 'ms'): Record<LayerKey, string> =>
  language === 'ms'
    ? {
        goal: '🎯 Matlamat',
        priority: '⭐ Keutamaan',
        rules: '📋 Peraturan',
        logic: '🧠 Cara Berfikir',
        decision: '✅ Jawapan Akhir',
      }
    : {
        goal: '🎯 Goal',
        priority: '⭐ Priority',
        rules: '📋 Rules',
        logic: '🧠 Logic',
        decision: '✅ Final Answer',
      }

const beforeTextForLayer = (layer: LayerKey, language: 'en' | 'ms', attempt: any) => {
  const submission = attempt.submission
  if (!submission) return ''

  if (layer === 'goal') {
    const primary = toTextBlock(submission.goal?.primary ?? '')
    const secondary = toTextBlock(submission.goal?.secondary ?? '')
    return [primary, secondary ? (language === 'ms' ? `Tambahan: ${secondary}` : `Secondary: ${secondary}`) : '']
      .filter(Boolean)
      .join('\n')
  }

  if (layer === 'priority') {
    const ordered = Array.isArray(submission.priority?.orderedValues)
      ? submission.priority.orderedValues.map((item: string) => toTextBlock(item)).filter(Boolean)
      : []
    const conflictNote = toTextBlock(submission.priority?.conflictNote ?? '')
    const lines = ordered.length ? ordered.map((item: string, index: number) => `${index + 1}. ${item}`) : []
    if (conflictNote) lines.push(language === 'ms' ? `Nota konflik: ${conflictNote}` : `Conflict note: ${conflictNote}`)
    return lines.join('\n')
  }

  if (layer === 'rules') {
    const rules = Array.isArray(submission.rules) ? submission.rules : []
    const lines = rules
      .map((rule: any, index: number) => {
        const statement = toTextBlock(rule?.statement ?? '')
        const reasoning = toTextBlock(rule?.reasoning ?? '')
        const head = statement ? `${index + 1}. ${statement}` : ''
        return reasoning ? `${head}\n${language === 'ms' ? `Sebab: ${reasoning}` : `Because: ${reasoning}`}` : head
      })
      .filter(Boolean)
    return lines.join('\n\n')
  }

  if (layer === 'logic') {
    const cards = Array.isArray(submission.logic) ? submission.logic : []
    const lines = cards
      .map((card: any, index: number) => {
        const ifText = toTextBlock(card?.if ?? '')
        const thenText = toTextBlock(card?.then ?? '')
        const becauseText = toTextBlock(card?.because ?? '')
        const elseText = toTextBlock(card?.else ?? '')
        const parts = []
        if (ifText) parts.push(language === 'ms' ? `Jika: ${ifText}` : `If: ${ifText}`)
        if (thenText) parts.push(language === 'ms' ? `Maka: ${thenText}` : `Then: ${thenText}`)
        if (becauseText) parts.push(language === 'ms' ? `Sebab: ${becauseText}` : `Because: ${becauseText}`)
        if (elseText) parts.push(language === 'ms' ? `Jika tidak: ${elseText}` : `Else: ${elseText}`)
        if (!parts.length) return ''
        return `${index + 1}.\n${parts.join('\n')}`
      })
      .filter(Boolean)
    return lines.join('\n\n')
  }

  if (layer === 'decision') {
    const statement = toTextBlock(submission.decision?.statement ?? '')
    const reasoning = toTextBlock(submission.decision?.reasoning ?? '')
    return [statement, reasoning ? (language === 'ms' ? `Sebab: ${reasoning}` : `Because: ${reasoning}`) : '']
      .filter(Boolean)
      .join('\n')
  }

  return ''
}

const afterTextForLayer = (layer: LayerKey, language: 'en' | 'ms', attempt: any) => {
  const scenario = attempt.scenario
  const submission = attempt.submission

  if (layer === 'goal') {
    const base = toTextBlock(submission?.goal?.primary ?? '')
    const objective = toTextBlock(scenario?.objective ?? '')
    if (language === 'ms') {
      return base
        ? `Matlamat saya jelas: ${base}\nSaya pastikan ia boleh dinilai dengan satu ukuran yang mudah.`
        : objective
          ? `Matlamat saya jelas: ${objective}\nSaya pastikan ia boleh dinilai dengan satu ukuran yang mudah.`
          : 'Matlamat saya jelas dan boleh dinilai dengan mudah.'
    }
    return base
      ? `Clear goal: ${base}\nI add one simple measure so it is easy to check.`
      : objective
        ? `Clear goal: ${objective}\nI add one simple measure so it is easy to check.`
        : 'Clear goal with one simple measure.'
  }

  if (layer === 'priority') {
    const defaults = Array.isArray(scenario?.defaultPriorities) ? scenario.defaultPriorities : []
    const ordered = Array.isArray(submission?.priority?.orderedValues) ? submission.priority.orderedValues : []
    const source = ordered.length ? ordered : defaults
    const cleaned = source.map((item: string) => translatePriorityToken(language, item)).filter(Boolean).slice(0, 4)
    const lines = cleaned.length ? cleaned.map((item: string, index: number) => `${index + 1}. ${item}`) : []
    if (language === 'ms') {
      return [
        'Saya susun ikut turutan paling penting.',
        lines.length ? lines.join('\n') : '1. Keselamatan\n2. Ketepatan\n3. Keadilan\n4. Masa',
        'Jika bercanggah, saya pilih yang paling selamat dahulu.',
      ].join('\n')
    }
    return [
      'I order what matters most first.',
      lines.length ? lines.join('\n') : '1. Safety\n2. Accuracy\n3. Fairness\n4. Time',
      'If there is a clash, I choose the safest option first.',
    ].join('\n')
  }

  if (layer === 'rules') {
    const firstConstraint = Array.isArray(scenario?.constraints) ? toTextBlock(scenario.constraints[0] ?? '') : ''
    const firstRisk = Array.isArray(scenario?.risks) ? toTextBlock(scenario.risks[0] ?? '') : ''
    if (language === 'ms') {
      return [
        '1. Mesti jelaskan apa yang andaian dan apa yang fakta.',
        firstRisk ? `2. Jangan ambil tindakan berisiko tanpa semak: ${firstRisk}` : '2. Jangan buat andaian besar tanpa semak.',
        firstConstraint ? `3. Sentiasa patuhi kekangan utama: ${firstConstraint}` : '3. Sentiasa patuhi kekangan utama latihan.',
      ].join('\n')
    }
    return [
      '1. Always separate facts from assumptions.',
      firstRisk ? `2. Do not take risky action without checks: ${firstRisk}` : '2. Do not make big assumptions without checks.',
      firstConstraint ? `3. Always follow the main constraint: ${firstConstraint}` : '3. Always follow the main constraint for this practice.',
    ].join('\n')
  }

  if (layer === 'logic') {
    if (language === 'ms') {
      return [
        'Jika maklumat tak cukup, saya minta semakan manusia.',
        'Jika risiko tinggi, saya utamakan langkah paling selamat dahulu.',
        'Saya tulis sebab ringkas supaya keputusan mudah diikut.',
      ].join('\n')
    }
    return [
      'If information is incomplete, I ask for human review.',
      'If risk is high, I choose the safest path first.',
      'I add a short reason so the decision is easy to follow.',
    ].join('\n')
  }

  if (layer === 'decision') {
    const objective = toTextBlock(scenario?.objective ?? '')
    if (language === 'ms') {
      return [
        objective ? `Jawapan akhir saya ikut matlamat ini: ${objective}` : 'Jawapan akhir saya ikut matlamat yang saya tetapkan.',
        'Saya jelaskan sebabnya dengan rujuk keutamaan dan peraturan utama.',
      ].join('\n')
    }
    return [
      objective ? `My final answer follows this goal: ${objective}` : 'My final answer follows my stated goal.',
      'I explain it using the top priorities and key rules.',
    ].join('\n')
  }

  return ''
}

function EvaluationPage() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const language = useAppStore((state) => state.language)
  const attempts = useAppStore((state) => state.attempts)
  const retrySeed = useAppStore((state) => state.retrySeed)
  const aiJudgeStatus = useAppStore((state) => state.aiJudgeStatus)
  const aiJudgeError = useAppStore((state) => state.aiJudgeError)
  const evaluateAttemptWithDeepSeek = useAppStore(
    (state) => state.evaluateAttemptWithDeepSeek,
  )
  const clearAiJudgeError = useAppStore((state) => state.clearAiJudgeError)
  const [pagePhase, setPagePhase] = useState<'loading' | 'ready'>('loading')
  const [loadingLineIndex, setLoadingLineIndex] = useState(0)

  const labels = useMemo(() => layerEmojiLabel(language), [language])
  const attempt = attempts.find((item) => item.id === attemptId) ?? attempts[0] ?? null
  const attemptKey = attempt?.id ?? ''

  const layerScores: Array<[LayerKey, string, number]> = useMemo(
    () =>
      attempt
        ? [
            ['goal', labels.goal, attempt.evaluation.scores.goal],
            ['priority', labels.priority, attempt.evaluation.scores.priority],
            ['rules', labels.rules, attempt.evaluation.scores.rules],
            ['logic', labels.logic, attempt.evaluation.scores.logic],
            ['decision', labels.decision, attempt.evaluation.scores.decision],
          ]
        : [
            ['goal', labels.goal, 0],
            ['priority', labels.priority, 0],
            ['rules', labels.rules, 0],
            ['logic', labels.logic, 0],
            ['decision', labels.decision, 0],
          ],
    [attempt, labels],
  )

  const latestAiJudge = attempt?.aiJudgeHistory[0] ?? null
  const layerLabelMap = useMemo(
    () =>
      language === 'ms'
        ? {
            goal: 'Matlamat',
            priority: 'Keutamaan',
            rules: 'Peraturan',
            logic: 'Cara berfikir',
            decision: 'Jawapan akhir',
          }
        : {
            goal: 'Goal',
            priority: 'Priority',
            rules: 'Rules',
            logic: 'Thinking',
            decision: 'Final answer',
          },
    [language],
  )
  const weakestLayerKey = (attempt?.evaluation.diagnostics.weakestLayer as LayerKey) ?? 'goal'
  const weakestLayerLabel = layerLabelMap[weakestLayerKey] ?? weakestLayerKey

  const loadingLines = useMemo(
    () =>
      language === 'ms'
        ? [
            t(language, 'evalLoadingLine1'),
            t(language, 'evalLoadingLine2'),
            t(language, 'evalLoadingLine3'),
          ]
        : [
            t(language, 'evalLoadingLine1'),
            t(language, 'evalLoadingLine2'),
            t(language, 'evalLoadingLine3'),
          ],
    [language],
  )

  useEffect(() => {
    setPagePhase('loading')
    setLoadingLineIndex(0)
    const tick = window.setInterval(() => {
      setLoadingLineIndex((value) => (value + 1) % loadingLines.length)
    }, 650)
    const done = window.setTimeout(() => {
      setPagePhase('ready')
      window.clearInterval(tick)
    }, 1200)
    return () => {
      window.clearTimeout(done)
      window.clearInterval(tick)
    }
  }, [attemptKey, loadingLines.length])
  const score = attempt?.evaluation.scores.total ?? 0

  const coachSummary = useMemo(() => {
    const grade = gradeLabel(score, language)
    if (language === 'ms') {
      if (score >= 85) {
        return `Tahniah. Jawapan anda nampak tersusun.\nSekarang kita kemaskan ${weakestLayerLabel} supaya lebih meyakinkan.`
      }
      if (score >= 70) {
        return `Bagus. Arah jawapan anda dah betul.\nJom kemaskan ${weakestLayerLabel} supaya lebih jelas.`
      }
      if (score >= 55) {
        return `Anda dah mula dengan baik.\nKita baiki ${weakestLayerLabel} dulu. Lepas itu, jawapan jadi lebih kemas.`
      }
      return `Jangan risau.\nKita mula dengan ${weakestLayerLabel} supaya aliran jawapan lebih mudah diikut.`
    }
    return `Good work. Your result is: ${grade}.\nLet’s improve ${weakestLayerLabel} first for a clearer answer.`
  }, [language, score, weakestLayerLabel])

  const goodThings = useMemo(
    () => uniqueList(attempt?.evaluation.strengths ?? []),
    [attempt?.evaluation.strengths],
  )
  const improveThings = useMemo(
    () => uniqueList([...(attempt?.evaluation.weaknesses ?? []), ...(attempt?.evaluation.blindSpots ?? [])]),
    [attempt?.evaluation.blindSpots, attempt?.evaluation.weaknesses],
  )

  const weakLayerKeys = useMemo(() => {
    const weak = layerScores.filter((item) => item[2] <= 6).map((item) => item[0])
    if (weak.length) return uniqueList(weak)
    return [weakestLayerKey]
  }, [layerScores, weakestLayerKey])

  const handleFixMyAnswer = () => {
    if (!attempt) return
    retrySeed(attempt.scenario.seed, attempt.scenario.domain, attempt.scenario.difficulty)
    navigate(ROUTES.workspace)
  }

  const handleTryNewPractice = () => {
    navigate(ROUTES.generator)
  }

  if (!attempt) {
    return <Navigate to={ROUTES.history} replace />
  }

  if (pagePhase === 'loading') {
    return (
      <div className="space-y-6">
        <SectionCard>
          <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="h-12 w-12 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--shadow-card)]">
              <div className="h-full w-full animate-pulse rounded-full bg-[color:rgba(91,123,245,0.10)]" />
            </div>
            <p className="max-w-lg text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              {loadingLines[loadingLineIndex]}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{t(language, 'evalLoadingHint')}</p>
          </div>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex flex-col gap-6 py-2 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[var(--success)]">{t(language, 'evalCelebrationEyebrow')}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
              {t(language, 'evalCelebrationTitle')}
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              {t(language, 'evalCelebrationSubtitle')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>{attempt.scenario.domain}</Pill>
              <Pill tone="accent">
                {t(language, 'evalMetaLevel', attempt.scenario.difficulty, attempt.scenario.difficultyLabel)}
              </Pill>
              <Pill>{t(language, 'evalMetaTrainingCode', attempt.scenario.seed)}</Pill>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-[28px] bg-[var(--surface-raised)] px-6 py-6 text-center">
            <ScoreRing value={score} label={t(language, 'overallScore')} />
            <p className="text-sm text-[var(--text-secondary)]">{gradeLabel(score, language)}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {t(language, 'evalStep3Title')}
            </p>
            <p className="mt-3 text-4xl font-semibold leading-none">{score}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{t(language, 'evalScoreMeaning')}</p>
          </div>
          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {t(language, 'evalScenarioTitle')}
            </p>
            <p className="mt-3 text-base font-medium text-[var(--text)]">{attempt.scenario.title}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{attempt.scenario.context}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">{t(language, 'evalCoachTitle')}</p>
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          {coachSummary}
        </p>
        <div className="mt-4 rounded-2xl border border-[color:rgba(91,123,245,0.22)] bg-[color:rgba(91,123,245,0.06)] p-4 text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text)]">{t(language, 'evalCoachFocusLabel')}</span>{' '}
          {weakestLayerLabel}.
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--success)]">{t(language, 'strengths')}</p>
          {listOrFallback(goodThings, t(language, 'evalNoGoodThings'), 'success')}
        </SectionCard>

        <SectionCard>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--warning)]">{t(language, 'evalImproveTitle')}</p>
          {listOrFallback(improveThings, t(language, 'evalNoImproveThings'), 'warning')}
        </SectionCard>
      </div>

      <SectionCard>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{t(language, 'evalSuggestionsTitle')}</p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          {attempt.evaluation.expertRecommendation}
        </p>

        <div className="mt-5 rounded-[24px] bg-[var(--surface-raised)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--text)]">{t(language, 'evalDeepSeekTitle')}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{t(language, 'evalDeepSeekDescription')}</p>
              {latestAiJudge ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill>{t(language, 'deepseekModel')}: {latestAiJudge.model}</Pill>
                  <Pill tone="success">{t(language, 'deepseekOverall')}: {latestAiJudge.scores.overall}</Pill>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill tone="accent">{t(language, 'deepseekOptional')}</Pill>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => void evaluateAttemptWithDeepSeek(attempt.id)}
                disabled={aiJudgeStatus === 'loading'}
              >
                {aiJudgeStatus === 'loading' ? t(language, 'deepseekLoading') : t(language, 'runDeepSeekJudge')}
              </Button>
              {aiJudgeError ? (
                <Button
                  variant="danger"
                  onClick={() => {
                    clearAiJudgeError()
                    void evaluateAttemptWithDeepSeek(attempt.id)
                  }}
                  disabled={aiJudgeStatus === 'loading'}
                >
                  {t(language, 'deepseekRetry')}
                </Button>
              ) : null}
            </div>
          </div>

          {aiJudgeError ? (
            <div
              aria-live="polite"
              className="mt-4 rounded-2xl border border-[color:rgba(248,113,113,0.25)] bg-[color:rgba(248,113,113,0.08)] p-4 text-sm text-[var(--danger)]"
            >
              {t(language, 'deepseekErrorPrefix')} {aiJudgeError}
            </div>
          ) : null}

          {latestAiJudge ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] bg-[var(--surface)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {t(language, 'evalDeepSeekImprovements')}
                </p>
                {listOrFallback(
                  uniqueList(latestAiJudge.improvements),
                  t(language, 'evalDeepSeekImprovementsFallback'),
                  'accent',
                )}
              </div>
              <div className="rounded-[24px] bg-[var(--surface)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {t(language, 'evalDeepSeekTopTeam')}
                </p>
                {listOrFallback(
                  uniqueList(latestAiJudge.topTeamImprovements),
                  t(language, 'evalDeepSeekTopTeamFallback'),
                  'accent',
                )}
              </div>
            </div>
          ) : (
            <p aria-live="polite" className="mt-4 text-sm text-[var(--text-secondary)]">
              {aiJudgeStatus === 'loading' ? t(language, 'deepseekLoading') : t(language, 'evalDeepSeekNotRunYet')}
            </p>
          )}

          {latestAiJudge ? (
            <details className="mt-5">
              <summary className="cursor-pointer select-none text-sm font-medium text-[var(--text-secondary)]">
                {t(language, 'evalTechnicalToggle')}
              </summary>
              <div className="mt-4 space-y-3 rounded-[24px] border border-[color:rgba(91,123,245,0.22)] bg-[color:rgba(91,123,245,0.06)] p-5">
                <p className="text-sm font-medium text-[var(--text)]">{t(language, 'evalTechnicalTitle')}</p>
                <p className="text-sm leading-7 text-[var(--text-secondary)]">{t(language, 'evalTechnicalHint')}</p>
                <div className="rounded-2xl bg-[var(--surface)] p-4">
                  <p className="text-sm font-medium text-[var(--text)]">{t(language, 'deepseekConsistency')}</p>
                  <div className="mt-3 space-y-1 text-xs text-[var(--text-secondary)]">
                    <p>{t(language, 'evalTechModelOverall', latestAiJudge.debug.consistency.modelProvidedOverall)}</p>
                    <p>{t(language, 'evalTechDerivedOverall', latestAiJudge.debug.consistency.derivedOverall)}</p>
                    <p>{t(language, 'evalTechFinalOverall', latestAiJudge.debug.consistency.usedOverall)}</p>
                  </div>
                </div>
              </div>
            </details>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{t(language, 'evalBetterExampleTitle')}</p>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{t(language, 'evalBetterExampleDescription')}</p>

        <div className="mt-5 space-y-4">
          {weakLayerKeys.map((key) => {
            const label = labels[key]
            const before = beforeTextForLayer(key, language, attempt)
            const after = afterTextForLayer(key, language, attempt)
            return (
              <div key={key} className="rounded-[24px] bg-[var(--surface-raised)] p-5">
                <p className="text-sm font-medium text-[var(--text)]">{label}</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--warning)]">{t(language, 'evalBefore')}</p>
                    <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                      {before || t(language, 'evalBeforeEmpty')}
                    </pre>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--success)]">{t(language, 'evalAfter')}</p>
                    <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">{after}</pre>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{t(language, 'layerBreakdown')}</p>
        <div className="mt-5 space-y-3">
          {layerScores.map(([key, label, score]) => {
            const pct = clamp((score / 10) * 100, 0, 100)
            const isWeak = key === weakestLayerKey
            return (
              <div key={key} className="rounded-2xl bg-[var(--surface-raised)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[var(--text)]">{label}</p>
                  <div className="flex items-center gap-2">
                    {isWeak ? (
                      <Pill tone="warning">{t(language, 'evalNeedsFocus')}</Pill>
                    ) : (
                      <Pill tone={score >= 8 ? 'success' : 'accent'}>{t(language, 'evalOk')}</Pill>
                    )}
                    <p className="text-sm text-[var(--text-secondary)]">{score} / 10</p>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-[var(--surface)]">
                  <div
                    className={`h-2 rounded-full ${isWeak ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{t(language, 'evalNextActionTitle')}</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">{t(language, 'evalNextActionHeading')}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{t(language, 'evalNextActionDescription')}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleFixMyAnswer}>
            {t(language, 'evalFixMyAnswer')}
          </Button>
          <Button variant="secondary" onClick={handleTryNewPractice}>
            {t(language, 'evalTryNewPractice')}
          </Button>
        </div>
      </SectionCard>
    </div>
  )
}

export default EvaluationPage
