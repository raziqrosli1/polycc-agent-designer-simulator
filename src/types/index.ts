export type DomainKey =
  | 'Education'
  | 'Career Development'
  | 'Internship Placement'
  | 'Student Success'
  | 'Healthcare'
  | 'Emergency Response'
  | 'Customer Service'
  | 'Finance'
  | 'Smart City'
  | 'Project Management'

export type LayerKey = 'goal' | 'priority' | 'rules' | 'logic' | 'decision'
export type ThemeMode = 'dark' | 'light'
export type Language = 'en' | 'ms'
export type RuleType = 'MUST' | 'MUST_NOT' | 'ALWAYS' | 'NEVER'
export type ConfidenceLevel = 'low' | 'medium' | 'high'

export interface DifficultyProfile {
  label: string
  timePressure: boolean
  informationCompleteness: 'full' | 'partial' | 'minimal'
  competingObjectives: 'none' | 'soft_conflict' | 'hard_conflict'
  agentCount: 'single' | 'multi'
  environmentalStability: 'static' | 'dynamic' | 'chaotic'
  constraintCount: number
  riskCount: number
  logicCount: number
}

export interface ScenarioSnapshot {
  id: string
  seed: string
  generatorVersion: string
  domain: DomainKey
  difficulty: number
  difficultyLabel: string
  difficultyProfile: DifficultyProfile
  family: string
  title: string
  context: string
  agentRole: string
  objective: string
  constraints: string[]
  risks: string[]
  stakeholders: string[]
  defaultPriorities: string[]
  sampleSituation: string
}

export interface GoalDraft {
  primary: string
  secondary: string
}

export interface PriorityDraft {
  orderedValues: string[]
  conflictNote: string
}

export interface RuleDraft {
  id: string
  type: RuleType
  statement: string
  reasoning: string
}

export interface LogicDraft {
  id: string
  if: string
  then: string
  because: string
  else: string
  agentCoordination: string
}

export interface DecisionDraft {
  statement: string
  reasoning: string
  confidence: ConfidenceLevel
}

export interface GpridDraft {
  id: string
  scenarioId: string
  seed: string
  createdAt: string
  updatedAt: string
  completedLayers: LayerKey[]
  goal: GoalDraft
  priority: PriorityDraft
  rules: RuleDraft[]
  logic: LogicDraft[]
  decision: DecisionDraft
}

export interface EvaluationResult {
  rubricVersion: string
  scores: {
    goal: number
    priority: number
    rules: number
    logic: number
    decision: number
    total: number
  }
  strengths: string[]
  weaknesses: string[]
  blindSpots: string[]
  expertRecommendation: string
  diagnostics: {
    weakestLayer: LayerKey
    totalErrors: number
    totalWarnings: number
    layers: Record<LayerKey, { errors: number; warnings: number }>
  }
}

export interface DeepSeekJudgeScores {
  goal: number
  priority: number
  rules: number
  logic: number
  decision: number
  overall: number
}

export interface DeepSeekJudgeDebug {
  rawApiResponse: string
  rawContent: string
  parsedResponse: {
    goalScore: number
    priorityScore: number
    rulesScore: number
    logicScore: number
    decisionScore: number
    overallScore: number
    strengths: string[]
    weaknesses: string[]
    blindSpots: string[]
    improvements: string[]
    howATopTeamWouldImproveThis: string[]
  }
  finalUiValues: DeepSeekJudgeScores
  consistency: {
    modelProvidedOverall: number
    derivedOverall: number
    usedOverall: number
    fallbackApplied: boolean
    reason: string
  }
}

export interface DeepSeekJudgeEvaluation {
  id: string
  provider: 'deepseek'
  model: string
  createdAt: string
  scores: DeepSeekJudgeScores
  strengths: string[]
  weaknesses: string[]
  blindSpots: string[]
  improvements: string[]
  topTeamImprovements: string[]
  debug: DeepSeekJudgeDebug
}

export interface AttemptRecord {
  id: string
  scenario: ScenarioSnapshot
  submission: GpridDraft
  evaluation: EvaluationResult
  aiJudgeHistory: DeepSeekJudgeEvaluation[]
  createdAt: string
}
