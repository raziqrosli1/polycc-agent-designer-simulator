function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="min-w-0 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-xl font-medium sm:text-2xl">{value}</p>
      {hint ? (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{hint}</p>
      ) : null}
    </div>
  )
}

export default StatCard
