import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import BeginnerExampleCard from '../components/BeginnerExampleCard'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import Button from '../components/ui/Button'
import Pill from '../components/ui/Pill'
import { beginnerExamples } from '../lib/beginnerExamples'
import { t } from '../lib/copy'
import { LAYERS } from '../lib/constants'
import { ROUTES } from '../lib/routes'
import { getValidationMap } from '../lib/validation'
import { useAppStore } from '../store/appStore'
import type { LayerKey, LogicDraft, RuleDraft } from '../types'

const layerOrder: LayerKey[] = ['goal', 'priority', 'rules', 'logic', 'decision']

function WorkspacePage() {
  const navigate = useNavigate()
  const language = useAppStore((state) => state.language)
  const beginnerMode = useAppStore((state) => state.beginnerMode)
  const setBeginnerMode = useAppStore((state) => state.setBeginnerMode)
  const scenario = useAppStore((state) => state.activeScenario)
  const draft = useAppStore((state) => state.activeDraft)
  const updateGoal = useAppStore((state) => state.updateGoal)
  const updatePriorityValue = useAppStore((state) => state.updatePriorityValue)
  const movePriority = useAppStore((state) => state.movePriority)
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

  const completionSet = useMemo(
    () => new Set(draft?.completedLayers ?? []),
    [draft?.completedLayers],
  )

  if (!scenario || !draft) {
    return <Navigate to={ROUTES.generator} replace />
  }

  const validationMap = getValidationMap(scenario, draft, language)
  const incompleteLayers = layerOrder.filter((layer) => !completionSet.has(layer))
  const invalidLayers = layerOrder.filter((layer) => !validationMap[layer].ready)
  const canSubmit = incompleteLayers.length === 0 && invalidLayers.length === 0
  const decisionStatementLength = draft.decision.statement.trim().length
  const decisionReasoningLength = draft.decision.reasoning.trim().length
  const decisionValidation = validationMap.decision
  const readinessLabels =
    language === 'ms'
      ? {
          checklistTitle: 'Senarai Semak Decision',
          checklistDescription:
            'Gunakan senarai ini untuk memahami dengan tepat apa yang masih menghalang lapisan Decision daripada siap.',
          validationResult: 'Hasil validasi',
          missingRequirement: 'Keperluan yang masih kurang',
          requirementMet: 'Keperluan dipenuhi',
          noBlockingErrors: 'Tiada ralat validasi yang menghalang.',
          completionHint:
            'Klik Tanda Decision Selesai hanya selepas semua syarat di bawah dipenuhi.',
          submissionTitle: 'Status Penghantaran',
          submissionReady:
            'Kelima-lima lapisan telah lengkap dan sah. Penghantaran sedia untuk dinilai.',
          completedLayers: 'Lapisan selesai',
          remainingSteps: 'Langkah selesai yang belum dibuat',
          failingValidation: 'Lapisan yang masih gagal validasi',
          noIssues: 'Tiada isu penghantaran yang tinggal.',
          pass: 'LULUS',
          fail: 'GAGAL',
        }
      : {
          checklistTitle: 'Decision Readiness Checklist',
          checklistDescription:
            'Use this checklist to see exactly what is still blocking the Decision layer.',
          validationResult: 'Validation result',
          missingRequirement: 'Missing requirement',
          requirementMet: 'Requirement met',
          noBlockingErrors: 'No blocking validation errors remain.',
          completionHint:
            'Use Mark Decision Complete only after every requirement below is satisfied.',
          submissionTitle: 'Submission Status',
          submissionReady:
            'All five layers are complete and valid. Submission is ready for evaluation.',
          completedLayers: 'Completed layers',
          remainingSteps: 'Remaining completion steps',
          failingValidation: 'Layers still failing validation',
          noIssues: 'No submission blockers remain.',
          pass: 'PASS',
          fail: 'FAIL',
        }
  const decisionDebugChecks = [
    {
      label: 'Decision statement threshold',
      passed: decisionStatementLength >= 12,
      detail: `${decisionStatementLength}/12 characters`,
      missing:
        decisionStatementLength >= 12
          ? readinessLabels.requirementMet
          : 'Enter at least 12 non-space characters in the decision statement.',
    },
    {
      label: 'Decision reasoning threshold',
      passed: decisionReasoningLength >= 24,
      detail: `${decisionReasoningLength}/24 characters`,
      missing:
        decisionReasoningLength >= 24
          ? readinessLabels.requirementMet
          : 'Enter at least 24 non-space characters in the decision reasoning.',
    },
    {
      label: 'Decision layer validation result',
      passed: decisionValidation.ready,
      detail: decisionValidation.ready ? 'ready = true' : 'ready = false',
      missing:
        decisionValidation.ready
          ? readinessLabels.noBlockingErrors
          : decisionValidation.errors[0] ?? 'Blocking validation error still present.',
    },
    {
      label: 'Decision completion state',
      passed: completionSet.has('decision'),
      detail: completionSet.has('decision')
        ? 'completedLayers includes "decision"'
        : 'completedLayers does not include "decision"',
      missing: completionSet.has('decision')
        ? 'Decision layer is already marked complete.'
        : 'Clicking Mark Decision Complete will only update the store after validation passes.',
    },
  ]

  const canAccess = (layer: LayerKey) => {
    const index = layerOrder.indexOf(layer)
    if (index === 0) return true
    return completionSet.has(layerOrder[index - 1])
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

  const handleSubmit = () => {
    if (incompleteLayers.length > 0) {
      setNotice(t(language, 'submitFinishAll'))
      return
    }

    const invalidLayer = invalidLayers[0]
    if (invalidLayer) {
      setNotice(t(language, 'resolveValidation', invalidLayer))
      return
    }

    const attempt = submitDraft()
    if (attempt) {
      navigate(`${ROUTES.evaluation}/${attempt.id}`)
    }
  }

  const panelClass = (layer: LayerKey) =>
    `rounded-[var(--radius-card)] border p-4 transition sm:p-5 ${
      canAccess(layer)
        ? 'border-[var(--border)] bg-[var(--surface)]'
        : 'pointer-events-none border-transparent bg-[color:rgba(19,19,26,0.45)] opacity-60'
    } ${completionSet.has(layer) ? 'ring-1 ring-[var(--accent)]' : ''}`

  const renderValidationBlock = (layer: LayerKey) => {
    const result = validationMap[layer]
    const items = [...result.errors, ...result.warnings]

    if (items.length === 0) {
      return (
        <p className="mt-3 text-sm text-[var(--success)]">
          {t(language, 'layerReady')}
        </p>
      )
    }

    return (
      <div className="mt-3 space-y-2">
        {result.errors.map((error) => (
          <p key={error} className="text-sm text-[var(--danger)]">
            • {error}
          </p>
        ))}
        {result.warnings.map((warning) => (
          <p key={warning} className="text-sm text-[var(--warning)]">
            • {warning}
          </p>
        ))}
      </div>
    )
  }

  const renderRuleCard = (rule: RuleDraft, index: number) => (
    <div
      key={rule.id}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
    >
      <div className="grid gap-3 md:grid-cols-[140px_1fr]">
        <select
          value={rule.type}
          onChange={(event) => updateRule(rule.id, 'type', event.target.value)}
          aria-label={`Rule ${index + 1} type`}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
        >
          <option value="MUST">MUST</option>
          <option value="MUST_NOT">MUST NOT</option>
          <option value="ALWAYS">ALWAYS</option>
          <option value="NEVER">NEVER</option>
        </select>
        <input
          value={rule.statement}
          onChange={(event) => updateRule(rule.id, 'statement', event.target.value)}
          placeholder={`Rule ${index + 1} statement`}
          aria-label={`Rule ${index + 1} statement`}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
        />
      </div>
      <textarea
        value={rule.reasoning}
        onChange={(event) => updateRule(rule.id, 'reasoning', event.target.value)}
        placeholder={t(language, 'ruleReasoningPlaceholder')}
        rows={3}
        aria-label={`Rule ${index + 1} reasoning`}
        className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
      />
      {draft.rules.length > 3 ? (
        <button
          type="button"
          onClick={() => removeRule(rule.id)}
          className="mt-3 text-sm text-[var(--danger)]"
        >
          {t(language, 'removeRule')}
        </button>
      ) : null}
    </div>
  )

  const renderLogicCard = (item: LogicDraft, index: number) => (
    <div
      key={item.id}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Logic Card {index + 1}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <input
          value={item.if}
          onChange={(event) => updateLogic(item.id, 'if', event.target.value)}
          placeholder={t(language, 'ifPlaceholder')}
          aria-label={`Logic card ${index + 1} IF condition`}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
        />
        <input
          value={item.then}
          onChange={(event) => updateLogic(item.id, 'then', event.target.value)}
          placeholder={t(language, 'thenPlaceholder')}
          aria-label={`Logic card ${index + 1} THEN action`}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
        />
      </div>
      <textarea
        value={item.because}
        onChange={(event) => updateLogic(item.id, 'because', event.target.value)}
        placeholder={t(language, 'becausePlaceholder')}
        rows={3}
        aria-label={`Logic card ${index + 1} BECAUSE rationale`}
        className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
      />
      {scenario.difficulty >= 5 ? (
        <input
          value={item.else}
          onChange={(event) => updateLogic(item.id, 'else', event.target.value)}
          placeholder={t(language, 'elsePlaceholder')}
          aria-label={`Logic card ${index + 1} ELSE branch`}
          className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
        />
      ) : null}
      {scenario.difficulty >= 8 ? (
        <input
          value={item.agentCoordination}
          onChange={(event) =>
            updateLogic(item.id, 'agentCoordination', event.target.value)
          }
          placeholder={t(language, 'coordinationPlaceholder')}
          aria-label={`Logic card ${index + 1} coordination note`}
          className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
        />
      ) : null}
      {draft.logic.length > scenario.difficultyProfile.logicCount ? (
        <button
          type="button"
          onClick={() => removeLogic(item.id)}
          className="mt-3 text-sm text-[var(--danger)]"
        >
          {t(language, 'removeLogicCard')}
        </button>
      ) : null}
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 lg:sticky lg:top-28 lg:h-fit">
        <PageHeader
          eyebrow={t(language, 'gpridSpine')}
          title={t(language, 'gpridTitle')}
          description={t(language, 'gpridDescription')}
        />
        <div className="mt-4 space-y-3">
          {LAYERS.map((layer, index) => (
            <div key={layer.key} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                  completionSet.has(layer.key)
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-medium">{layer.label}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {completionSet.has(layer.key)
                    ? t(language, 'complete')
                    : validationMap[layer.key].errors.length > 0
                      ? t(language, 'needsWork')
                      : t(language, 'pending')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="space-y-6">
        <SectionCard>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <Pill>{scenario.domain}</Pill>
            <Pill tone="accent">
              Level {scenario.difficulty} — {scenario.difficultyLabel}
            </Pill>
            <Pill>{scenario.seed}</Pill>
            <Button
              variant={beginnerMode ? 'primary' : 'secondary'}
              onClick={() => setBeginnerMode(!beginnerMode)}
              className="px-3 py-1.5 text-xs"
            >
              {t(language, 'beginnerMode')}: {beginnerMode ? 'ON' : 'OFF'}
            </Button>
          </div>
          <h2 className="mt-3 text-2xl font-medium">{scenario.title}</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {scenario.context}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {t(language, 'objective')}
              </p>
              <p className="mt-2 text-sm">{scenario.objective}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {t(language, 'sampleSituation')}
              </p>
              <p className="mt-2 text-sm">{scenario.sampleSituation}</p>
            </div>
          </div>
        </SectionCard>

        <section className={panelClass('goal')}>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Layer 1
          </p>
          <h3 className="mt-2 text-xl font-medium">{t(language, 'goalDesign')}</h3>
          <textarea
            value={draft.goal.primary}
            onChange={(event) => updateGoal('primary', event.target.value)}
            rows={3}
            placeholder={t(language, 'goalPlaceholder')}
            aria-label={t(language, 'goalDesign')}
            className="mt-4 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
          />
          {scenario.difficulty >= 2 ? (
            <textarea
              value={draft.goal.secondary}
              onChange={(event) => updateGoal('secondary', event.target.value)}
              rows={2}
              placeholder={t(language, 'secondaryGoalPlaceholder')}
              aria-label={t(language, 'secondaryGoalPlaceholder')}
              className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
            />
          ) : null}
          {beginnerMode ? (
            <BeginnerExampleCard
              title={t(language, 'beginnerGoal')}
              items={[beginnerExamples[language].goal]}
            />
          ) : null}
          {renderValidationBlock('goal')}
          <Button variant="primary" onClick={() => completeLayer('goal')} className="mt-4">
            {t(language, 'markGoalComplete')}
          </Button>
        </section>

        <section className={panelClass('priority')}>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Layer 2
          </p>
          <h3 className="mt-2 text-xl font-medium">{t(language, 'priorityDesign')}</h3>
          <div className="mt-4 space-y-3">
            {draft.priority.orderedValues.map((value, index) => (
              <div key={`${index}-${value}`} className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] text-sm">
                  {index + 1}
                </div>
                <input
                  value={value}
                  onChange={(event) => updatePriorityValue(index, event.target.value)}
                  aria-label={`${t(language, 'priorityDesign')} ${index + 1}`}
                  className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                />
                <div className="flex gap-2 sm:self-start">
                  <button
                    type="button"
                    onClick={() => movePriority(index, 'up')}
                    aria-label={`Move priority ${index + 1} up`}
                    className="rounded-2xl border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => movePriority(index, 'down')}
                    aria-label={`Move priority ${index + 1} down`}
                    className="rounded-2xl border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    Down
                  </button>
                </div>
              </div>
            ))}
          </div>
          {scenario.difficulty >= 4 ? (
            <textarea
              value={draft.priority.conflictNote}
              onChange={(event) => setConflictNote(event.target.value)}
              rows={3}
              placeholder={t(language, 'conflictPlaceholder')}
              aria-label={t(language, 'conflictPlaceholder')}
              className="mt-4 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
            />
          ) : null}
          {beginnerMode ? (
            <BeginnerExampleCard
              title={t(language, 'beginnerPriority')}
              items={beginnerExamples[language].priority}
            />
          ) : null}
          {renderValidationBlock('priority')}
          <Button variant="primary" onClick={() => completeLayer('priority')} className="mt-4">
            {t(language, 'markPriorityComplete')}
          </Button>
        </section>

        <section className={panelClass('rules')}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Layer 3
              </p>
              <h3 className="mt-2 text-xl font-medium">{t(language, 'rulesDesign')}</h3>
            </div>
            <Button variant="secondary" onClick={addRule}>
              {t(language, 'addRule')}
            </Button>
          </div>
          <div className="mt-4 space-y-4">{draft.rules.map(renderRuleCard)}</div>
          {beginnerMode ? (
            <BeginnerExampleCard
              title={t(language, 'beginnerRules')}
              items={beginnerExamples[language].rules}
            />
          ) : null}
          {renderValidationBlock('rules')}
          <Button variant="primary" onClick={() => completeLayer('rules')} className="mt-4">
            {t(language, 'markRulesComplete')}
          </Button>
        </section>

        <section className={panelClass('logic')}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Layer 4
              </p>
              <h3 className="mt-2 text-xl font-medium">{t(language, 'logicDesign')}</h3>
            </div>
            <Button variant="secondary" onClick={addLogicRule}>
              {t(language, 'addLogicCard')}
            </Button>
          </div>
          <div className="mt-4 space-y-4">{draft.logic.map(renderLogicCard)}</div>
          {beginnerMode ? (
            <BeginnerExampleCard
              title={t(language, 'beginnerLogic')}
              items={beginnerExamples[language].logic}
            />
          ) : null}
          {renderValidationBlock('logic')}
          <Button variant="primary" onClick={() => completeLayer('logic')} className="mt-4">
            {t(language, 'markLogicComplete')}
          </Button>
        </section>

        <section className={panelClass('decision')}>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Layer 5
          </p>
          <h3 className="mt-2 text-xl font-medium">{t(language, 'decisionOutput')}</h3>
          <input
            value={draft.decision.statement}
            onChange={(event) => updateDecision('statement', event.target.value)}
            placeholder={t(language, 'decisionStatementPlaceholder')}
            aria-label={t(language, 'decisionStatementPlaceholder')}
            className="mt-4 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
          />
          <textarea
            value={draft.decision.reasoning}
            onChange={(event) => updateDecision('reasoning', event.target.value)}
            rows={4}
            placeholder={t(language, 'decisionReasoningPlaceholder')}
            aria-label={t(language, 'decisionReasoningPlaceholder')}
            className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
          />
          <select
            value={draft.decision.confidence}
            onChange={(event) => updateDecision('confidence', event.target.value)}
            aria-label="Decision confidence"
            className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
          >
            <option value="low">{t(language, 'lowConfidence')}</option>
            <option value="medium">{t(language, 'mediumConfidence')}</option>
            <option value="high">{t(language, 'highConfidence')}</option>
          </select>
          {beginnerMode ? (
            <BeginnerExampleCard
              title={t(language, 'beginnerDecision')}
              items={[beginnerExamples[language].decision]}
            />
          ) : null}
          {renderValidationBlock('decision')}
          <div className="mt-4 rounded-2xl border border-[color:rgba(91,123,245,0.2)] bg-[color:rgba(91,123,245,0.08)] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              {readinessLabels.checklistTitle}
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {readinessLabels.checklistDescription}
            </p>
            <div className="mt-3 space-y-3">
              {decisionDebugChecks.map((check) => (
                <div
                  key={check.label}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        check.passed
                          ? 'bg-[color:rgba(52,211,153,0.15)] text-[var(--success)]'
                          : 'bg-[color:rgba(248,113,113,0.12)] text-[var(--danger)]'
                      }`}
                    >
                      {check.passed ? readinessLabels.pass : readinessLabels.fail}
                    </span>
                    <p className="text-sm font-medium text-[var(--text)]">{check.label}</p>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {readinessLabels.validationResult}: {check.detail}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {readinessLabels.missingRequirement}: {check.missing}
                  </p>
                </div>
              ))}
              {decisionValidation.errors.length > 0 ? (
                <div className="rounded-xl border border-[color:rgba(248,113,113,0.22)] bg-[color:rgba(248,113,113,0.08)] p-3">
                  <p className="text-sm font-medium text-[var(--danger)]">Failed rules</p>
                  <div className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                    {decisionValidation.errors.map((error) => (
                      <p key={error}>• {error}</p>
                    ))}
                  </div>
                </div>
              ) : null}
              <p className="text-sm text-[var(--text-secondary)]">
                {readinessLabels.completionHint}
              </p>
            </div>
          </div>
          {!canSubmit ? (
            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <p className="text-sm font-medium text-[var(--text)]">
                {readinessLabels.submissionTitle}
              </p>
              <div className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                <p>
                  {readinessLabels.completedLayers}: {layerOrder.length - incompleteLayers.length}/
                  {layerOrder.length}
                </p>
                {incompleteLayers.length > 0 ? (
                  <p>{readinessLabels.remainingSteps}: {incompleteLayers.join(', ')}</p>
                ) : null}
                {invalidLayers.length > 0 ? (
                  <p>{readinessLabels.failingValidation}: {invalidLayers.join(', ')}</p>
                ) : null}
                {incompleteLayers.length === 0 && invalidLayers.length === 0 ? (
                  <p>{readinessLabels.noIssues}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--success)]">
              {readinessLabels.submissionReady}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => completeLayer('decision')}>
              {t(language, 'markDecisionComplete')}
            </Button>
            <Button variant="secondary" onClick={handleSubmit} disabled={!canSubmit}>
              {t(language, 'submitForEvaluation')}
            </Button>
          </div>
        </section>

        {notice ? (
          <p aria-live="polite" className="text-sm text-[var(--text-secondary)]">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default WorkspacePage
