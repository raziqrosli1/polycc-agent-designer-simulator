import type { DomainKey } from '../types'

export const STORAGE_KEY = 'ads:v1'
export const STORAGE_VERSION = 1
export const GENERATOR_VERSION = 'gen-1'
export const RUBRIC_VERSION = 'rubric-1'

export const DOMAIN_OPTIONS: { key: DomainKey; prefix: string }[] = [
  { key: 'Education', prefix: 'EDU' },
  { key: 'Career Development', prefix: 'CAREER' },
  { key: 'Internship Placement', prefix: 'INTERNSHIP' },
  { key: 'Student Success', prefix: 'STUDENT' },
  { key: 'Healthcare', prefix: 'HEALTH' },
  { key: 'Emergency Response', prefix: 'EMERGENCY' },
  { key: 'Customer Service', prefix: 'SERVICE' },
  { key: 'Finance', prefix: 'FINANCE' },
  { key: 'Smart City', prefix: 'SMARTCITY' },
  { key: 'Project Management', prefix: 'PROJECT' },
]

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Explorer',
  3: 'Analyst',
  4: 'Designer',
  5: 'Strategist',
  6: 'Advanced',
  7: 'Expert',
  8: 'Multi-Agent',
  9: 'Architect',
  10: 'Championship',
}

export const DIFFICULTY_SUMMARIES: Record<number, string> = {
  1: 'Single objective, full information, and foundational GPRID practice.',
  2: 'Adds a secondary objective and more explicit prioritization choices.',
  3: 'Introduces partial information and stronger pressure from constraints.',
  4: 'Adds value conflict and requires conflict-resolution thinking.',
  5: 'Introduces time pressure and more complete branching logic.',
  6: 'Raises ambiguity and sharpens rule consistency expectations.',
  7: 'Makes the environment more dynamic and increases logic coverage demands.',
  8: 'Requires multi-agent thinking and coordination-aware logic.',
  9: 'Adds stakeholder trade-offs and long-horizon decision pressure.',
  10: 'Combines major difficulty modifiers into a championship-level scenario.',
}

export const LAYERS = [
  { key: 'goal', label: 'Goal' },
  { key: 'priority', label: 'Priority' },
  { key: 'rules', label: 'Rules' },
  { key: 'logic', label: 'Logic' },
  { key: 'decision', label: 'Decision' },
] as const
