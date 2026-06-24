import { RUBRIC_VERSION } from './constants'
import { getValidationMap } from './validation'
import type {
  EvaluationResult,
  GpridDraft,
  Language,
  LayerKey,
  ScenarioSnapshot,
} from '../types'

const clamp = (value: number, min = 0, max = 10) => Math.max(min, Math.min(max, value))
const hasMetric = (text: string) => /\d|percent|%|faster|reduce|increase|improve/i.test(text)
const hasWeakWord = (text: string) => /usually|sometimes|appropriate|adequate|try to/i.test(text)
const normalized = (text: string) => text.trim().toLowerCase()
const v = (language: Language, en: string, ms: string) =>
  language === 'ms' ? ms : en

export const evaluateSubmission = (
  scenario: ScenarioSnapshot,
  draft: GpridDraft,
  language: Language = 'en',
): EvaluationResult => {
  const validationMap = getValidationMap(scenario, draft, language)
  const strengths: string[] = []
  const weaknesses: string[] = []
  const blindSpots: string[] = []
  const diagnostics = {
    goal: {
      errors: validationMap.goal.errors.length,
      warnings: validationMap.goal.warnings.length,
    },
    priority: {
      errors: validationMap.priority.errors.length,
      warnings: validationMap.priority.warnings.length,
    },
    rules: {
      errors: validationMap.rules.errors.length,
      warnings: validationMap.rules.warnings.length,
    },
    logic: {
      errors: validationMap.logic.errors.length,
      warnings: validationMap.logic.warnings.length,
    },
    decision: {
      errors: validationMap.decision.errors.length,
      warnings: validationMap.decision.warnings.length,
    },
  }

  const scoreFromValidation = (base: number, layer: keyof typeof diagnostics) =>
    clamp(base - diagnostics[layer].errors * 2 - diagnostics[layer].warnings)

  let goal = draft.goal.primary.trim().length > 0 ? 4 : 0
  if (draft.goal.primary.trim().length >= 40) goal += 2
  if (hasMetric(draft.goal.primary)) goal += 2
  if (draft.goal.primary.toLowerCase().includes(scenario.domain.toLowerCase().split(' ')[0])) goal += 1
  if (draft.goal.primary.toLowerCase().includes('while')) goal += 1
  goal = scoreFromValidation(goal, 'goal')

  if (goal >= 7) {
    strengths.push(
      v(
        language,
        'Goal is clear and reasonably bounded for the scenario.',
        'Goal jelas dan mempunyai batas yang munasabah untuk senario ini.',
      ),
    )
  } else {
    weaknesses.push(
      v(
        language,
        'Goal needs a more measurable outcome and clearer scope.',
        'Goal memerlukan hasil yang lebih boleh diukur dan skop yang lebih jelas.',
      ),
    )
  }

  let priority = draft.priority.orderedValues.filter(Boolean).length >= 4 ? 5 : 2
  const uniqueValues = new Set(draft.priority.orderedValues.map(normalized).filter(Boolean)).size
  if (uniqueValues === draft.priority.orderedValues.filter(Boolean).length) priority += 2
  if (scenario.difficulty >= 4 && draft.priority.conflictNote.trim().length > 10) priority += 2
  if (
    draft.priority.orderedValues[0]?.toLowerCase().includes('safety') ||
    draft.priority.orderedValues[0]?.toLowerCase().includes('quality')
  ) {
    priority += 1
  }
  priority = scoreFromValidation(priority, 'priority')

  if (priority >= 7) {
    strengths.push(
      v(
        language,
        'Priority ranking creates a visible decision order.',
        'Susunan priority mewujudkan urutan keputusan yang jelas.',
      ),
    )
  } else {
    weaknesses.push(
      v(
        language,
        'Priority ordering is too thin or missing conflict handling.',
        'Susunan priority terlalu lemah atau tiada pengurusan konflik.',
      ),
    )
  }

  let rules = draft.rules.length >= 3 ? 5 : 2
  const testableRules = draft.rules.filter(
    (rule) => rule.reasoning.trim().length > 5 && !hasWeakWord(rule.statement),
  ).length
  rules += Math.min(3, testableRules)

  const contradiction = draft.rules.some((rule, index) =>
    draft.rules.some(
      (other, otherIndex) =>
        index !== otherIndex &&
        normalized(rule.statement) === normalized(other.statement) &&
        rule.type !== other.type,
    ),
  )

  if (!contradiction) {
    rules += 2
  } else {
    weaknesses.push(
      v(
        language,
        'At least one rule appears contradictory across the rule set.',
        'Sekurang-kurangnya satu rule kelihatan bercanggah dalam set rules ini.',
      ),
    )
  }

  rules = scoreFromValidation(rules, 'rules')
  if (rules >= 7) {
    strengths.push(
      v(
        language,
        'Rules are mostly testable and useful as hard boundaries.',
        'Rules kebanyakannya boleh diuji dan berguna sebagai sempadan tegas.',
      ),
    )
  } else {
    weaknesses.push(
      v(
        language,
        'Rules need clearer wording and stronger reasoning.',
        'Rules memerlukan bahasa yang lebih jelas dan justifikasi yang lebih kuat.',
      ),
    )
  }

  let logic = draft.logic.length >= scenario.difficultyProfile.logicCount ? 5 : 2
  const completeLogic = draft.logic.filter(
    (item) =>
      item.if.trim() &&
      item.then.trim() &&
      item.because.trim() &&
      (scenario.difficulty < 5 || item.else.trim()),
  ).length
  logic += Math.min(3, completeLogic)

  if (
    scenario.difficulty < 8 ||
    draft.logic.some((item) => item.agentCoordination.trim().length > 0)
  ) {
    logic += 1
  }

  if (draft.logic.length >= scenario.risks.length) logic += 1
  logic = scoreFromValidation(logic, 'logic')

  if (logic >= 7) {
    strengths.push(
      v(
        language,
        'Logic covers a useful portion of the scenario risks.',
        'Logic meliputi bahagian yang berguna daripada risiko senario.',
      ),
    )
  } else {
    weaknesses.push(
      v(
        language,
        'Logic coverage is incomplete or too shallow for the chosen level.',
        'Liputan logic tidak lengkap atau terlalu cetek untuk tahap yang dipilih.',
      ),
    )
  }

  let decision = draft.decision.statement.trim() ? 4 : 0
  if (draft.decision.reasoning.trim().length > 40) decision += 2
  if (
    draft.decision.reasoning.toLowerCase().includes('priority') ||
    draft.decision.reasoning.toLowerCase().includes('rule')
  ) {
    decision += 2
  }
  if (draft.decision.confidence) decision += 1
  if (
    draft.decision.statement.toLowerCase().includes('escalate') ||
    draft.decision.statement.toLowerCase().includes('prioritize')
  ) {
    decision += 1
  }
  decision = scoreFromValidation(decision, 'decision')

  if (decision >= 7) {
    strengths.push(
      v(
        language,
        'Decision is traceable back to the framework.',
        'Decision boleh dijejak semula kepada rangka kerja.',
      ),
    )
  } else {
    weaknesses.push(
      v(
        language,
        'Decision rationale does not clearly connect to the earlier layers.',
        'Justifikasi decision tidak jelas berkait dengan lapisan terdahulu.',
      ),
    )
  }

  const total = (goal + priority + rules + logic + decision) * 2

  scenario.risks.slice(Math.min(draft.logic.length, scenario.risks.length)).forEach((risk) => {
    blindSpots.push(
      v(
        language,
        `The design does not clearly cover the risk: ${risk}.`,
        `Reka bentuk ini tidak meliputi risiko ini dengan jelas: ${risk}.`,
      ),
    )
  })

  if (blindSpots.length === 0) {
    blindSpots.push(
      v(
        language,
        'Coverage is strong, but retry the scenario to tighten edge-case reasoning.',
        'Liputan adalah baik, tetapi cuba semula senario untuk mengukuhkan penaakulan kes pinggir.',
      ),
    )
  }

  const layerScores: Array<[LayerKey, number]> = [
    ['goal', goal],
    ['priority', priority],
    ['rules', rules],
    ['logic', logic],
    ['decision', decision],
  ]
  const weakestLayer = layerScores.sort((left, right) => left[1] - right[1])[0][0]

  const recommendationByLayer: Record<LayerKey, string> = {
    goal:
      v(
        language,
        'Rewrite the goal so it names a measurable outcome, a target stakeholder, and a clear boundary for success.',
        'Tulis semula goal supaya ia menyatakan hasil yang boleh diukur, pihak sasaran, dan sempadan kejayaan yang jelas.',
      ),
    priority:
      v(
        language,
        'Clarify which value wins under pressure and explain how the top priorities resolve conflict in this scenario.',
        'Jelaskan nilai mana yang menang di bawah tekanan dan terangkan bagaimana priority teratas menyelesaikan konflik dalam senario ini.',
      ),
    rules:
      v(
        language,
        'Convert broad intentions into hard rules that are testable, specific, and free from vague wording.',
        'Tukarkan niat umum kepada hard rules yang boleh diuji, khusus, dan bebas daripada bahasa kabur.',
      ),
    logic:
      v(
        language,
        'Expand the if-then layer so each major risk has a visible branch, and make the fallback path explicit when uncertainty rises.',
        'Luaskan lapisan if-then supaya setiap risiko utama mempunyai cabang yang jelas, dan nyatakan laluan fallback apabila ketidakpastian meningkat.',
      ),
    decision:
      v(
        language,
        'Tie the final decision back to the goal, top priority, and at least one hard rule so the outcome feels fully traceable.',
        'Hubungkan decision akhir semula kepada goal, priority teratas, dan sekurang-kurangnya satu hard rule supaya hasilnya boleh dijejak sepenuhnya.',
      ),
  }

  const totalErrors = Object.values(diagnostics).reduce((sum, item) => sum + item.errors, 0)
  const totalWarnings = Object.values(diagnostics).reduce(
    (sum, item) => sum + item.warnings,
    0,
  )

  return {
    rubricVersion: RUBRIC_VERSION,
    scores: {
      goal,
      priority,
      rules,
      logic,
      decision,
      total,
    },
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    blindSpots: blindSpots.slice(0, 2),
    expertRecommendation: recommendationByLayer[weakestLayer],
    diagnostics: {
      weakestLayer,
      totalErrors,
      totalWarnings,
      layers: diagnostics,
    },
  }
}
