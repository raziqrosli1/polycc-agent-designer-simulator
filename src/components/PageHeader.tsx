function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-medium sm:text-2xl">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default PageHeader
