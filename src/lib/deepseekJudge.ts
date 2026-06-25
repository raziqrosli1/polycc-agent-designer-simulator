import { getDeepSeekEnvConfig } from './env'
import { postJson } from './http'
import type {
  AttemptRecord,
  DeepSeekJudgeDebug,
  DeepSeekJudgeEvaluation,
  DeepSeekJudgeScores,
  Language,
} from '../types'

interface DeepSeekChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
}

interface DeepSeekJudgeResponseBody {
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

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`
const DEEPSEEK_TIMEOUT_MS = 30000

const clampScore = (value: number) =>
  Math.max(1, Math.min(10, Math.round(Number(value) || 0)))

const ensureItems = (items: string[], fallback: string) => {
  const cleaned = items.map((item) => String(item).trim()).filter(Boolean)
  return cleaned.length > 0 ? cleaned : [fallback]
}

const deriveOverallFromLayers = (scores: Omit<DeepSeekJudgeScores, 'overall'>) =>
  Math.max(
    1,
    Math.min(
      100,
      Math.round(
        ((scores.goal + scores.priority + scores.rules + scores.logic + scores.decision) / 50) *
          100,
      ),
    ),
  )

const buildJudgePrompt = (attempt: AttemptRecord, language: Language) => {
  const { scenario, submission } = attempt

  return {
    system: `You are the POLYCC Agentic AI League Competition Judge.

You are evaluating a student team's GPRID submission for an agent-design competition.
Score critically but fairly.
You must return valid JSON only.
Do not include markdown.
Do not include commentary outside JSON.

Use this exact JSON shape:
{
  "goalScore": number,
  "priorityScore": number,
  "rulesScore": number,
  "logicScore": number,
  "decisionScore": number,
  "overallScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "blindSpots": string[],
  "improvements": string[],
  "howATopTeamWouldImproveThis": string[]
}

Scoring rules:
- goalScore, priorityScore, rulesScore, logicScore, decisionScore are integers from 1 to 10.
- overallScore is an integer from 1 to 100.
- strengths, weaknesses, blindSpots, improvements, howATopTeamWouldImproveThis must each contain 1 to 3 concise, actionable items.
- Focus on GPRID quality, internal consistency, risk coverage, competition readiness, and decision traceability.
- Respond in ${language === 'ms' ? 'Bahasa Melayu' : 'English'}.`,
    user: JSON.stringify(
      {
        scenario: {
          domain: scenario.domain,
          difficulty: scenario.difficulty,
          difficultyLabel: scenario.difficultyLabel,
          seed: scenario.seed,
          title: scenario.title,
          context: scenario.context,
          objective: scenario.objective,
          constraints: scenario.constraints,
          risks: scenario.risks,
          stakeholders: scenario.stakeholders,
          sampleSituation: scenario.sampleSituation,
        },
        submission: {
          goal: submission.goal,
          priority: submission.priority,
          rules: submission.rules,
          ifThenLogic: submission.logic,
          decision: submission.decision,
        },
      },
      null,
      2,
    ),
  }
}

const parseJudgeContent = (content: string): DeepSeekJudgeResponseBody => {
  const parsed = JSON.parse(content) as Partial<DeepSeekJudgeResponseBody>

  if (
    typeof parsed.goalScore !== 'number' ||
    typeof parsed.priorityScore !== 'number' ||
    typeof parsed.rulesScore !== 'number' ||
    typeof parsed.logicScore !== 'number' ||
    typeof parsed.decisionScore !== 'number' ||
    typeof parsed.overallScore !== 'number'
  ) {
    throw new Error('DeepSeek response did not include the required score fields.')
  }

  return {
    goalScore: parsed.goalScore,
    priorityScore: parsed.priorityScore,
    rulesScore: parsed.rulesScore,
    logicScore: parsed.logicScore,
    decisionScore: parsed.decisionScore,
    overallScore: parsed.overallScore,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.map(String) : [],
    blindSpots: Array.isArray(parsed.blindSpots) ? parsed.blindSpots.map(String) : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
    howATopTeamWouldImproveThis: Array.isArray(parsed.howATopTeamWouldImproveThis)
      ? parsed.howATopTeamWouldImproveThis.map(String)
      : [],
  }
}

const toJudgeScores = (
  body: DeepSeekJudgeResponseBody,
): { scores: DeepSeekJudgeScores; debug: DeepSeekJudgeDebug['consistency'] } => {
  const normalizedLayerScores = {
    goal: clampScore(body.goalScore),
    priority: clampScore(body.priorityScore),
    rules: clampScore(body.rulesScore),
    logic: clampScore(body.logicScore),
    decision: clampScore(body.decisionScore),
  }
  const providedOverall = Math.max(1, Math.min(100, Math.round(Number(body.overallScore) || 0)))
  const derivedOverall = deriveOverallFromLayers(normalizedLayerScores)
  const difference = Math.abs(providedOverall - derivedOverall)

  const fallbackApplied = difference > 15
  const usedOverall = fallbackApplied ? derivedOverall : providedOverall

  return {
    scores: {
      ...normalizedLayerScores,
      overall: usedOverall,
    },
    debug: {
      modelProvidedOverall: providedOverall,
      derivedOverall,
      usedOverall,
      fallbackApplied,
      reason: fallbackApplied
        ? 'Model overall score was materially inconsistent with the normalized layer scores, so the derived overall score was used.'
        : 'Model overall score was close enough to the normalized layer scores, so it was preserved.',
    },
  }
}

export const runDeepSeekJudge = async (
  attempt: AttemptRecord,
  language: Language,
): Promise<DeepSeekJudgeEvaluation> => {
  const config = getDeepSeekEnvConfig()
  const prompt = buildJudgePrompt(attempt, language)

  const response = await postJson<DeepSeekChatCompletionResponse>(
    `${config.baseUrl}/chat/completions`,
    {
      model: config.model,
      stream: false,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
    },
    {
      Authorization: `Bearer ${config.apiKey}`,
    },
    {
      timeoutMs: DEEPSEEK_TIMEOUT_MS,
    },
  )

  const content = response.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('DeepSeek returned an empty evaluation response.')
  }

  const parsed = parseJudgeContent(content)
  const normalized = toJudgeScores(parsed)
  const rawApiResponse = JSON.stringify(response, null, 2)

  return {
    id: createId('deepseek'),
    provider: 'deepseek',
    model: config.model,
    createdAt: new Date().toISOString(),
    scores: normalized.scores,
    strengths: ensureItems(
      parsed.strengths,
      language === 'ms'
        ? 'DeepSeek tak bagi senarai perkara yang anda buat dengan baik.'
        : 'DeepSeek did not return clear strengths.',
    ),
    weaknesses: ensureItems(
      parsed.weaknesses,
      language === 'ms'
        ? 'DeepSeek tak bagi senarai perkara yang perlu dibaiki.'
        : 'DeepSeek did not return clear weaknesses.',
    ),
    blindSpots: ensureItems(
      parsed.blindSpots,
      language === 'ms'
        ? 'DeepSeek tak bagi perkara yang anda terlepas pandang.'
        : 'DeepSeek did not return clear blind spots.',
    ),
    improvements: ensureItems(
      parsed.improvements,
      language === 'ms'
        ? 'DeepSeek tak bagi cadangan yang jelas untuk langkah seterusnya.'
        : 'DeepSeek did not return improvement suggestions.',
    ),
    topTeamImprovements: ensureItems(
      parsed.howATopTeamWouldImproveThis,
      language === 'ms'
        ? 'DeepSeek tak bagi contoh bagaimana pasukan terbaik akan kemaskan jawapan.'
        : 'DeepSeek did not return top-team recommendations.',
    ),
    debug: {
      rawApiResponse,
      rawContent: content,
      parsedResponse: parsed,
      finalUiValues: normalized.scores,
      consistency: normalized.debug,
    },
  }
}
