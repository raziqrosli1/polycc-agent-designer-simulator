import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import StatCard from '../components/StatCard'
import Button from '../components/ui/Button'
import Pill from '../components/ui/Pill'
import { t } from '../lib/copy'
import { DIFFICULTY_LABELS, DOMAIN_OPTIONS } from '../lib/constants'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

function HistoryPage() {
  const navigate = useNavigate()
  const language = useAppStore((state) => state.language)
  const attempts = useAppStore((state) => state.attempts)
  const retrySeed = useAppStore((state) => state.retrySeed)
  const [seedQuery, setSeedQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')

  const filteredAttempts = useMemo(
    () =>
      attempts.filter((attempt) => {
        const matchesSeed = !seedQuery
          ? true
          : attempt.scenario.seed.toLowerCase().includes(seedQuery.toLowerCase())
        const matchesDomain =
          domainFilter === 'all' ? true : attempt.scenario.domain === domainFilter
        const matchesDifficulty =
          difficultyFilter === 'all'
            ? true
            : attempt.scenario.difficulty === Number(difficultyFilter)

        return matchesSeed && matchesDomain && matchesDifficulty
      }),
    [attempts, difficultyFilter, domainFilter, seedQuery],
  )

  const averageScore = filteredAttempts.length
    ? Math.round(
        filteredAttempts.reduce(
          (total, attempt) => total + attempt.evaluation.scores.total,
          0,
        ) / filteredAttempts.length,
      )
    : 0
  const bestScore = filteredAttempts.length
    ? Math.max(...filteredAttempts.map((attempt) => attempt.evaluation.scores.total))
    : 0

  return (
    <div className="space-y-6">
      <SectionCard>
        <PageHeader
          eyebrow={t(language, 'history')}
          title={t(language, 'historyTitle')}
          description={t(language, 'historyDescription')}
        />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatCard label={t(language, 'attempts')} value={String(filteredAttempts.length)} />
          <StatCard label={t(language, 'average')} value={String(averageScore)} />
          <StatCard label={t(language, 'best')} value={String(bestScore)} />
        </div>
      </SectionCard>

      <SectionCard>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-[var(--text-secondary)]">
            {t(language, 'seedSearch')}
            <input
              value={seedQuery}
              onChange={(event) => setSeedQuery(event.target.value)}
              placeholder="HEALTH-L5-TRIAGE-001"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)]"
            />
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            {t(language, 'domain')}
            <select
              value={domainFilter}
              onChange={(event) => setDomainFilter(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)]"
            >
              <option value="all">{t(language, 'allDomains')}</option>
              {DOMAIN_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.key}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            {t(language, 'difficulty')}
            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)]"
            >
              <option value="all">{t(language, 'allLevels')}</option>
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  Level {value} — {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 space-y-4">
          {filteredAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-raised)] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Pill>{attempt.scenario.domain}</Pill>
                    <Pill tone="accent">
                      Level {attempt.scenario.difficulty} —{' '}
                      {attempt.scenario.difficultyLabel}
                    </Pill>
                    <Pill>{attempt.scenario.seed}</Pill>
                  </div>
                  <h3 className="mt-2 text-xl font-medium">
                    {attempt.scenario.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {attempt.scenario.sampleSituation}
                  </p>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    {attempt.evaluation.expertRecommendation}
                  </p>
                </div>

                <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-4 text-center lg:min-w-40">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Score
                  </p>
                  <p className="mt-2 text-4xl font-medium">
                    {attempt.evaluation.scores.total}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to={`${ROUTES.evaluation}/${attempt.id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
                    >
                      {t(language, 'viewEvaluation')}
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        retrySeed(
                          attempt.scenario.seed,
                          attempt.scenario.domain,
                          attempt.scenario.difficulty,
                        )
                        navigate(ROUTES.workspace)
                      }}
                    >
                      {t(language, 'retryFromSeed')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredAttempts.length === 0 ? (
            <EmptyState
              title={t(language, 'noMatchingAttempts')}
              description={t(language, 'noMatchingAttemptsDescription')}
            />
          ) : null}
        </div>
      </SectionCard>
    </div>
  )
}

export default HistoryPage
