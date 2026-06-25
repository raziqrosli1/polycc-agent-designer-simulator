import { useEffect, useRef } from 'react'
import Button from './ui/Button'

function TutorialModal({
  open,
  title,
  description,
  steps,
  closeLabel,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  steps: Array<{ title: string; body: string }>
  closeLabel: string
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return

    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[color:rgba(10,10,15,0.7)] p-4 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center py-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="w-full rounded-[28px] border border-[var(--border-strong)] bg-[var(--surface)] p-5 shadow-[var(--shadow-strong)] sm:p-6"
        >
          <h2 className="text-2xl font-medium">{title}</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
              >
                <h3 className="text-base font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button ref={closeButtonRef} variant="primary" onClick={onClose}>
              {closeLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialModal
