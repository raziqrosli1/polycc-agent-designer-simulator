import type { GpridDraft, Language, LayerKey, ScenarioSnapshot } from '../types'

export interface LayerValidationResult {
  layer: LayerKey
  ready: boolean
  errors: string[]
  warnings: string[]
}

const weakWordPattern = /\busually\b|\bsometimes\b|\bappropriate\b|\badequate\b|\btry to\b/i
const measurablePattern = /\d|percent|%|reduce|increase|improve|faster|within/i

const uniqueValues = (values: string[]) =>
  new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)).size

const minimumLogicCards = (scenario: ScenarioSnapshot) => scenario.difficultyProfile.logicCount
const v = (language: Language, en: string, ms: string) =>
  language === 'ms' ? ms : en

export const validateGoalLayer = (
  scenario: ScenarioSnapshot,
  draft: GpridDraft,
  language: Language,
): LayerValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (draft.goal.primary.trim().length < 12) {
    errors.push(
      v(
        language,
        'Primary goal must clearly state the agent outcome.',
        'Goal utama mesti menyatakan hasil ejen dengan jelas.',
      ),
    )
  }

  if (!measurablePattern.test(draft.goal.primary)) {
    warnings.push(
      v(
        language,
        'Goal would be stronger with a measurable or bounded success signal.',
        'Goal akan lebih kuat jika mempunyai petunjuk kejayaan yang boleh diukur atau berbatas.',
      ),
    )
  }

  if (
    scenario.difficulty >= 2 &&
    draft.goal.secondary.trim() &&
    draft.goal.secondary.trim().toLowerCase() === draft.goal.primary.trim().toLowerCase()
  ) {
    warnings.push(
      v(
        language,
        'Secondary goal should add a distinct constraint or outcome.',
        'Goal kedua perlu menambah kekangan atau hasil yang berbeza.',
      ),
    )
  }

  return {
    layer: 'goal',
    ready: errors.length === 0,
    errors,
    warnings,
  }
}

export const validatePriorityLayer = (
  scenario: ScenarioSnapshot,
  draft: GpridDraft,
  language: Language,
): LayerValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  const filledValues = draft.priority.orderedValues.filter((value) => value.trim())

  if (filledValues.length < 4) {
    errors.push(
      v(
        language,
        'Priority ranking needs at least four filled values.',
        'Susunan priority memerlukan sekurang-kurangnya empat nilai yang diisi.',
      ),
    )
  }

  if (uniqueValues(draft.priority.orderedValues) !== filledValues.length) {
    errors.push(
      v(
        language,
        'Priority ranking contains duplicate values.',
        'Susunan priority mengandungi nilai yang berulang.',
      ),
    )
  }

  if (scenario.difficulty >= 4 && draft.priority.conflictNote.trim().length < 12) {
    errors.push(
      v(
        language,
        'Add a conflict note for higher difficulty scenarios.',
        'Tambahkan nota konflik untuk senario kesukaran lebih tinggi.',
      ),
    )
  }

  if (
    ['Healthcare', 'Emergency Response'].includes(scenario.domain) &&
    !filledValues[0]?.toLowerCase().includes('safety')
  ) {
    warnings.push(
      v(
        language,
        'Safety is usually expected at the top of risk-heavy scenarios.',
        'Safety biasanya dijangka berada di tempat teratas bagi senario yang berisiko tinggi.',
      ),
    )
  }

  return {
    layer: 'priority',
    ready: errors.length === 0,
    errors,
    warnings,
  }
}

export const validateRulesLayer = (
  _scenario: ScenarioSnapshot,
  draft: GpridDraft,
  language: Language,
): LayerValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (draft.rules.length < 3) {
    errors.push(
      v(language, 'At least three rules are required.', 'Sekurang-kurangnya tiga rules diperlukan.'),
    )
  }

  draft.rules.forEach((rule, index) => {
    if (!rule.statement.trim()) {
      errors.push(
        v(
          language,
          `Rule ${index + 1} needs a clear statement.`,
          `Rule ${index + 1} memerlukan pernyataan yang jelas.`,
        ),
      )
    }
    if (!rule.reasoning.trim()) {
      errors.push(
        v(
          language,
          `Rule ${index + 1} needs supporting reasoning.`,
          `Rule ${index + 1} memerlukan justifikasi sokongan.`,
        ),
      )
    }
    if (weakWordPattern.test(rule.statement)) {
      warnings.push(
        v(
          language,
          `Rule ${index + 1} uses vague wording and may be hard to test.`,
          `Rule ${index + 1} menggunakan frasa kabur dan mungkin sukar diuji.`,
        ),
      )
    }
  })

  const normalizedStatements = draft.rules.map((rule) => rule.statement.trim().toLowerCase())
  const duplicateStatements = normalizedStatements.some(
    (statement, index) => statement && normalizedStatements.indexOf(statement) !== index,
  )
  if (duplicateStatements) {
    warnings.push(
      v(
        language,
        'Some rules appear duplicated or too similar to each other.',
        'Sesetengah rules kelihatan berulang atau terlalu serupa antara satu sama lain.',
      ),
    )
  }

  return {
    layer: 'rules',
    ready: errors.length === 0,
    errors,
    warnings,
  }
}

