import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  block?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-white shadow-[var(--shadow-card)] hover:opacity-92 active:scale-[0.99]',
  secondary:
    'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] active:scale-[0.99]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] active:scale-[0.99]',
  danger:
    'border border-[color:rgba(248,113,113,0.25)] bg-[color:rgba(248,113,113,0.08)] text-[var(--danger)] hover:bg-[color:rgba(248,113,113,0.14)] active:scale-[0.99]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = '',
    variant = 'secondary',
    block = false,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-center text-sm leading-5 font-medium whitespace-normal transition disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${
        block ? 'w-full' : ''
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
