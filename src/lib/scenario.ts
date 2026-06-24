import { mockScenarioTemplates } from '../data/mockScenarios'
import { DIFFICULTY_LABELS, DOMAIN_OPTIONS, GENERATOR_VERSION } from './constants'
import type { DifficultyProfile, DomainKey, ScenarioSnapshot } from '../types'

const sanitize = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const hashString = (value: string) => {
  let hash = 1779033703

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    return (hash ^= hash >>> 16) >>> 0
  }
}

const mulberry32 = (seed: number) => () => {
  let current = (seed += 0x6d2b79f5)
  current = Math.imul(current ^ (current >>> 15), current | 1)
  current ^= current + Math.imul(current ^ (current >>> 7), current | 61)
  return ((current ^ (current >>> 14)) >>> 0) / 4294967296
}

const sampleUnique = <T,>(items: T[], count: number, random: () => number): T[] => {
  const pool = [...items]
  const output: T[] = []

  while (pool.length > 0 && output.length < count) {
    const index = Math.floor(random() * pool.length)
    output.push(pool.splice(index, 1)[0])
  }

  return output
}

export const getDifficultyProfile = (difficulty: number): DifficultyProfile => {
  const bounded = Math.max(1, Math.min(10, difficulty))
  const logicCount = bounded <= 2 ? 3 : bounded <= 5 ? 4 : bounded <= 8 ? 5 : 6

  return {
    label: DIFFICULTY_LABELS[bounded],
    timePressure: bounded >= 5,
    informationCompleteness: bounded <= 2 ? 'full' : bounded <= 5 ? 'partial' : 'minimal',
    competingObjectives: bounded <= 1 ? 'none' : bounded <= 3 ? 'soft_conflict' : 'hard_conflict',
    agentCount: bounded >= 8 ? 'multi' : 'single',
    environmentalStability: bounded <= 6 ? 'static' : bounded <= 8 ? 'dynamic' : 'chaotic',
    constraintCount: bounded <= 1 ? 1 : bounded <= 2 ? 2 : bounded <= 5 ? 3 : bounded <= 8 ? 4 : 5,
    riskCount: bounded <= 2 ? 2 : bounded <= 5 ? 3 : bounded <= 8 ? 4 : 5,
    logicCount,
  }
}

const getDomainPrefix = (domain: DomainKey) =>
  DOMAIN_OPTIONS.find((option) => option.key === domain)?.prefix ?? 'SCENARIO'

const getDomainByPrefix = (prefix: string): DomainKey | null =>
  DOMAIN_OPTIONS.find((option) => option.prefix === prefix)?.key ?? null

export interface ParsedSeed {
  raw: string
  normalized: string
  domain: DomainKey | null
  difficulty: number | null
  family: string | null
  index: string | null
}

export const parseSeed = (seed: string): ParsedSeed => {
  const normalized = sanitize(seed || 'CUSTOM-L1-SCENARIO-001')
  const match = normalized.match(/^([A-Z0-9]+)-L(\d+)-([A-Z0-9-]+)-(\d{3,})$/)

  if (!match) {
    return {
      raw: seed,
      normalized,
      domain: null,
      difficulty: null,
      family: null,
      index: null,
    }
  }

  const [, prefix, level, family, index] = match
  const difficulty = Number(level)

  return {
    raw: seed,
    normalized,
    domain: getDomainByPrefix(prefix),
    difficulty: Number.isFinite(difficulty) ? Math.max(1, Math.min(10, difficulty)) : null,
    family,
    index,
  }
}

export const createSeed = (domain: DomainKey, difficulty: number, family: string) => {
  const prefix = getDomainPrefix(domain)
  const slug = sanitize(family)
  const basis = `${prefix}-${difficulty}-${slug}-${Date.now()}-${Math.random()}`
  const hashed = hashString(basis)()
  const index = String((hashed % 900) + 100).padStart(3, '0')

  return `${prefix}-L${difficulty}-${slug}-${index}`
}

export const normalizeSeed = (seed: string) => sanitize(seed || 'CUSTOM-L1-SCENARIO-001')

export const generateScenario = ({
  domain,
  difficulty,
  seed,
}: {
  domain: DomainKey
  difficulty: number
  seed?: string
}): ScenarioSnapshot => {
  const parsedSeed = seed ? parseSeed(seed) : null
  const resolvedDomain = parsedSeed?.domain ?? domain
  const resolvedDifficulty = parsedSeed?.difficulty ?? difficulty
  const template =
    mockScenarioTemplates.find((item) => item.domain === resolvedDomain) ?? mockScenarioTemplates[0]

  const resolvedSeed =
    seed && seed.trim().length > 0
      ? normalizeSeed(seed)
      : createSeed(resolvedDomain, resolvedDifficulty, template.family)

  const numericSeed = hashString(resolvedSeed)()
  const random = mulberry32(numericSeed)
  const profile = getDifficultyProfile(resolvedDifficulty)

  const constraints = sampleUnique(
    template.constraintPool,
    profile.constraintCount,
    random,
  )
  const risks = sampleUnique(template.riskPool, profile.riskCount, random)
  const sampleSituation =
    template.sampleSituations[Math.floor(random() * template.sampleSituations.length)]

  const contextAdditions = [
    profile.timePressure ? 'Time pressure is active.' : 'There is no active timer pressure.',
    `Information completeness is ${profile.informationCompleteness}.`,
    profile.agentCount === 'multi'
      ? 'The scenario expects coordination between multiple agents.'
      : 'The scenario uses a single-agent design.',
  ]

  return {
    id: `scenario-${resolvedSeed.toLowerCase()}`,
    seed: resolvedSeed,
    generatorVersion: GENERATOR_VERSION,
    domain: resolvedDomain,
    difficulty: resolvedDifficulty,
    difficultyLabel: profile.label,
    difficultyProfile: profile,
    family: template.family,
    title: template.title,
    context: `${template.context} ${contextAdditions.join(' ')}`,
    agentRole: template.role,
    objective: template.objective,
    constraints,
    risks,
    stakeholders: template.stakeholders,
    defaultPriorities: template.defaultPriorities,
    sampleSituation,
  }
}
