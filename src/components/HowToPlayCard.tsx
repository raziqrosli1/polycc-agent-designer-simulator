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
    <div className="min-w-0 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-5">
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
      <div className="mt-4 space-y-3">
        {steps.map((step) => (
          <div
            key={step}
            className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-sm text-[var(--text-secondary)]"
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowToPlayCard
