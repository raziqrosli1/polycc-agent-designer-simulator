import type { AcademyGuideOverview } from '../lib/academyGuide'

function AcademyGuideCard({
  overview,
}: {
  overview: AcademyGuideOverview
}) {
  return (
    <div className="min-w-0 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-5">
      <h3 className="text-xl font-medium">{overview.title}</h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{overview.description}</p>
      <div className="mt-4 space-y-4">
        {overview.sections.map((section) => (
          <div
            key={section.id}
            className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-4"
          >
            <h4 className="text-base font-medium">{section.title}</h4>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              {section.bullets.map((bullet) => (
                <p key={bullet}>• {bullet}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AcademyGuideCard
