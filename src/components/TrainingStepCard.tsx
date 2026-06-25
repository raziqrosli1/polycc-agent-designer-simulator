import type { PropsWithChildren, ReactNode } from 'react'

interface TrainingStepCardProps extends PropsWithChildren {
  step: string
  title: string
  question: string
  example: string
  hint: string
  commonMistake: string
  labels?: {
    example: string
    hint: string
    commonMistake: string
  }
  status?: ReactNode
  actions?: ReactNode
}

function TrainingStepCard({
  step,
  title,
  question,
  example,
  hint,
  commonMistake,
  labels,
  status,
  actions,
  children,
}: TrainingStepCardProps) {
  const text = labels ?? {
    example: 'Example',
    hint: 'Hint',
    commonMistake: 'Common mistake',
  }

  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] px-4 py-5 shadow-[var(--shadow-card)] sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{step}</p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight">{title}</h3>
          <p className="mt-3 text-base text-[var(--text)]">{question}</p>
        </div>
        {status ? <div className="lg:min-w-52">{status}</div> : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-[20px] bg-[var(--surface-raised)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {text.example}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{example}</p>
        </div>
        <div className="rounded-[20px] bg-[var(--surface-raised)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {text.hint}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{hint}</p>
        </div>
        <div className="rounded-[20px] bg-[var(--surface-raised)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {text.commonMistake}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{commonMistake}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">{children}</div>

      {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  )
}

export default TrainingStepCard
