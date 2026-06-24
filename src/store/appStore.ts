import { runDeepSeekJudge } from '../lib/deepseekJudge'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { evaluateSubmission } from '../lib/evaluation'
import { STORAGE_KEY, STORAGE_VERSION } from '../lib/constants'
import { generateScenario } from '../lib/scenario'
import type {
  AttemptRecord,
  ConfidenceLevel,
  DomainKey,
  GpridDraft,
  Language,
  LayerKey,
  LogicDraft,
  RuleDraft,
  ScenarioSnapshot,
  ThemeMode,
} from '../types'

interface AppState {
  theme: ThemeMode
  language: Language
  beginnerMode: boolean
  tutorialCompleted: boolean
  generatorDomain: DomainKey
  generatorDifficulty: number
  seedInput: string
  generatorPreview: ScenarioSnapshot | null
  activeScenario: ScenarioSnapshot | null
  activeDraft: GpridDraft | null
  attempts: AttemptRecord[]
  latestAttemptId: string | null
  aiJudgeStatus: 'idle' | 'loading' | 'success' | 'error'
  aiJudgeError: string | null
  setTheme: (theme: ThemeMode) => void
  setLanguage: (language: Language) => void
  setBeginnerMode: (enabled: boolean) => void
  completeTutorial: () => void
  setGeneratorDomain: (domain: DomainKey) => void
  setGeneratorDifficulty: (difficulty: number) => void
  setSeedInput: (seed: string) => void
  previewScenario: () => void
  startScenario: () => void
  retrySeed: (seed: string, domain: DomainKey, difficulty: number) => void
  updateGoal: (field: 'primary' | 'secondary', value: string) => void
  updatePriorityValue: (index: number, value: string) => void
  movePriority: (index: number, direction: 'up' | 'down') => void
  setConflictNote: (value: string) => void
  addRule: () => void
  updateRule: (id: string, field: keyof Omit<RuleDraft, 'id'>, value: string) => void
  removeRule: (id: string) => void
  addLogicRule: () => void
  updateLogic: (id: string, field: keyof Omit<LogicDraft, 'id'>, value: string) => void
  removeLogic: (id: string) => void
  updateDecision: (
    field: 'statement' | 'reasoning' | 'confidence',
    value: string,
  ) => void
  markLayerComplete: (layer: LayerKey) => void
  submitDraft: () => AttemptRecord | null
  evaluateAttemptWithDeepSeek: (attemptId: string) => Promise<AttemptRecord | null>
  clearAiJudgeError: () => void
}

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

const createDraft = (scenario: ScenarioSnapshot): GpridDraft => ({
  id: createId('draft'),
  scenarioId: scenario.id,
  seed: scenario.seed,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedLayers: [],
  goal: { primary: '', secondary: '' },
  priority: { orderedValues: [...scenario.defaultPriorities], conflictNote: '' },
  rules: [
    { id: createId('rule'), type: 'MUST', statement: '', reasoning: '' },
    { id: createId('rule'), type: 'NEVER', statement: '', reasoning: '' },
    { id: createId('rule'), type: 'ALWAYS', statement: '', reasoning: '' },
  ],
  logic: Array.from({ length: scenario.difficultyProfile.logicCount }).map(() => ({
    id: createId('logic'),
    if: '',
    then: '',
    because: '',
    else: '',
    agentCoordination: '',
  })),
  decision: { statement: '', reasoning: '', confidence: 'medium' },
})

