interface StepFlowItem {
  label: string
  detail?: string
  active?: boolean
  complete?: boolean
}

interface StepFlowProps {
  title: string
  items: StepFlowItem[]
}

function StepFlow({ title, items }: StepFlowProps) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow-card)] sm:px-5">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{title}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={`rounded-[20px] px-4 py-3 ${
              item.active
                ? 'bg-[color:rgba(91,123,245,0.12)]'
                : item.complete
                  ? 'bg-[color:rgba(52,211,153,0.10)]'
                  : 'bg-[var(--surface-raised)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                  item.active
                    ? 'bg-[var(--accent)] text-white'
                    : item.complete
                      ? 'bg-[color:rgba(52,211,153,0.16)] text-[var(--success)]'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)]'
                }`}
              >
                {item.complete ? '✓' : index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text)]">{item.label}</p>
                {item.detail ? (
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.detail}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepFlow
