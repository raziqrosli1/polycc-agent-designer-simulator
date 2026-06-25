import Button from './ui/Button'

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-raised)] px-4 py-8 text-center sm:px-6 sm:py-10">
      <h3 className="text-lg font-medium sm:text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
        {description}
      </p>
      {actionLabel && onAction ? (
        <div className="mt-5">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default EmptyState
