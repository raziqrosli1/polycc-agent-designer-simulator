function BeginnerExampleCard({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div className="mt-4 rounded-2xl border border-[color:rgba(91,123,245,0.2)] bg-[color:rgba(91,123,245,0.08)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{title}</p>
      <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
        {items.map((item) => (
          <p key={item}>• {item}</p>
        ))}
      </div>
    </div>
  )
}

export default BeginnerExampleCard