export const validateLogicLayer = (
  scenario: ScenarioSnapshot,
  draft: GpridDraft,
  language: Language,
): LayerValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  const minimumCount = minimumLogicCards(scenario)

  if (draft.logic.length < minimumCount) {
    errors.push(
      v(
        language,
        `Logic requires at least ${minimumCount} cards at this difficulty.`,
        `Logic memerlukan sekurang-kurangnya ${minimumCount} kad pada tahap kesukaran ini.`,
      ),
    )
  }

  draft.logic.forEach((item, index) => {
    if (!item.if.trim()) {
      errors.push(
        v(
          language,
          `Logic card ${index + 1} needs an IF condition.`,
          `Kad logic ${index + 1} memerlukan keadaan IF.`,
        ),
      )
    }
    if (!item.then.trim()) {
      errors.push(
        v(
          language,
          `Logic card ${index + 1} needs a THEN action.`,
          `Kad logic ${index + 1} memerlukan tindakan THEN.`,
        ),
      )
    }
    if (!item.because.trim()) {
      errors.push(
        v(
          language,
          `Logic card ${index + 1} needs a BECAUSE rationale.`,
          `Kad logic ${index + 1} memerlukan rasional BECAUSE.`,
        ),
      )
    }
    if (scenario.difficulty >= 5 && !item.else.trim()) {
      errors.push(
        v(
          language,
          `Logic card ${index + 1} needs an ELSE branch at this level.`,
          `Kad logic ${index + 1} memerlukan cabang ELSE pada tahap ini.`,
        ),
      )
    }
    if (
      scenario.difficulty >= 8 &&
      scenario.difficultyProfile.agentCount === 'multi' &&
      !item.agentCoordination.trim()
    ) {
      warnings.push(
        v(
          language,
          `Logic card ${index + 1} should mention multi-agent coordination.`,
          `Kad logic ${index + 1} perlu menyebut koordinasi multi-agent.`,
        ),
      )
    }
  })

  if (draft.logic.length < scenario.risks.length) {
    warnings.push(
      v(
        language,
        'Logic may not cover all major scenario risks yet.',
        'Logic mungkin belum meliputi semua risiko utama senario.',
      ),
    )
  }

  return {
    layer: 'logic',
    ready: errors.length === 0,
    errors,
    warnings,
  }
}

export const validateDecisionLayer = (
  scenario: ScenarioSnapshot,
  draft: GpridDraft,
  language: Language,
): LayerValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (draft.decision.statement.trim().length < 12) {
    errors.push(
      v(
        language,
        'Decision statement must clearly resolve the sample situation.',
        'Pernyataan decision mesti menyelesaikan situasi contoh dengan jelas.',
      ),
    )
  }

  if (draft.decision.reasoning.trim().length < 24) {
    errors.push(
      v(
        language,
        'Decision reasoning needs to explain how the framework led to the choice.',
        'Justifikasi decision perlu menerangkan bagaimana rangka kerja membawa kepada pilihan tersebut.',
      ),
    )
  }

  if (!/goal|priority|rule|logic/i.test(draft.decision.reasoning)) {
    warnings.push(
      v(
        language,
        'Decision reasoning should explicitly reference the GPRID framework.',
        'Justifikasi decision perlu merujuk secara jelas kepada rangka kerja GPRID.',
      ),
    )
  }

  if (
    scenario.difficultyProfile.informationCompleteness === 'minimal' &&
    draft.decision.confidence === 'high'
  ) {
    warnings.push(
      v(
        language,
        'High confidence may be over-assertive under minimal information.',
        'Keyakinan tinggi mungkin terlalu yakin apabila maklumat minimum.',
      ),
    )
  }

  return {
    layer: 'decision',
    ready: errors.length === 0,
    errors,
    warnings,
  }
}

export const getValidationMap = (
  scenario: ScenarioSnapshot,
  draft: GpridDraft,
  language: Language = 'en',
): Record<LayerKey, LayerValidationResult> => ({
  goal: validateGoalLayer(scenario, draft, language),
  priority: validatePriorityLayer(scenario, draft, language),
  rules: validateRulesLayer(scenario, draft, language),
  logic: validateLogicLayer(scenario, draft, language),
  decision: validateDecisionLayer(scenario, draft, language),
})