const withTimestamp = (draft: GpridDraft | null) =>
  draft
    ? {
        ...draft,
        updatedAt: new Date().toISOString(),
      }
    : draft

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'en',
      beginnerMode: true,
      tutorialCompleted: false,
      generatorDomain: 'Healthcare',
      generatorDifficulty: 5,
      seedInput: '',
      generatorPreview: null,
      activeScenario: null,
      activeDraft: null,
      attempts: [],
      latestAttemptId: null,
      aiJudgeStatus: 'idle',
      aiJudgeError: null,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setBeginnerMode: (beginnerMode) => set({ beginnerMode }),
      completeTutorial: () => set({ tutorialCompleted: true }),
      clearAiJudgeError: () => set({ aiJudgeError: null }),
      setGeneratorDomain: (generatorDomain) => set({ generatorDomain }),
      setGeneratorDifficulty: (generatorDifficulty) => set({ generatorDifficulty }),
      setSeedInput: (seedInput) => set({ seedInput }),

      previewScenario: () => {
        const { generatorDomain, generatorDifficulty, seedInput } = get()
        const scenario = generateScenario({
          domain: generatorDomain,
          difficulty: generatorDifficulty,
          seed: seedInput,
        })

        set({
          generatorPreview: scenario,
          generatorDomain: scenario.domain,
          generatorDifficulty: scenario.difficulty,
          seedInput: scenario.seed,
          aiJudgeStatus: 'idle',
          aiJudgeError: null,
        })
      },

      startScenario: () => {
        const state = get()
        const scenario =
          state.generatorPreview ??
          generateScenario({
            domain: state.generatorDomain,
            difficulty: state.generatorDifficulty,
            seed: state.seedInput,
          })

        set({
          generatorPreview: scenario,
          generatorDomain: scenario.domain,
          generatorDifficulty: scenario.difficulty,
          activeScenario: scenario,
          activeDraft: createDraft(scenario),
          seedInput: scenario.seed,
          aiJudgeStatus: 'idle',
          aiJudgeError: null,
        })
      },

      retrySeed: (seed, domain, difficulty) => {
        const scenario = generateScenario({ domain, difficulty, seed })

        set({
          generatorDomain: domain,
          generatorDifficulty: difficulty,
          seedInput: seed,
          generatorPreview: scenario,
          activeScenario: scenario,
          activeDraft: createDraft(scenario),
          aiJudgeStatus: 'idle',
          aiJudgeError: null,
        })
      },

      updateGoal: (field, value) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  goal: { ...state.activeDraft.goal, [field]: value },
                }
              : null,
          ),
        })),

      updatePriorityValue: (index, value) =>
        set((state) => {
          if (!state.activeDraft) return {}
          const orderedValues = [...state.activeDraft.priority.orderedValues]
          orderedValues[index] = value

          return {
            activeDraft: withTimestamp({
              ...state.activeDraft,
              priority: { ...state.activeDraft.priority, orderedValues },
            }),
          }
        }),

      movePriority: (index, direction) =>
        set((state) => {
          if (!state.activeDraft) return {}

          const target = direction === 'up' ? index - 1 : index + 1
          if (target < 0 || target >= state.activeDraft.priority.orderedValues.length) return {}

          const orderedValues = [...state.activeDraft.priority.orderedValues]
          ;[orderedValues[index], orderedValues[target]] = [
            orderedValues[target],
            orderedValues[index],
          ]

          return {
            activeDraft: withTimestamp({
              ...state.activeDraft,
              priority: { ...state.activeDraft.priority, orderedValues },
            }),
          }
        }),

      setConflictNote: (value) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  priority: { ...state.activeDraft.priority, conflictNote: value },
                }
              : null,
          ),
        })),

      addRule: () =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  rules: [
                    ...state.activeDraft.rules,
                    { id: createId('rule'), type: 'MUST', statement: '', reasoning: '' },
                  ],
                }
              : null,
          ),
        })),

      updateRule: (id, field, value) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  rules: state.activeDraft.rules.map((rule) =>
                    rule.id === id ? { ...rule, [field]: value } : rule,
                  ),
                }
              : null,
          ),
        })),

      removeRule: (id) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  rules: state.activeDraft.rules.filter((rule) => rule.id !== id),
                }
              : null,
          ),
        })),

      addLogicRule: () =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  logic: [
                    ...state.activeDraft.logic,
                    {
                      id: createId('logic'),
                      if: '',
                      then: '',
                      because: '',
                      else: '',
                      agentCoordination: '',
                    },
                  ],
                }
              : null,
          ),
        })),

      updateLogic: (id, field, value) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  logic: state.activeDraft.logic.map((item) =>
                    item.id === id ? { ...item, [field]: value } : item,
                  ),
                }
              : null,
          ),
        })),

      removeLogic: (id) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  logic: state.activeDraft.logic.filter((item) => item.id !== id),
                }
              : null,
          ),
        })),

      updateDecision: (field, value) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  decision: {
                    ...state.activeDraft.decision,
                    [field]:
                      field === 'confidence' ? (value as ConfidenceLevel) : value,
                  },
                }
              : null,
          ),
        })),

      markLayerComplete: (layer) =>
        set((state) => ({
          activeDraft: withTimestamp(
            state.activeDraft
              ? {
                  ...state.activeDraft,
                  completedLayers: state.activeDraft.completedLayers.includes(layer)
                    ? state.activeDraft.completedLayers
                    : [...state.activeDraft.completedLayers, layer],
                }
              : null,
          ),
        })),

      submitDraft: () => {
        const { activeScenario, activeDraft, attempts, language } = get()
        if (!activeScenario || !activeDraft) return null

        const submission = withTimestamp(activeDraft)
        if (!submission) return null

        const evaluation = evaluateSubmission(activeScenario, submission, language)
        const attempt: AttemptRecord = {
          id: createId('attempt'),
          scenario: activeScenario,
          submission,
          evaluation,
          aiJudgeHistory: [],
          createdAt: new Date().toISOString(),
        }

        set({
          attempts: [attempt, ...attempts],
          latestAttemptId: attempt.id,
          aiJudgeStatus: 'idle',
          aiJudgeError: null,
        })

        return attempt
      },

      evaluateAttemptWithDeepSeek: async (attemptId) => {
        const { attempts, language } = get()
        const attempt = attempts.find((item) => item.id === attemptId)
        if (!attempt) {
          set({
            aiJudgeStatus: 'error',
            aiJudgeError: 'Attempt not found for DeepSeek evaluation.',
          })
          return null
        }

        set({
          aiJudgeStatus: 'loading',
          aiJudgeError: null,
        })

        try {
          const aiEvaluation = await runDeepSeekJudge(attempt, language)
          let updatedAttempt: AttemptRecord | null = null

          set((state) => ({
            aiJudgeStatus: 'success',
            aiJudgeError: null,
            attempts: state.attempts.map((item) => {
              if (item.id !== attemptId) return item
              updatedAttempt = {
                ...item,
                aiJudgeHistory: [aiEvaluation, ...item.aiJudgeHistory],
              }
              return updatedAttempt
            }),
          }))

          return updatedAttempt
        } catch (error) {
          set({
            aiJudgeStatus: 'error',
            aiJudgeError:
              error instanceof Error
                ? error.message
                : 'DeepSeek evaluation failed unexpectedly.',
          })
          return null
        }
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => window.localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState>
        return {
          ...state,
          attempts: (state.attempts ?? []).map((attempt) => ({
            ...attempt,
            aiJudgeHistory: (attempt.aiJudgeHistory ?? []).map((entry) => ({
              ...entry,
              debug: entry.debug ?? {
                rawApiResponse: 'Unavailable for older saved history entries.',
                rawContent: 'Unavailable for older saved history entries.',
                parsedResponse: {
                  goalScore: entry.scores.goal,
                  priorityScore: entry.scores.priority,
                  rulesScore: entry.scores.rules,
                  logicScore: entry.scores.logic,
                  decisionScore: entry.scores.decision,
                  overallScore: entry.scores.overall,
                  strengths: entry.strengths ?? [],
                  weaknesses: entry.weaknesses ?? [],
                  blindSpots: entry.blindSpots ?? [],
                  improvements: entry.improvements ?? [],
                  howATopTeamWouldImproveThis: entry.topTeamImprovements ?? [],
                },
                finalUiValues: entry.scores,
                consistency: {
                  modelProvidedOverall: entry.scores.overall,
                  derivedOverall: entry.scores.overall,
                  usedOverall: entry.scores.overall,
                  fallbackApplied: false,
                  reason: 'Debug data was not stored for this older DeepSeek evaluation.',
                },
              },
            })),
          })),
        } as AppState
      },
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        beginnerMode: state.beginnerMode,
        tutorialCompleted: state.tutorialCompleted,
        generatorDomain: state.generatorDomain,
        generatorDifficulty: state.generatorDifficulty,
        seedInput: state.seedInput,
        generatorPreview: state.generatorPreview,
        activeScenario: state.activeScenario,
        activeDraft: state.activeDraft,
        attempts: state.attempts,
        latestAttemptId: state.latestAttemptId,
      }),
    },
  ),
)
