import type { JourneyOverview } from '../lib/competitionJourney'

function CompetitionJourneyCard({
  title,
  description,
  overview,
  labels,
}: {
  title: string
  description: string
  overview: JourneyOverview
  labels: {
    confirmed: string
    assumptions: string
    unknowns: string
    focus: string
    noConfirmed: string
    noAssumptions: string
    noUnknowns: string
  }
}) {
  return (
    <div className="min-w-0 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-6">
      <h3 className="text-lg font-medium sm:text-xl">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>

      <div className="mt-4 rounded-2xl border border-[color:rgba(91,123,245,0.2)] bg-[color:rgba(91,123,245,0.08)] p-4">
        <p className="text-sm font-medium text-[var(--text)]">{overview.currentPhaseTitle}</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{overview.currentPhaseStatus}</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{overview.currentFocus}</p>
      </div>

      <div className="mt-5 space-y-4">
        {overview.stages.map((stage) => (
          <div
            key={stage.id}
            className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-4"
          >
            <h4 className="text-base font-medium">{stage.title}</h4>
            <div className="mt-3 grid gap-4 lg:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--success)]">
                  {labels.confirmed}
                </p>
                <div className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                  {stage.confirmed.length > 0 ? (
                    stage.confirmed.map((item) => <p key={item}>• {item}</p>)
                  ) : (
                    <p>{labels.noConfirmed}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--warning)]">
                  {labels.assumptions}
                </p>
                <div className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                  {stage.assumptions.length > 0 ? (
                    stage.assumptions.map((item) => <p key={item}>• {item}</p>)
                  ) : (
                    <p>{labels.noAssumptions}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--danger)]">
                  {labels.unknowns}
                </p>
                <div className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                  {stage.unknowns.length > 0 ? (
                    stage.unknowns.map((item) => <p key={item}>• {item}</p>)
                  ) : (
                    <p>{labels.noUnknowns}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                {labels.focus}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{stage.focusToday}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompetitionJourneyCard
