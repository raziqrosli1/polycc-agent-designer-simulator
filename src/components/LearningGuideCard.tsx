import Pill from './ui/Pill'

interface GuideGlossaryItem {
  term: string
  explanation: string
}

interface LearningGuideCardProps {
  eyebrow: string
  title: string
  description: string
  whatIsThis: string
  whyItMatters: string
  whatToDo: string
  estimatedTime: string
  difficulty: string
  progress: string
  tip: string
  nextStep: string
  detailsLabel: string
  malayLabels?: boolean
  glossaryItems?: GuideGlossaryItem[]
}

function LearningGuideCard({
  eyebrow,
  title,
  description,
  whatIsThis,
  whyItMatters,
  whatToDo,
  estimatedTime,
  difficulty,
  progress,
  tip,
  nextStep,
  detailsLabel,
  malayLabels = false,
  glossaryItems = [],
}: LearningGuideCardProps) {
  const labels = malayLabels
    ? {
        learning: 'Apa yang anda akan belajar',
        topic: 'Fokus halaman',
        whatIsThis: 'Apa halaman ini?',
        whyItMatters: 'Kenapa anda di sini?',
        whatToDo: 'Apa perlu buat sekarang?',
        tip: 'Kenapa ini penting?',
        nextStep: 'Apa langkah selepas ini?',
      }
    : {
        learning: 'What you are about to learn',
        topic: 'Page focus',
        whatIsThis: 'What is this page?',
        whyItMatters: 'Why are you here?',
        whatToDo: 'What should you do now?',
        tip: 'Why is this important?',
        nextStep: 'What happens after this?',
      }

  return (
    <div className="rounded-[var(--radius-card)] border border-[color:rgba(91,123,245,0.16)] bg-[linear-gradient(180deg,rgba(91,123,245,0.08),rgba(91,123,245,0.02))] p-5 shadow-[var(--shadow-card)] sm:p-7">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">{labels.learning}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone="accent">{labels.topic}</Pill>
        <Pill>{eyebrow}</Pill>
        <Pill>{estimatedTime}</Pill>
        <Pill>{difficulty}</Pill>
        <Pill tone="success">{progress}</Pill>
      </div>
      <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">{title}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
        {description}
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="border-b border-[var(--border)] pb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {labels.whatIsThis}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text)] sm:text-base">{whatIsThis}</p>
          </div>
          <div className="border-b border-[var(--border)] pb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {labels.whyItMatters}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text)] sm:text-base">
              {whyItMatters}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {labels.whatToDo}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text)] sm:text-base">{whatToDo}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {labels.tip}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{tip}</p>
          </div>
          <div className="rounded-[20px] border border-[color:rgba(91,123,245,0.18)] bg-[color:rgba(91,123,245,0.08)] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              {labels.nextStep}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text)]">{nextStep}</p>
          </div>
        </div>
      </div>

      {glossaryItems.length > 0 ? (
        <details className="mt-5 rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-[var(--text)]">
            {detailsLabel}
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {glossaryItems.map((item) => (
              <div key={item.term} className="rounded-[16px] bg-[var(--surface)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--text)]">{item.term}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  )
}

export default LearningGuideCard
