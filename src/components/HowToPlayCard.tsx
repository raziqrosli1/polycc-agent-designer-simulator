function HowToPlayCard({
  title,
  description,
  steps,
}: {
  title: string
  description: string
  steps: string[]
}) {
  return (
    <div className="min-w-0 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-6">
      <h3 className="text-lg font-medium sm:text-xl">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
      <div className="mt-4 space-y-2 sm:space-y-3">
        {steps.map((step) => (
          <div
            key={step}
            className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--text-secondary)]"
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowToPlayCard
