import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import Pill from '../components/ui/Pill'
import Button from '../components/ui/Button'
import { t } from '../lib/copy'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

const gradeLabel = (score: number) => {
  if (score >= 85) return 'Strong'
  if (score >= 70) return 'Promising'
  if (score >= 55) return 'Developing'
  return 'Needs revision'
}

function EvaluationPage() {
  const { attemptId } = useParams()
  const language = useAppStore((state) => state.language)
  const attempts = useAppStore((state) => state.attempts)
  const retrySeed = useAppStore((state) => state.retrySeed)
  const aiJudgeStatus = useAppStore((state) => state.aiJudgeStatus)
  const aiJudgeError = useAppStore((state) => state.aiJudgeError)
  const evaluateAttemptWithDeepSeek = useAppStore(
    (state) => state.evaluateAttemptWithDeepSeek,
  )
  const clearAiJudgeError = useAppStore((state) => state.clearAiJudgeError)
  const [showDeepSeekDebug, setShowDeepSeekDebug] = useState(false)

  const attempt = attempts.find((item) => item.id === attemptId) ?? attempts[0]

  if (!attempt) {
    return <Navigate to={ROUTES.history} replace />
  }

  const layerScores = [
    ['Goal', attempt.evaluation.scores.goal],
    ['Priority', attempt.evaluation.scores.priority],
    ['Rules', attempt.evaluation.scores.rules],
    ['Logic', attempt.evaluation.scores.logic],
    ['Decision', attempt.evaluation.scores.decision],
  ]
  const previousAttempt = attempts.find(
    (item) =>
      item.id !== attempt.id &&
      item.scenario.seed === attempt.scenario.seed &&
      item.scenario.generatorVersion === attempt.scenario.generatorVersion,
  )
  const delta = previousAttempt
    ? attempt.evaluation.scores.total - previousAttempt.evaluation.scores.total
    : null
  const latestAiJudge = attempt.aiJudgeHistory[0] ?? null
  const renderBulletList = (items: string[], fallback: string) =>
    items.length > 0 ? (
      <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-4 text-sm text-[var(--text-secondary)]">{fallback}</p>
    )

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <PageHeader
              eyebrow={t(language, 'evaluation')}
              title={attempt.scenario.title}
              description={`Seed ${attempt.scenario.seed}`}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>{attempt.scenario.domain}</Pill>
              <Pill tone="accent">
                Level {attempt.scenario.difficulty} — {attempt.scenario.difficultyLabel}
              </Pill>
              <Pill tone="warning">
                {t(language, 'weakestLayerLabel', attempt.evaluation.diagnostics.weakestLayer)}
              </Pill>
            </div>
          </div>
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-raised)] px-6 py-5 text-center sm:px-8 sm:py-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {t(language, 'overallScore')}
            </p>
            <p className="mt-2 text-5xl font-medium">
              {attempt.evaluation.scores.total}
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {gradeLabel(attempt.evaluation.scores.total)}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {t(language, 'layerBreakdown')}
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          {layerScores.map(([label, score]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center"
            >
              <p className="text-sm text-[var(--text-secondary)]">{label}</p>
              <p className="mt-2 text-3xl font-medium">{score}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                / 10
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {previousAttempt ? (
        <SectionCard>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {t(language, 'comparison')}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Pill>{t(language, 'previous', previousAttempt.evaluation.scores.total)}</Pill>
            <Pill tone={delta && delta >= 0 ? 'success' : 'warning'}>
              {t(language, 'pointsDelta', delta && delta > 0 ? `+${delta}` : delta ?? 0)}
            </Pill>
            <p className="text-sm text-[var(--text-secondary)]">
              {t(language, 'comparisonHint')}
            </p>
          </div>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--success)]">
            {t(language, 'strengths')}
          </p>
          {renderBulletList(
            attempt.evaluation.strengths,
            language === 'ms'
              ? 'Belum ada kekuatan khusus direkodkan untuk percubaan ini.'
              : 'No specific strengths were recorded for this attempt yet.',
          )}
        </SectionCard>

        <SectionCard>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--warning)]">
            {t(language, 'weaknesses')}
          </p>
          {renderBulletList(
            attempt.evaluation.weaknesses,
            language === 'ms'
              ? 'Belum ada kelemahan khusus direkodkan untuk percubaan ini.'
              : 'No specific weaknesses were recorded for this attempt yet.',
          )}
        </SectionCard>

        <SectionCard>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
            {t(language, 'blindSpots')}
          </p>
          {renderBulletList(
            attempt.evaluation.blindSpots,
            language === 'ms'
              ? 'Belum ada blind spot khusus direkodkan untuk percubaan ini.'
              : 'No specific blind spots were recorded for this attempt yet.',
          )}
        </SectionCard>

        <SectionCard>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {t(language, 'expertRecommendation')}
          </p>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            {attempt.evaluation.expertRecommendation}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill tone="warning">
              {t(language, 'blockingIssues', attempt.evaluation.diagnostics.totalErrors)}
            </Pill>
            <Pill>{t(language, 'coachingNotes', attempt.evaluation.diagnostics.totalWarnings)}</Pill>
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <PageHeader
              eyebrow={t(language, 'deepseekJudge')}
              title={t(language, 'deepseekJudgeTitle')}
              description={t(language, 'deepseekJudgeDescription')}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone="accent">{t(language, 'deepseekOptional')}</Pill>
              {latestAiJudge ? (
                <>
                  <Pill>{t(language, 'deepseekModel')}: {latestAiJudge.model}</Pill>
                  <Pill tone="success">
                    {t(language, 'deepseekOverall')}: {latestAiJudge.scores.overall}
                  </Pill>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => evaluateAttemptWithDeepSeek(attempt.id)}
              disabled={aiJudgeStatus === 'loading'}
            >
              {aiJudgeStatus === 'loading'
                ? t(language, 'deepseekLoading')
                : t(language, 'runDeepSeekJudge')}
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
            {latestAiJudge ? (
              <Button
                variant="ghost"
                onClick={() => setShowDeepSeekDebug((current) => !current)}
              >
                {t(language, 'deepseekDebug')}
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
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center">
                  <p className="text-sm text-[var(--text-secondary)]">Goal</p>
                  <p className="mt-2 text-3xl font-medium">{latestAiJudge.scores.goal}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center">
                  <p className="text-sm text-[var(--text-secondary)]">Priority</p>
                  <p className="mt-2 text-3xl font-medium">{latestAiJudge.scores.priority}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center">
                  <p className="text-sm text-[var(--text-secondary)]">Rules</p>
                  <p className="mt-2 text-3xl font-medium">{latestAiJudge.scores.rules}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center">
                  <p className="text-sm text-[var(--text-secondary)]">Logic</p>
                  <p className="mt-2 text-3xl font-medium">{latestAiJudge.scores.logic}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center">
                  <p className="text-sm text-[var(--text-secondary)]">Decision</p>
                  <p className="mt-2 text-3xl font-medium">{latestAiJudge.scores.decision}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-center">
                  <p className="text-sm text-[var(--text-secondary)]">{t(language, 'deepseekOverall')}</p>
                  <p className="mt-2 text-3xl font-medium">{latestAiJudge.scores.overall}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <SectionCard>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--success)]">
                    {t(language, 'strengths')}
                  </p>
                  {renderBulletList(
                    latestAiJudge.strengths,
                    language === 'ms'
                      ? 'DeepSeek tidak memulangkan senarai kekuatan.'
                      : 'DeepSeek did not return any strengths.',
                  )}
                </SectionCard>
                <SectionCard>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--warning)]">
                    {t(language, 'weaknesses')}
                  </p>
                  {renderBulletList(
                    latestAiJudge.weaknesses,
                    language === 'ms'
                      ? 'DeepSeek tidak memulangkan senarai kelemahan.'
                      : 'DeepSeek did not return any weaknesses.',
                  )}
                </SectionCard>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-raised)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
                  {t(language, 'blindSpots')}
                </p>
                {renderBulletList(
                  latestAiJudge.blindSpots,
                  language === 'ms'
                    ? 'DeepSeek tidak memulangkan blind spot.'
                    : 'DeepSeek did not return any blind spots.',
                )}
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-raised)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {t(language, 'deepseekImprovements')}
                </p>
                {renderBulletList(
                  latestAiJudge.improvements,
                  language === 'ms'
                    ? 'DeepSeek tidak memulangkan cadangan penambahbaikan.'
                    : 'DeepSeek did not return any improvement suggestions.',
                )}
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-raised)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {t(language, 'deepseekTopTeam')}
                </p>
                {renderBulletList(
                  latestAiJudge.topTeamImprovements,
                  language === 'ms'
                    ? 'DeepSeek tidak memulangkan cadangan pasukan terbaik.'
                    : 'DeepSeek did not return any top-team recommendations.',
                )}
              </div>
            </div>
          </div>
        ) : (
          <p aria-live="polite" className="mt-4 text-sm text-[var(--text-secondary)]">
            {aiJudgeStatus === 'loading'
              ? t(language, 'deepseekLoading')
              : t(language, 'noDeepSeekHistory')}
          </p>
        )}

        {latestAiJudge && showDeepSeekDebug ? (
          <div className="mt-6 space-y-4 rounded-[24px] border border-[color:rgba(91,123,245,0.22)] bg-[color:rgba(91,123,245,0.06)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
              {t(language, 'deepseekDebug')}
            </p>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm font-medium text-[var(--text)]">
                {t(language, 'deepseekConsistency')}
              </p>
              <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <p>
                  Model provided overall: {latestAiJudge.debug.consistency.modelProvidedOverall}
                </p>
                <p>
                  Derived overall from layer scores: {latestAiJudge.debug.consistency.derivedOverall}
                </p>
                <p>Final UI overall: {latestAiJudge.debug.consistency.usedOverall}</p>
                <p>
                  Fallback applied:{' '}
                  {latestAiJudge.debug.consistency.fallbackApplied ? 'yes' : 'no'}
                </p>
                <p>{latestAiJudge.debug.consistency.reason}</p>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm font-medium text-[var(--text)]">
                  {t(language, 'deepseekRawApi')}
                </p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-[var(--text-secondary)]">
                  {latestAiJudge.debug.rawApiResponse}
                </pre>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm font-medium text-[var(--text)]">
                  {t(language, 'deepseekRawParsed')}
                </p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-[var(--text-secondary)]">
                  {JSON.stringify(latestAiJudge.debug.parsedResponse, null, 2)}
                </pre>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm font-medium text-[var(--text)]">
                  {t(language, 'deepseekFinalUi')}
                </p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-[var(--text-secondary)]">
                  {JSON.stringify(latestAiJudge.debug.finalUiValues, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {t(language, 'deepseekHistory')}
          </p>
          <div className="mt-4 space-y-3">
            {attempt.aiJudgeHistory.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>{new Date(entry.createdAt).toLocaleString()}</Pill>
                  <Pill>{t(language, 'deepseekModel')}: {entry.model}</Pill>
                  <Pill tone="success">
                    {t(language, 'deepseekOverall')}: {entry.scores.overall}
                  </Pill>
                </div>
              </div>
            ))}
            {attempt.aiJudgeHistory.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                {t(language, 'noDeepSeekHistory')}
              </p>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={() =>
            retrySeed(
              attempt.scenario.seed,
              attempt.scenario.domain,
              attempt.scenario.difficulty,
            )
          }
        >
          {t(language, 'retrySeed')}
        </Button>
        <Link
          to={ROUTES.workspace}
          className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)]"
        >
          {t(language, 'openWorkspace')}
        </Link>
        <Link
          to={ROUTES.history}
          className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)]"
        >
          {t(language, 'viewHistory')}
        </Link>
      </div>
    </div>
  )
}

export default EvaluationPage
