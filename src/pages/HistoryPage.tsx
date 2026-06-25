import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import LearningGuideCard from '../components/LearningGuideCard'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import StepFlow from '../components/StepFlow'
import Button from '../components/ui/Button'
import Pill from '../components/ui/Pill'
import { t } from '../lib/copy'
import { DIFFICULTY_LABELS, DOMAIN_OPTIONS } from '../lib/constants'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

function HistoryPage() {
  const navigate = useNavigate()
  const language = useAppStore((state) => state.language)
  const attempts = useAppStore((state) => state.attempts)
  const retrySeed = useAppStore((state) => state.retrySeed)
  const [seedQuery, setSeedQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')

  const filteredAttempts = useMemo(
    () =>
      attempts.filter((attempt) => {
        const matchesSeed = !seedQuery
          ? true
          : attempt.scenario.seed.toLowerCase().includes(seedQuery.toLowerCase())
        const matchesDomain =
          domainFilter === 'all' ? true : attempt.scenario.domain === domainFilter
        const matchesDifficulty =
          difficultyFilter === 'all'
            ? true
            : attempt.scenario.difficulty === Number(difficultyFilter)

        return matchesSeed && matchesDomain && matchesDifficulty
      }),
    [attempts, difficultyFilter, domainFilter, seedQuery],
  )

  const averageScore = filteredAttempts.length
    ? Math.round(
        filteredAttempts.reduce(
          (total, attempt) => total + attempt.evaluation.scores.total,
          0,
        ) / filteredAttempts.length,
      )
    : 0
  const bestScore = filteredAttempts.length
    ? Math.max(...filteredAttempts.map((attempt) => attempt.evaluation.scores.total))
    : 0
  const pageCopy =
    language === 'ms'
      ? {
          flowTitle: 'Aliran pembelajaran',
          flow: [
            { label: 'Pilih latihan', detail: 'Selesai', complete: true },
            { label: 'Tulis jawapan', detail: 'Selesai', complete: true },
            { label: 'Semak maklum balas', detail: 'Selesai', complete: true },
            { label: 'Baiki jawapan', detail: 'Boleh diulang', complete: true },
            { label: 'Banding kemajuan', detail: 'Sekarang', active: true },
          ],
          summaryEyebrow: 'Fokus halaman',
          summaryTitle:
            'Lihat semula latihan lama supaya anda tahu apa yang patut dibaiki seterusnya',
          summaryDescription:
            'Gunakan halaman ini untuk cari satu latihan lama, faham apa yang berlaku, dan pilih cubaan mana yang patut diulang.',
          attemptCountLabel: 'Latihan ditemui',
          averageLabel: 'Purata skor',
          bestLabel: 'Skor terbaik',
          summaryNote:
            filteredAttempts.length > 0
              ? 'Pilih satu rekod dahulu. Jangan cuba semak semua latihan serentak.'
              : 'Belum ada rekod untuk dibandingkan. Siapkan satu latihan dahulu supaya kemajuan anda mula kelihatan di sini.',
          filterEyebrow: 'Cari latihan yang anda mahu semak',
          filterTitle: 'Tapis rekod sebelum anda memilih',
          filterDescription:
            'Gunakan penapis ini untuk cari latihan tertentu. Setiap penapis ada tujuan yang berbeza.',
          seedLabel: 'Kod Latihan',
          seedHelp: 'Guna kod ini jika anda mahu cari latihan yang sama dengan cepat.',
          seedExample: 'Contoh: HEALTH-L5-TRIAGE-001',
          seedHint: 'Anda boleh taip sebahagian kod sahaja.',
          seedValidation: 'Semak sama ada rekod itu muncul dalam senarai di bawah.',
          seedMistake: 'Kesilapan biasa: terlupa penapis lain masih aktif.',
          domainLabel: 'Bidang',
          domainHelp: 'Pilih bidang jika anda mahu semak latihan daripada topik tertentu sahaja.',
          domainExample: 'Contoh: Healthcare atau Internship Placement',
          domainHint: 'Pilih "Semua domain" jika anda mahu lihat semua rekod.',
          domainValidation: 'Pastikan bidang yang dipilih memang pernah digunakan.',
          domainMistake:
            'Kesilapan biasa: pilih bidang terlalu sempit lalu sangka rekod hilang.',
          levelLabel: 'Tahap',
          levelHelp: 'Gunakan tahap untuk banding latihan yang hampir sama susah.',
          levelExample: 'Contoh: Tahap 3 untuk latihan asas',
          levelHint: 'Bandingan paling adil biasanya datang daripada tahap yang sama.',
          levelValidation: 'Semak sama ada tahap itu wujud dalam rekod semasa.',
          levelMistake:
            'Kesilapan biasa: banding tahap terlalu berbeza lalu sukar nampak peningkatan sebenar.',
          listEyebrow: 'Pilih satu latihan',
          listTitle: 'Buka satu rekod dan tentukan langkah seterusnya',
          listDescription:
            'Setiap rekod di bawah menjawab tiga perkara: apa latihannya, apa yang anda belajar, dan apa patut dibuat selepas ini.',
          lessonLabel: 'Apa yang anda belajar',
          nextLabel: 'Apa patut dibuat selepas ini',
          scoreLabel: 'Skor',
          noAttemptsTitle: 'Belum jumpa rekod yang sepadan',
          nextStepTitle: 'Apa patut anda buat seterusnya',
          nextStepDescription:
            filteredAttempts.length > 0
              ? 'Pilih satu rekod, baca penilaian penuh, kemudian ulang Kod Latihan yang sama untuk baiki satu langkah sahaja.'
              : 'Mulakan satu latihan baharu dahulu. Selepas itu, halaman ini akan jadi tempat untuk anda semak kemajuan sendiri.',
        }
      : {
          flowTitle: 'Learning flow',
          flow: [
            { label: 'Choose training', detail: 'Done', complete: true },
            { label: 'Write your answer', detail: 'Done', complete: true },
            { label: 'Review feedback', detail: 'Done', complete: true },
            { label: 'Improve your answer', detail: 'Can be repeated', complete: true },
            { label: 'Compare progress', detail: 'Now', active: true },
          ],
          summaryEyebrow: 'Page focus',
          summaryTitle: 'Look back at earlier practice so you know what to improve next',
          summaryDescription:
            'Use this page to find one older attempt, understand what happened, and choose which practice to replay next.',
          attemptCountLabel: 'Attempts found',
          averageLabel: 'Average score',
          bestLabel: 'Best score',
          summaryNote:
            filteredAttempts.length > 0
              ? 'Choose one record first. Do not try to review every attempt at the same time.'
              : 'There is no record to compare yet. Complete one training first so your progress becomes visible here.',
          filterEyebrow: 'Find the practice you want to review',
          filterTitle: 'Filter the record before you choose',
          filterDescription:
            'Use these filters to find one practice quickly. Each filter has a different purpose.',
          seedLabel: 'Training Code',
          seedHelp: 'Use this code when you want to find the same practice again fast.',
          seedExample: 'Example: HEALTH-L5-TRIAGE-001',
          seedHint: 'You can type only part of the code.',
          seedValidation: 'Check whether that record appears in the list below.',
          seedMistake: 'Common mistake: forgetting another filter is still active.',
          domainLabel: 'Domain',
          domainHelp: 'Choose a domain when you only want practice from one topic.',
          domainExample: 'Example: Healthcare or Internship Placement',
          domainHint: 'Choose "All domains" if you want the full record.',
          domainValidation: 'Make sure the selected domain actually exists in your record.',
          domainMistake:
            'Common mistake: filtering too narrowly and thinking records are missing.',
          levelLabel: 'Level',
          levelHelp: 'Use level when you want to compare practice with similar difficulty.',
          levelExample: 'Example: Level 3 for easier practice',
          levelHint: 'The fairest comparison usually comes from the same level.',
          levelValidation: 'Check whether that level appears in the current record.',
          levelMistake:
            'Common mistake: comparing very different levels and missing real progress.',
          listEyebrow: 'Choose one practice',
          listTitle: 'Open one record and decide your next move',
          listDescription:
            'Each record below answers three things: what the practice was, what you learned, and what you should do next.',
          lessonLabel: 'What you learned',
          nextLabel: 'What should you do next',
          scoreLabel: 'Score',
          noAttemptsTitle: 'No matching record found',
          nextStepTitle: 'What should you do next',
          nextStepDescription:
            filteredAttempts.length > 0
              ? 'Choose one record, read the full evaluation, then replay the same Training Code to improve one step only.'
              : 'Start one new training first. After that, this page becomes your place to review progress.',
        }
  const guide =
    language === 'ms'
      ? {
          eyebrow: 'Panduan halaman',
          title: 'Semak semula latihan yang anda sudah buat',
          description:
            'Halaman ini bantu anda semak latihan lama supaya anda boleh nampak kemajuan sendiri.',
          whatIsThis:
            'Ini rekod semua latihan yang pernah anda hantar dalam simulator ini.',
          whyItMatters:
            'Bila anda semak latihan lama, anda lebih mudah nampak apa yang sudah baik dan apa yang masih perlu dibaiki.',
          whatToDo:
            'Cari satu rekod, buka penilaian penuh, kemudian pilih sama ada mahu ulang latihan yang sama.',
          estimatedTime: 'Anggaran 3 minit',
          difficulty: 'Tahap: Mudah',
          progress:
            filteredAttempts.length > 0 ? `${filteredAttempts.length} cubaan ditemui` : 'Tiada cubaan lagi',
          tip: 'Ulang Kod Latihan yang sama bila anda mahu bandingkan peningkatan secara adil.',
          nextStep:
            'Pilih satu latihan, baca maklum balas, kemudian cuba lagi untuk baiki satu langkah paling lemah.',
          detailsLabel: 'Lihat maksud istilah penting',
          malayLabels: true,
          glossaryItems: [
            {
              term: 'Kod Latihan',
              explanation: 'Kod ini membolehkan anda jana semula latihan yang sama.',
            },
            {
              term: 'Purata skor',
              explanation: 'Purata markah bagi rekod yang sedang dipaparkan sekarang.',
            },
            {
              term: 'Ulang semula',
              explanation: 'Buka semula latihan yang sama supaya anda boleh cuba versi yang lebih baik.',
            },
          ],
        }
      : {
          eyebrow: 'Page guide',
          title: 'Review the practice you have already done',
          description:
            'This page helps you look back at earlier attempts so you can learn from your own progress.',
          whatIsThis:
            'This is the record of every training attempt you have submitted in the simulator.',
          whyItMatters:
            'When you review older attempts, it becomes easier to see what is stronger now and what still needs work.',
          whatToDo:
            'Find one record, open the full evaluation, then decide whether to replay the same practice.',
          estimatedTime: 'Estimated 3 minutes',
          difficulty: 'Level: Easy to follow',
          progress:
            filteredAttempts.length > 0 ? `${filteredAttempts.length} attempts found` : 'No attempts yet',
          tip: 'Replay the same Training Code when you want a fair before-and-after comparison.',
          nextStep:
            'Choose one attempt, read the feedback, then try again to improve one weak step.',
          detailsLabel: 'See key terms',
          malayLabels: false,
          glossaryItems: [
            {
              term: 'Training Code',
              explanation: 'A challenge code that lets you generate the same scenario again.',
            },
            {
              term: 'Average score',
              explanation: 'The average mark across the attempts currently shown on the page.',
            },
            {
              term: 'Replay',
              explanation: 'Open the same practice again so you can submit a better version.',
            },
          ],
        }

  return (
    <div className="space-y-6">
      <LearningGuideCard {...guide} />
      <StepFlow title={pageCopy.flowTitle} items={pageCopy.flow} />

      <SectionCard>
        <PageHeader
          eyebrow={pageCopy.summaryEyebrow}
          title={pageCopy.summaryTitle}
          description={pageCopy.summaryDescription}
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {pageCopy.attemptCountLabel}
            </p>
            <p className="mt-2 text-4xl font-medium">{filteredAttempts.length}</p>
          </div>
          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {pageCopy.averageLabel}
            </p>
            <p className="mt-2 text-4xl font-medium">{averageScore}</p>
          </div>
          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {pageCopy.bestLabel}
            </p>
            <p className="mt-2 text-4xl font-medium">{bestScore}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {pageCopy.summaryNote}
        </p>
      </SectionCard>

      <SectionCard>
        <PageHeader
          eyebrow={pageCopy.filterEyebrow}
          title={pageCopy.filterTitle}
          description={pageCopy.filterDescription}
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
            <label className="block text-sm font-medium text-[var(--text)]">
              {pageCopy.seedLabel}
            </label>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {pageCopy.seedHelp}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {pageCopy.seedExample}
            </p>
            <input
              value={seedQuery}
              onChange={(event) => setSeedQuery(event.target.value)}
              placeholder="HEALTH-L5-TRIAGE-001"
              className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)]"
            />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{pageCopy.seedHint}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{pageCopy.seedValidation}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{pageCopy.seedMistake}</p>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
            <label className="block text-sm font-medium text-[var(--text)]">
              {pageCopy.domainLabel}
            </label>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {pageCopy.domainHelp}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {pageCopy.domainExample}
            </p>
            <select
              value={domainFilter}
              onChange={(event) => setDomainFilter(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)]"
            >
              <option value="all">{t(language, 'allDomains')}</option>
              {DOMAIN_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.key}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{pageCopy.domainHint}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{pageCopy.domainValidation}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{pageCopy.domainMistake}</p>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
            <label className="block text-sm font-medium text-[var(--text)]">
              {pageCopy.levelLabel}
            </label>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {pageCopy.levelHelp}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {pageCopy.levelExample}
            </p>
            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)]"
            >
              <option value="all">{t(language, 'allLevels')}</option>
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  Level {value} — {label}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{pageCopy.levelHint}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{pageCopy.levelValidation}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{pageCopy.levelMistake}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <PageHeader
          eyebrow={pageCopy.listEyebrow}
          title={pageCopy.listTitle}
          description={pageCopy.listDescription}
        />
        <div className="mt-6 space-y-4">
          {filteredAttempts.map((attempt) => (
            <div key={attempt.id} className="rounded-[28px] bg-[var(--surface-raised)] p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Pill>{attempt.scenario.domain}</Pill>
                    <Pill tone="accent">
                      Level {attempt.scenario.difficulty} — {attempt.scenario.difficultyLabel}
                    </Pill>
                    <Pill>
                      {language === 'ms'
                        ? `Kod Latihan ${attempt.scenario.seed}`
                        : `Training Code ${attempt.scenario.seed}`}
                    </Pill>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-tight sm:text-2xl">
                    {attempt.scenario.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {attempt.scenario.sampleSituation}
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[20px] bg-[var(--surface)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        {pageCopy.lessonLabel}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        {attempt.evaluation.expertRecommendation}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-[var(--surface)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        {pageCopy.nextLabel}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        {language === 'ms'
                          ? 'Buka penilaian penuh dahulu. Jika mahu cuba lagi, ulang Kod Latihan yang sama.'
                          : 'Open the full evaluation first. If you want to try again, replay the same Training Code.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[var(--surface)] p-4 lg:min-w-56">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {pageCopy.scoreLabel}
                  </p>
                  <p className="mt-2 text-4xl font-medium">{attempt.evaluation.scores.total}</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {language === 'ms'
                      ? `Langkah paling lemah: ${attempt.evaluation.diagnostics.weakestLayer}`
                      : `Weakest step: ${attempt.evaluation.diagnostics.weakestLayer}`}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to={`${ROUTES.evaluation}/${attempt.id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
                    >
                      {t(language, 'viewEvaluation')}
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        retrySeed(
                          attempt.scenario.seed,
                          attempt.scenario.domain,
                          attempt.scenario.difficulty,
                        )
                        navigate(ROUTES.workspace)
                      }}
                    >
                      {t(language, 'retryFromSeed')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredAttempts.length === 0 ? (
            <EmptyState
              title={pageCopy.noAttemptsTitle}
              description={t(language, 'noMatchingAttemptsDescription')}
            />
          ) : null}
        </div>
      </SectionCard>

      <SectionCard>
        <PageHeader
          eyebrow={language === 'ms' ? 'Langkah seterusnya' : 'Next step'}
          title={pageCopy.nextStepTitle}
          description={pageCopy.nextStepDescription}
        />
        <div className="mt-5 flex flex-wrap gap-3">
          {filteredAttempts.length > 0 ? (
            <>
              <Link
                to={`${ROUTES.evaluation}/${filteredAttempts[0].id}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
              >
                {t(language, 'viewEvaluation')}
              </Link>
              <Button
                variant="secondary"
                onClick={() => {
                  retrySeed(
                    filteredAttempts[0].scenario.seed,
                    filteredAttempts[0].scenario.domain,
                    filteredAttempts[0].scenario.difficulty,
                  )
                  navigate(ROUTES.workspace)
                }}
              >
                {t(language, 'retryFromSeed')}
              </Button>
            </>
          ) : (
            <Link
              to={ROUTES.generator}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
            >
              {t(language, 'generateScenario')}
            </Link>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

export default HistoryPage
