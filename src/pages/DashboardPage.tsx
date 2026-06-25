import { Link } from 'react-router-dom'
import { useState } from 'react'
import TutorialModal from '../components/TutorialModal'
import Button from '../components/ui/Button'
import { t } from '../lib/copy'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

type PhaseStatus = 'completed' | 'current' | 'upcoming'

const registrationOpenDate = new Date('2026-06-22T00:00:00')
const competitionStartDate = new Date('2026-07-13T00:00:00')

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate())

const formatOfficialDate = (value: Date, language: 'en' | 'ms') =>
  value.toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const getDaysUntil = (target: Date, today: Date) =>
  Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86_400_000))

const getCurrentPhase = (today: Date) => {
  if (today < registrationOpenDate) return 'pre-registration'
  if (today < competitionStartDate) return 'self-training'
  return 'official-competition'
}

function StatusMark({ status }: { status: PhaseStatus }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:rgba(52,211,153,0.14)] text-[var(--success)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5L9.2 16.5L19 7.5" />
        </svg>
      </span>
    )
  }

  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${
        status === 'current'
          ? 'border-[color:rgba(91,123,245,0.28)] bg-[color:rgba(91,123,245,0.16)] text-[var(--accent)] shadow-[0_0_0_6px_rgba(91,123,245,0.08)]'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]'
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-current" />
    </span>
  )
}

