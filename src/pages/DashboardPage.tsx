import AcademyGuideCard from '../components/AcademyGuideCard'
import HowToPlayCard from '../components/HowToPlayCard'
import { Link } from 'react-router-dom'
import CompetitionJourneyCard from '../components/CompetitionJourneyCard'
import TutorialModal from '../components/TutorialModal'
import { getAcademyGuideOverview } from '../lib/academyGuide'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import StatCard from '../components/StatCard'
import Button from '../components/ui/Button'
import { getCompetitionJourneyOverview } from '../lib/competitionJourney'
import { t } from '../lib/copy'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'
import { useState } from 'react'

function DashboardPage() {
  const language = useAppStore((state) => state.language)
  const tutorialCompleted = useAppStore((state) => state.tutorialCompleted)
  const completeTutorial = useAppStore((state) => state.completeTutorial)
  const beginnerMode = useAppStore((state) => state.beginnerMode)
  const setBeginnerMode = useAppStore((state) => state.setBeginnerMode)
  const activeDraft = useAppStore((state) => state.activeDraft)
  const activeScenario = useAppStore((state) => state.activeScenario)
  const attempts = useAppStore((state) => state.attempts)
  const [tutorialOpen, setTutorialOpen] = useState(!tutorialCompleted)
  const academyOverview = getAcademyGuideOverview(language)
  const journeyOverview = getCompetitionJourneyOverview(language)
  const howToPlaySteps =
    language === 'ms'
      ? [
          '1. Jana satu senario mengikut domain, tahap, dan seed yang boleh diulang.',
          '2. Bina Goal, Priority, Rules, Logic, dan Decision mengikut urutan.',
          '3. Tandakan setiap lapisan selesai, kemudian hantar untuk penilaian.',
          '4. Semak maklum balas, ulang seed yang sama, dan cuba tingkatkan skor anda.',
        ]
      : [
          '1. Generate one scenario by domain, difficulty, and reproducible seed.',
          '2. Build Goal, Priority, Rules, Logic, and Decision in order.',
          '3. Mark each layer complete, then submit for evaluation.',
          '4. Review the feedback, replay the same seed, and improve your score.',
        ]
  const beginnerGuide =
    language === 'ms'
      ? [
          {
            title: 'Apa Itu POLYCC Agentic AI League?',
            description:
              'Pertandingan ini membantu pelajar belajar mereka bentuk AI Agents menggunakan AWS tools dalam persekitaran workshop rasmi.',
          },
          {
            title: 'Apa Itu AI Agent?',
            description:
              'AI Agent ialah sistem yang memahami goal, menyusun priority, mematuhi rules, menggunakan logic, dan membuat decision dalam satu situasi.',
          },
          {
            title: 'Apa Itu GPRID?',
            description:
              'GPRID bermaksud Goal, Priority, Rules, If-Then Logic, dan Decision. Simulator ini melatih anda berfikir secara tersusun dengan urutan ini.',
          },
          {
            title: 'Kenapa Goal ke Decision Penting?',
            description:
              'Aliran ini memastikan keputusan akhir boleh dijelaskan, diuji, dan dibaiki semula apabila markah atau maklum balas menunjukkan kelemahan.',
          },
        ]
      : [
          {
            title: 'What Is POLYCC Agentic AI League?',
            description:
              'This competition helps students learn to design AI Agents using AWS tools inside the official workshop environment.',
          },
          {
            title: 'What Is an AI Agent?',
            description:
              'An AI Agent is a system that understands a goal, ranks priorities, follows rules, uses logic, and makes a decision in a real situation.',
          },
          {
            title: 'What Is GPRID?',
            description:
              'GPRID means Goal, Priority, Rules, If-Then Logic, and Decision. This simulator trains you to think in that order.',
          },
          {
            title: 'Why Does Goal to Decision Matter?',
            description:
              'That sequence makes the final choice explainable, testable, and easier to improve when feedback reveals weak spots.',
          },
        ]

  const averageScore = attempts.length
    ? Math.round(
        attempts.reduce(
          (total, attempt) => total + attempt.evaluation.scores.total,
          0,
        ) / attempts.length,
      )
    : 0
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
  const mostPlayedDomain = attempts.length
    ? Object.entries(
        attempts.reduce<Record<string, number>>((accumulator, attempt) => {
          accumulator[attempt.scenario.domain] =
            (accumulator[attempt.scenario.domain] ?? 0) + 1
          return accumulator
        }, {}),
      ).sort((left, right) => right[1] - left[1])[0][0]
    : '—'

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
      <div className="space-y-4 sm:space-y-6">
        <SectionCard>
          <PageHeader
            eyebrow={t(language, 'firstTimeBannerTitle')}
            title={t(language, 'tutorialBanner')}
            description={t(language, 'firstTimeBannerDescription')}
          />
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="primary" onClick={() => setTutorialOpen(true)}>
              {t(language, 'tutorialOpen')}
            </Button>
            <Button
              variant={beginnerMode ? 'primary' : 'secondary'}
              onClick={() => setBeginnerMode(!beginnerMode)}
            >
              {t(language, 'beginnerMode')}: {beginnerMode ? 'ON' : 'OFF'}
            </Button>
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <HowToPlayCard
            title={t(language, 'howToPlayTitle')}
            description={t(language, 'howToPlayDescription')}
            steps={howToPlaySteps}
          />

          <SectionCard>
            <PageHeader
              eyebrow={t(language, 'beginnerMode')}
              title={language === 'ms' ? 'Asas Yang Perlu Faham' : 'Beginner Essentials'}
              description={
                language === 'ms'
                  ? 'Fahami empat idea teras ini sebelum mula mereka bentuk agent pertama anda.'
                  : 'Understand these four core ideas before designing your first agent.'
              }
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {beginnerGuide.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-4"
                >
                  <h3 className="text-sm font-medium sm:text-base">{item.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 sm:space-y-6">
            <SectionCard>
              <PageHeader
                eyebrow={t(language, 'resume')}
                title={
                  activeDraft && activeScenario
                    ? activeScenario.title
                    : t(language, 'noActiveDraft')
                }
                description={
                  activeDraft && activeScenario
                    ? `${activeScenario.domain} · Level ${activeScenario.difficulty} — ${activeScenario.difficultyLabel} · Seed ${activeScenario.seed}`
                    : t(language, 'resumeDescription')
                }
              />
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <Link
                  to={activeDraft && activeScenario ? ROUTES.workspace : ROUTES.generator}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-center text-sm font-medium text-white transition hover:opacity-90"
                >
                  {activeDraft && activeScenario
                    ? t(language, 'continueDraft')
                    : t(language, 'generateScenario')}
                </Link>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    {t(language, 'recentScores')}
                  </p>
                  <h2 className="mt-2 text-xl font-medium">{t(language, 'latestAttempts')}</h2>
                </div>
                <Link to={ROUTES.history} className="text-sm text-[var(--accent)]">
                  {t(language, 'openHistory')}
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {attempts.slice(0, 5).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium">{attempt.scenario.title}</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {attempt.scenario.domain} · Level {attempt.scenario.difficulty} —{' '}
                          {attempt.scenario.difficultyLabel} · {attempt.scenario.seed}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-2xl font-medium">{attempt.evaluation.scores.total}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          Total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {attempts.length === 0 ? (
                  <EmptyState
                    title={t(language, 'noAttemptsYet')}
                    description={t(language, 'noAttemptsDescription')}
                  />
                ) : null}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <SectionCard>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {t(language, 'quickStats')}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <StatCard label={t(language, 'attempts')} value={String(attempts.length)} />
                <StatCard label={t(language, 'average')} value={`${averageScore}`} />
                <StatCard label={t(language, 'best')} value={`${bestScore}`} />
                <StatCard
                  label={t(language, 'weakestLayer')}
                  value={weakestLayer}
                  hint={t(language, 'historyBased')}
                />
                <StatCard label={t(language, 'mostPlayedDomain')} value={mostPlayedDomain} />
              </div>
            </SectionCard>

            <SectionCard>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {t(language, 'nextMove')}
              </p>
              <h2 className="mt-2 text-xl font-medium">{t(language, 'practiceWeakest')}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {t(language, 'practiceWeakestDescription', weakestLayer)}
              </p>
              <Link
                to={ROUTES.generator}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-center text-sm text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              >
                {t(language, 'startNewScenario')}
              </Link>
            </SectionCard>
          </div>
        </div>

        <AcademyGuideCard overview={academyOverview} />

        <CompetitionJourneyCard
          title={t(language, 'journeyTitle')}
          description={t(language, 'journeyDescription')}
          overview={journeyOverview}
          labels={{
            confirmed: t(language, 'officiallyConfirmed'),
            assumptions: t(language, 'reasonableAssumptions'),
            unknowns: t(language, 'unknownInformation'),
            focus: t(language, 'focusTodayLabel'),
            noConfirmed: t(language, 'noConfirmedInfo'),
            noAssumptions: t(language, 'noAssumptionsInfo'),
            noUnknowns: t(language, 'noUnknownInfo'),
          }}
        />
      </div>
    </>
  )
}

export default DashboardPage
