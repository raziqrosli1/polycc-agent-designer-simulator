import type { PropsWithChildren } from 'react'

function SectionCard({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={`min-w-0 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-6 ${className}`.trim()}
    >
      {children}
    </section>
  )
}

export default SectionCard