function DashboardPage() {
  const language = useAppStore((state) => state.language)
  const tutorialCompleted = useAppStore((state) => state.tutorialCompleted)
  const completeTutorial = useAppStore((state) => state.completeTutorial)
  const activeDraft = useAppStore((state) => state.activeDraft)
  const activeScenario = useAppStore((state) => state.activeScenario)
  const attempts = useAppStore((state) => state.attempts)
  const [tutorialOpen, setTutorialOpen] = useState(!tutorialCompleted)

  const bestScore = attempts.length
    ? Math.max(...attempts.map((attempt) => attempt.evaluation.scores.total))
    : 0

  const layerTotals = attempts.reduce(
    (accumulator, attempt) => {
      accumulator.goal += attempt.evaluation.scores.goal
      accumulator.priority += attempt.evaluation.scores.priority
      accumulator.rules += attempt.evaluation.scores.rules
      accumulator.logic += attempt.evaluation.scores.logic
      accumulator.decision += attempt.evaluation.scores.decision
      return accumulator
    },
    { goal: 0, priority: 0, rules: 0, logic: 0, decision: 0 },
  )

  const weakestLayer = attempts.length
    ? Object.entries(layerTotals).sort((left, right) => left[1] - right[1])[0][0]
    : 'goal'
  const today = startOfDay(new Date())
  const currentPhase = getCurrentPhase(today)
  const daysToCompetition = getDaysUntil(competitionStartDate, today)
  const startRoute = activeDraft && activeScenario ? ROUTES.workspace : ROUTES.generator
  const weakestStepLabel =
    language === 'ms'
      ? {
          goal: 'Matlamat',
          priority: 'Keutamaan',
          rules: 'Peraturan AI',
          logic: 'Cara AI Berfikir',
          decision: 'Jawapan Akhir',
        }[weakestLayer as 'goal' | 'priority' | 'rules' | 'logic' | 'decision']
      : {
          goal: 'Goal',
          priority: 'Most important first',
          rules: 'Rules the AI must follow',
          logic: 'How the AI thinks',
          decision: 'Final answer',
        }[weakestLayer as 'goal' | 'priority' | 'rules' | 'logic' | 'decision']

  const homeCopy =
    language === 'ms'
      ? {
          heroEyebrow: 'POLYCC Agentic AI League 2026',
          heroTitle: 'Belajar cara AI membuat keputusan sebelum pertandingan sebenar.',
          heroDescription:
            'Latih cara AI buat keputusan dengan 5 langkah GPRID.',
          heroPoints: [
            {
              title: 'Apa ini?',
              body: 'Platform latihan sebelum POLYCC Agentic AI League 2026.',
            },
            {
              title: 'Kenapa perlu guna?',
              body: 'Supaya anda boleh jawab dengan lebih teratur dan yakin.',
            },
            {
              title: 'Apa perlu buat sekarang?',
              body: activeDraft
                ? 'Anda sambung latihan yang belum siap.'
                : 'Tekan Mula Belajar, pilih latihan, kemudian ikut 5 langkah.',
            },
          ],
          startLearning: activeDraft && activeScenario ? 'Teruskan latihan' : 'Mula belajar',
          seeCompetition: 'Lihat perjalanan pertandingan',
          tutorialLink: 'Tak pasti nak mula? Buka tutorial ringkas.',
          currentStatus: 'Status sekarang',
          currentStatusValue:
            currentPhase === 'official-competition'
              ? 'Pertandingan rasmi'
              : currentPhase === 'self-training'
                ? 'Fasa latihan kendiri'
                : 'Pendaftaran dibuka tidak lama lagi',
          countdownLabel:
            daysToCompetition > 0 ? 'Baki ke pertandingan rasmi' : 'Status pertandingan',
          countdownValue: daysToCompetition > 0 ? `${daysToCompetition} hari` : 'Sedang berlangsung',
          firstSession: 'Sesi pertama',
          firstSessionValue: '10 hingga 15 minit',
          beginnerLabel: 'Sesuai untuk',
          beginnerValue: 'Pelajar yang baru bermula',
          timelineEyebrow: 'Perjalanan pertandingan',
          timelineTitle: 'Lihat kedudukan anda sekarang',
          timelineDescription:
            'Sekarang masa terbaik untuk buat latihan asas sebelum pertandingan bermula.',
          timeline: [
            {
              title: 'Pendaftaran',
              date: formatOfficialDate(registrationOpenDate, language),
              description: 'Pelajar dan pensyarah mula rancang pasukan.',
              status: today >= registrationOpenDate ? 'completed' : 'upcoming',
            },
            {
              title: 'Latihan kendiri',
              date: 'Sekarang hingga 12 Jul 2026',
              description: 'Belajar cara AI berfikir dan cuba latihan pertama anda.',
              status:
                currentPhase === 'self-training'
                  ? 'current'
                  : today >= competitionStartDate
                    ? 'completed'
                    : 'upcoming',
            },
            {
              title: 'Pertandingan rasmi',
              date: formatOfficialDate(competitionStartDate, language),
              description: 'Gunakan AWS Workshop semasa pertandingan sebenar.',
              status: currentPhase === 'official-competition' ? 'current' : 'upcoming',
            },
          ],
          learningEyebrow: 'Apa anda akan belajar',
          learningTitle: 'Tiga perkara penting sebelum anda bertanding',
          learningDescription:
            'Ini bukan ujian. Ini tempat untuk belajar dan baiki jawapan.',
          learningItems: [
            {
              title: 'Faham pertandingan',
              body: 'Siapa boleh sertai, dan apa yang berlaku pada hari pertandingan.',
            },
            {
              title: 'Belajar 5 langkah GPRID',
              body: 'Matlamat, keutamaan, peraturan AI, cara AI berfikir, jawapan akhir.',
            },
            {
              title: 'Baiki jawapan anda',
              body: 'Semak apa yang kurang, betulkan, dan cuba lagi.',
            },
          ],
          gpridTitle: 'Aliran 5 langkah GPRID',
          gpridSteps: ['Matlamat', 'Keutamaan', 'Peraturan', 'Cara AI', 'Jawapan Akhir'],
          progressEyebrow: 'Kemajuan anda',
          progressTitle: 'Lihat sejauh mana anda sudah bermula',
          progressDescription: 'Kecil pun tak apa. Yang penting anda mula dulu.',
          progressItems: [
            {
              label: 'Buka tutorial',
              done: tutorialCompleted,
            },
            {
              label: 'Siapkan 1 latihan',
              done: attempts.length >= 1,
            },
            {
              label: 'Cuba baiki semula jawapan',
              done: attempts.length >= 2,
            },
          ],
          attemptsLabel: 'Latihan siap',
          bestScoreLabel: 'Skor terbaik',
          weakestLabel: 'Paling perlu dibaiki',
          nextStepEyebrow: 'Apa perlu dibuat sekarang',
          nextStepTitle: activeDraft ? 'Sambung latihan yang belum siap' : 'Mulakan latihan pertama anda',
          nextStepDescription: activeDraft
            ? 'Anda sudah bermula. Sambung dari langkah yang belum siap supaya aliran jawapan anda lengkap.'
            : 'Tekan Mula Belajar. Anda akan pilih latihan dan ikut 5 langkah.',
          nextStepAction: activeDraft ? 'Sambung sekarang' : 'Mula sekarang',
          nextStepHint:
            attempts.length > 0
              ? `Skor terbaik anda sekarang ialah ${bestScore}. Fokus pada ${weakestStepLabel ?? 'bahagian yang lemah'} dahulu.`
              : 'Belum ada latihan lagi. Cubaan pertama anda akan jadi titik mula untuk lihat kemajuan.',
        }
      : {
          heroEyebrow: 'POLYCC Agentic AI League 2026',
          heroTitle: 'Learn how AI makes decisions before the real competition.',
          heroDescription:
            'Learn AI decision-making through a simple 5-step GPRID practice.',
          heroPoints: [
            {
              title: 'What is this?',
              body: 'The official practice platform before POLYCC Agentic AI League 2026.',
            },
            {
              title: 'Why should you use it?',
              body: 'So you can answer in a clearer, more structured way.',
            },
            {
              title: 'What should you do now?',
              body: activeDraft
                ? 'You continue the practice you have not finished yet.'
                : 'Press Start learning, choose a practice, then follow the 5 steps.',
            },
          ],
          startLearning: activeDraft && activeScenario ? 'Continue training' : 'Start learning',
          seeCompetition: 'See competition journey',
          tutorialLink: 'Not sure where to start? Open the tutorial.',
          currentStatus: 'Current status',
          currentStatusValue:
            currentPhase === 'official-competition'
              ? 'Official competition'
              : currentPhase === 'self-training'
                ? 'Self learning phase'
                : 'Registration opens soon',
          countdownLabel:
            daysToCompetition > 0 ? 'Time before the official competition' : 'Competition status',
          countdownValue: daysToCompetition > 0 ? `${daysToCompetition} days` : 'Now live',
          firstSession: 'First session',
          firstSessionValue: '10 to 15 minutes',
          beginnerLabel: 'Best for',
          beginnerValue: 'Students who are just starting',
          timelineEyebrow: 'Competition journey',
          timelineTitle: 'See where you are right now',
          timelineDescription:
            'This is the best time to practise the basics before the competition starts.',
          timeline: [
            {
              title: 'Registration',
              date: formatOfficialDate(registrationOpenDate, language),
              description: 'Students and lecturers begin planning teams.',
              status: today >= registrationOpenDate ? 'completed' : 'upcoming',
            },
            {
              title: 'Self learning',
              date: 'Now until 12 Jul 2026',
              description: 'Learn how AI thinks and complete your first practice.',
              status:
                currentPhase === 'self-training'
                  ? 'current'
                  : today >= competitionStartDate
                    ? 'completed'
                    : 'upcoming',
            },
            {
              title: 'Official competition',
              date: formatOfficialDate(competitionStartDate, language),
              description: 'Use AWS Workshop during the real competition.',
              status: currentPhase === 'official-competition' ? 'current' : 'upcoming',
            },
          ],
          learningEyebrow: 'What you will learn',
          learningTitle: 'Three important things before you compete',
          learningDescription:
            'This is practice, not a test. You learn and improve over time.',
          learningItems: [
            {
              title: 'Understand the competition',
              body: 'Who can join, and what happens during the official event.',
            },
            {
              title: 'Learn the 5 GPRID steps',
              body: 'Goal, Priority, Rules, Logic, and the Final Answer.',
            },
            {
              title: 'Improve your answer',
              body: 'Review feedback, fix what is missing, and try again.',
            },
          ],
          gpridTitle: 'The 5-step GPRID flow',
          gpridSteps: ['Goal', 'Priority', 'Rules', 'Logic', 'Decision'],
          progressEyebrow: 'Your progress',
          progressTitle: 'See how far you have already started',
          progressDescription: 'Focus on one small step first. That is enough for today.',
          progressItems: [
            {
              label: 'Open the tutorial',
              done: tutorialCompleted,
            },
            {
              label: 'Finish 1 practice',
              done: attempts.length >= 1,
            },
            {
              label: 'Try improving an answer',
              done: attempts.length >= 2,
            },
          ],
          attemptsLabel: 'Practices done',
          bestScoreLabel: 'Best score',
          weakestLabel: 'Needs work most',
          nextStepEyebrow: 'What should you do now',
          nextStepTitle: activeDraft ? 'Continue the practice you already started' : 'Start your first practice',
          nextStepDescription: activeDraft
            ? 'You have already started. Continue from the unfinished step so your answer becomes complete.'
            : 'Press start learning. You will choose one practice and then follow the 5 GPRID steps.',
          nextStepAction: activeDraft ? 'Continue now' : 'Start now',
          nextStepHint:
            attempts.length > 0
              ? `Your current best score is ${bestScore}. Focus on ${weakestStepLabel ?? 'your weakest step'} first.`
              : 'You do not have any practice yet. Your first attempt will become your starting point.',
        }

  const completedProgressItems = homeCopy.progressItems.filter((item) => item.done).length
  const readinessPercent = Math.round((completedProgressItems / homeCopy.progressItems.length) * 100)

  const emotionalNote =
    language === 'ms'
      ? activeDraft && activeScenario
        ? 'Bagus. Anda dah mula. Sambung satu langkah lagi.'
        : attempts.length === 0
          ? 'Tak perlu AI, coding, atau AWS. Kita mula perlahan-lahan.'
          : attempts.length === 1
            ? 'Bagus! Latihan pertama dah siap. Cuba baiki sekali lagi.'
            : 'Mantap. Teruskan baiki bahagian yang lemah dulu.'
      : activeDraft && activeScenario
        ? 'Nice. You already started. Continue one more step.'
        : attempts.length === 0
          ? 'No AI, coding, or AWS experience needed. Start small.'
          : attempts.length === 1
            ? 'Nice work. First practice done. Improve it once more.'
            : 'Great. Keep improving your weakest step first.'

  const reassuranceLine =
    language === 'ms'
      ? 'Tak perlu coding. Tak perlu pengalaman AI.'
      : 'No coding. No AI background required.'

  const celebrationLine =
    language === 'ms'
      ? completedProgressItems === 0
        ? 'Tak apa. Yang penting anda mula.'
        : completedProgressItems === 3
          ? 'Tahniah! Asas dah lepas. Anda sedang konsisten.'
          : `Bagus. Anda dah siap ${completedProgressItems} daripada 3.`
      : completedProgressItems === 0
        ? 'That is okay. Starting is what matters.'
        : completedProgressItems === 3
          ? 'Well done. The basics are done. Keep going.'
          : `Nice. You completed ${completedProgressItems} of 3.`

  const closeTutorial = () => {
    completeTutorial()
    setTutorialOpen(false)
  }

  return (
    <>
      <TutorialModal
        open={tutorialOpen}
        title={t(language, 'tutorialTitle')}
        description={t(language, 'tutorialDescription')}
        closeLabel={t(language, 'tutorialDismiss')}
        onClose={closeTutorial}
        steps={[
          {
            title: t(language, 'tutorialStep1Title'),
            body: t(language, 'tutorialStep1Body'),
          },
          {
            title: t(language, 'tutorialStep2Title'),
            body: t(language, 'tutorialStep2Body'),
          },
          {
            title: t(language, 'tutorialStep3Title'),
            body: t(language, 'tutorialStep3Body'),
          },
        ]}
      />
      <div className="space-y-8 sm:space-y-10">
        <section className="overflow-hidden rounded-[32px] border border-[color:rgba(91,123,245,0.18)] bg-[linear-gradient(135deg,rgba(91,123,245,0.18),rgba(91,123,245,0.04))] p-5 shadow-[var(--shadow-card)] sm:p-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium text-[var(--accent)]">{homeCopy.heroEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              {homeCopy.heroTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              {homeCopy.heroDescription}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {reassuranceLine}
            </p>

            <div className="mt-6 space-y-3">
              {homeCopy.heroPoints.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:rgba(91,123,245,0.14)] text-sm font-semibold text-[var(--accent)]">
                    •
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to={startRoute}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                {homeCopy.startLearning}
              </Link>
              <a
                href="#home-timeline"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              >
                {homeCopy.seeCompetition}
              </a>
            </div>

            <button
              type="button"
              onClick={() => setTutorialOpen(true)}
              className="mt-4 text-sm font-medium text-[var(--accent)]"
            >
              {homeCopy.tutorialLink}
            </button>

            <div className="mt-5 rounded-[18px] bg-[color:rgba(52,211,153,0.10)] px-4 py-3">
              <p className="text-sm font-medium text-[var(--text)]">{emotionalNote}</p>
            </div>

            <div className="mt-6 rounded-[20px] bg-[color:rgba(19,19,26,0.35)] p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[16px] bg-[var(--surface)] px-4 py-3">
                  <p className="text-xs text-[var(--text-muted)]">{homeCopy.currentStatus}</p>
                  <p className="mt-1 text-sm font-medium">{homeCopy.currentStatusValue}</p>
                </div>
                <div className="rounded-[16px] bg-[var(--surface)] px-4 py-3">
                  <p className="text-xs text-[var(--text-muted)]">{homeCopy.countdownLabel}</p>
                  <p className="mt-1 text-sm font-medium">{homeCopy.countdownValue}</p>
                </div>
                <div className="rounded-[16px] bg-[var(--surface)] px-4 py-3">
                  <p className="text-xs text-[var(--text-muted)]">{homeCopy.firstSession}</p>
                  <p className="mt-1 text-sm font-medium">{homeCopy.firstSessionValue}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">
                {homeCopy.beginnerLabel}: {homeCopy.beginnerValue}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section
            id="home-timeline"
            className="rounded-[28px] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <p className="text-sm font-medium text-[var(--accent)]">{homeCopy.timelineEyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight">{homeCopy.timelineTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {homeCopy.timelineDescription}
            </p>

            <div className="mt-6 space-y-4">
              {homeCopy.timeline.map((item, index) => (
                <div key={`${item.title}-${index}`} className="flex gap-3">
                  <div className="flex w-10 flex-col items-center">
                    <StatusMark status={item.status as PhaseStatus} />
                    {index < homeCopy.timeline.length - 1 ? (
                      <div className="mt-2 h-full w-px bg-[var(--border)]" />
                    ) : null}
                  </div>
                  <div className="flex-1 rounded-[20px] bg-[var(--surface-raised)] px-4 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-base font-medium text-[var(--text)]">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-sm text-[var(--text-muted)]">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
            <p className="text-sm font-medium text-[var(--accent)]">{homeCopy.learningEyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight">{homeCopy.learningTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {homeCopy.learningDescription}
            </p>

            <div className="mt-6 grid gap-3">
              {homeCopy.learningItems.map((item, index) => (
                <div key={item.title} className="rounded-[20px] bg-[var(--surface-raised)] p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:rgba(91,123,245,0.14)] text-sm font-semibold text-[var(--accent)]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-base font-medium text-[var(--text)]">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[20px] bg-[color:rgba(91,123,245,0.08)] p-4">
              <p className="text-sm font-medium text-[var(--text)]">{homeCopy.gpridTitle}</p>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {homeCopy.gpridSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[16px] bg-[var(--surface)] px-3 py-3 text-center text-xs font-medium text-[var(--text-secondary)] sm:text-sm"
                  >
                    <span className="block text-[11px] text-[var(--text-muted)]">
                      {language === 'ms' ? `Langkah ${index + 1}` : `Step ${index + 1}`}
                    </span>
                    <span className="mt-1 block">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[28px] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
            <p className="text-sm font-medium text-[var(--accent)]">{homeCopy.progressEyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight">{homeCopy.progressTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {homeCopy.progressDescription}
            </p>

            <div className="mt-6 rounded-[20px] bg-[var(--surface-raised)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--text)]">
                  {language === 'ms' ? 'Kemajuan permulaan' : 'Getting started progress'}
                </p>
                <p className="text-lg font-semibold">{readinessPercent}%</p>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{celebrationLine}</p>
              <div className="mt-3 h-3 rounded-full bg-[var(--surface)]">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,var(--accent),rgba(52,211,153,0.9))] transition-[width] duration-200 ease-out"
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                {homeCopy.attemptsLabel}: {attempts.length} · {homeCopy.bestScoreLabel}: {bestScore} ·{' '}
                {homeCopy.weakestLabel}: {weakestStepLabel ?? weakestLayer}
              </p>
              <div className="mt-4 space-y-2">
                {homeCopy.progressItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        item.done
                          ? 'bg-[color:rgba(52,211,153,0.14)] text-[var(--success)]'
                          : 'bg-[var(--surface)] text-[var(--text-muted)]'
                      }`}
                    >
                      {item.done ? '✓' : '•'}
                    </span>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
            <p className="text-sm font-medium text-[var(--accent)]">{homeCopy.nextStepEyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight">{homeCopy.nextStepTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {homeCopy.nextStepDescription}
            </p>

            <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,rgba(91,123,245,0.14),rgba(91,123,245,0.04))] p-5">
              <p className="text-sm leading-7 text-[var(--text)]">{homeCopy.nextStepHint}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to={startRoute}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {homeCopy.nextStepAction}
                </Link>
                <Button variant="secondary" onClick={() => setTutorialOpen(true)}>
                  {language === 'ms' ? 'Buka tutorial' : 'Open tutorial'}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
