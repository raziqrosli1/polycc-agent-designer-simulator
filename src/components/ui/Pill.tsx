import type { PropsWithChildren } from 'react'

function Pill({
  children,
  tone = 'default',
}: PropsWithChildren<{ tone?: 'default' | 'accent' | 'success' | 'warning' }>) {
  const toneClass =
    tone === 'accent'
      ? 'border-[color:rgba(91,123,245,0.3)] text-[var(--accent)]'
      : tone === 'success'
        ? 'border-[color:rgba(52,211,153,0.25)] text-[var(--success)]'
        : tone === 'warning'
          ? 'border-[color:rgba(245,158,11,0.25)] text-[var(--warning)]'
          : 'border-[var(--border)] text-[var(--text-secondary)]'

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${toneClass}`}
    >
      {children}
    </span>
  )
}

export default Pill
