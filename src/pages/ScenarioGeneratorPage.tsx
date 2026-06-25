import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LearningGuideCard from '../components/LearningGuideCard'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import StepFlow from '../components/StepFlow'
import Button from '../components/ui/Button'
import Pill from '../components/ui/Pill'
import { t } from '../lib/copy'
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_SUMMARIES,
  DOMAIN_OPTIONS,
} from '../lib/constants'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

function ScenarioGeneratorPage() {
  const navigate = useNavigate()
  const language = useAppStore((state) => state.language)
  const generatorDomain = useAppStore((state) => state.generatorDomain)
  const generatorDifficulty = useAppStore((state) => state.generatorDifficulty)
  const seedInput = useAppStore((state) => state.seedInput)
  const preview = useAppStore((state) => state.generatorPreview)
  const setGeneratorDomain = useAppStore((state) => state.setGeneratorDomain)
  const setGeneratorDifficulty = useAppStore((state) => state.setGeneratorDifficulty)
  const setSeedInput = useAppStore((state) => state.setSeedInput)
  const previewScenario = useAppStore((state) => state.previewScenario)
  const startScenario = useAppStore((state) => state.startScenario)
  const pageCopy =
    language === 'ms'
      ? {
          flowTitle: 'Aliran latihan',
          flow: [
            { label: 'Pilih latihan', detail: 'Sekarang', active: true },
            { label: 'Tulis GPRID', detail: 'Ruang Latihan' },
            { label: 'Semak jawapan', detail: 'Penilaian' },
            { label: 'Baiki jawapan', detail: 'Cuba lagi' },
          ],
          formEyebrow: 'Langkah pertama',
          formTitle: 'Pilih latihan yang anda mahu mulakan',
          formDescription:
            'Pilih satu bidang, tahap, dan Kod Latihan. Selepas itu, terus buka Ruang Latihan.',
          domainHelp: 'Bidang ini tentukan jenis situasi yang anda akan latih.',
          difficultyHelp: 'Pilih tahap yang sesuai dengan keyakinan anda sekarang.',
          seedHelp: 'Gunakan Kod Latihan jika anda mahu ulang cabaran yang sama kemudian.',
          seedExample: 'Contoh: HEALTH-L5-TRIAGE-001',
          domainHint: 'Mulakan dengan bidang yang anda rasa paling mudah difahami.',
          difficultyHint: 'Kalau baru mula, pilih tahap rendah dahulu.',
          seedHint: 'Biarkan kosong jika anda mahu sistem pilih kod secara automatik.',
          domainMistake: 'Jangan pilih bidang yang anda belum faham jika anda masih baru.',
          difficultyMistake: 'Jangan terus pilih tahap tinggi hanya kerana mahu cabaran lebih susah.',
          seedMistake: 'Jangan ubah Kod Latihan dengan terlalu kerap jika anda mahu bandingkan kemajuan.',
          storyEyebrow: 'Cerita latihan',
          storyTitle: preview ? preview.title : 'Lihat cerita latihan anda di sini',
          storyDescription: preview
            ? 'Baca cerita ini dahulu. Selepas itu, barulah anda mula isi GPRID.'
            : 'Jana pratonton dahulu supaya anda nampak cerita latihan sebelum mula menulis jawapan.',
          situation: 'Situasi',
          objective: 'Matlamat utama',
          challenge: 'Cabaran utama',
          importantInfo: 'Maklumat penting',
          risks: 'Risiko yang perlu dijaga',
          nextStep: 'Apa perlu buat selepas ini?',
          nextStepBody:
            'Kalau cerita ini sesuai, tekan "Mula Senario" dan teruskan ke Ruang Latihan.',
          noPreview: 'Belum ada pratonton lagi. Tekan "Jana Pratonton" untuk lihat cerita latihan.',
          generatePreview: 'Jana Pratonton',
          startScenario: 'Mula Senario',
          trainingCode: 'Kod Latihan',
          noTimer: 'Tiada had masa',
          timePressure: 'Ada tekanan masa',
          infoCount: (level: 'full' | 'partial' | 'minimal') =>
            level === 'full'
              ? 'Maklumat lengkap'
              : level === 'partial'
                ? 'Maklumat separa'
                : 'Maklumat terhad',
          agentCount: (count: 'single' | 'multi') =>
            count === 'multi' ? 'Beberapa agent' : 'Satu agent',
          advancedInfo: 'Butiran tambahan',
          environment: 'Keadaan persekitaran',
        }
      : {
          flowTitle: 'Learning flow',
          flow: [
            { label: 'Choose a scenario', detail: 'Now', active: true },
            { label: 'Write GPRID', detail: 'Workspace' },
            { label: 'Review feedback', detail: 'Evaluation' },
            { label: 'Improve and retry', detail: 'Next attempt' },
          ],
          formEyebrow: 'Step one',
          formTitle: 'Choose the training challenge you want to start',
          formDescription:
            'Pick a domain, level, and training code. Then move into the training workspace.',
          domainHelp: 'This decides what kind of situation you will practise.',
          difficultyHelp: 'Pick the level that matches your current confidence.',
          seedHelp: 'Use a training code if you want to replay the same challenge later.',
          seedExample: 'Example: HEALTH-L5-TRIAGE-001',
          domainHint: 'Start with the domain that feels easiest to understand.',
          difficultyHint: 'If you are new, begin with a lower level first.',
          seedHint: 'Leave it empty if you want the system to create one for you.',
          domainMistake: 'Do not start with an unfamiliar domain if you are still learning.',
          difficultyMistake: 'Do not jump to a high level too early.',
          seedMistake: 'Do not keep changing the training code if you want a fair comparison.',
          storyEyebrow: 'Training story',
          storyTitle: preview ? preview.title : 'Your training story will appear here',
          storyDescription: preview
            ? 'Read the story first. Then start building your GPRID answer.'
            : 'Generate a preview first so you can understand the story before writing your answer.',
          situation: 'Situation',
          objective: 'Main objective',
          challenge: 'Main challenge',
          importantInfo: 'Important information',
          risks: 'Possible risks',
          nextStep: 'What should you do after this?',
          nextStepBody:
            'If this story looks right, press "Start Scenario" and continue in the training workspace.',
          noPreview: 'No preview yet. Press "Generate Preview" to see the training story.',
          generatePreview: 'Generate Preview',
          startScenario: 'Start Scenario',
          trainingCode: 'Training Code',
          noTimer: 'No timer',
          timePressure: 'Time pressure',
          infoCount: (level: 'full' | 'partial' | 'minimal') =>
            level === 'full'
              ? 'Complete information'
              : level === 'partial'
                ? 'Partial information'
                : 'Limited information',
          agentCount: (count: 'single' | 'multi') =>
            count === 'multi' ? 'Multiple agents' : 'Single agent',
          advancedInfo: 'Extra details',
          environment: 'Environment',
        }
  const guide =
    language === 'ms'
      ? {
          eyebrow: 'Panduan halaman',
          title: 'Mula dengan satu senario latihan',
          description:
            'Halaman ini bantu anda pilih latihan yang sesuai sebelum masuk ke Ruang Latihan.',
          whatIsThis:
            'Ini tempat untuk jana latihan ikut bidang, tahap, dan Kod Latihan.',
          whyItMatters:
            'Latihan yang jelas bantu anda fokus pada cara berfikir, bukan teka situasi.',
          whatToDo:
            'Pilih bidang, pilih tahap, semak pratonton, kemudian tekan "Mula Senario".',
          estimatedTime: 'Anggaran 2 minit',
          difficulty: 'Tahap: Mudah hingga tinggi',
          progress: preview ? 'Pratonton tersedia' : 'Belum mula',
          tip: 'Kalau masih baru, mula dengan tahap rendah supaya anda faham aliran latihan dahulu.',
          nextStep:
            'Selepas semak pratonton, buka Ruang Latihan dan mula isi GPRID.',
          detailsLabel: 'Lihat maksud istilah penting',
          malayLabels: true,
          glossaryItems: [
            {
              term: 'Bidang',
              explanation: 'Bidang latihan yang anda mahu cuba, seperti kesihatan atau khidmat pelanggan.',
            },
            {
              term: 'Tahap',
              explanation: 'Tahap kesukaran senario. Lagi tinggi tahap, lagi banyak perkara perlu difikirkan.',
            },
            {
              term: 'Kod Latihan',
              explanation: 'Kod ini membolehkan anda ulang latihan yang sama nanti.',
            },
          ],
        }
      : {
          eyebrow: 'Page guide',
          title: 'Start with one practice scenario',
          description:
            'This page helps you choose a suitable training challenge before entering the GPRID workspace.',
          whatIsThis:
            'This is where you generate a practice situation based on domain, level, and a reusable seed.',
          whyItMatters:
            'A clear scenario helps you focus on thinking quality instead of guessing the problem context.',
          whatToDo:
            'Choose a domain, choose a level, review the preview, then press "Start Scenario".',
          estimatedTime: 'Estimated 2 minutes',
          difficulty: 'Level: Beginner to Advanced',
          progress: preview ? 'Preview ready' : 'Not started',
          tip: 'If you are new, begin with a lower level so you can understand the learning flow first.',
          nextStep:
            'Once the preview looks right, open the workspace and start filling Goal through Decision.',
          detailsLabel: 'See key terms',
          malayLabels: false,
          glossaryItems: [
            {
              term: 'Domain',
              explanation: 'The situation area you want to practise, such as healthcare or customer service.',
            },
            {
              term: 'Level',
              explanation: 'The difficulty of the scenario. Higher levels require more structured thinking.',
            },
            {
              term: 'Seed',
              explanation: 'A scenario code that lets you replay the same challenge later.',
            },
          ],
        }

  useEffect(() => {
    if (!preview) previewScenario()
  }, [preview, previewScenario])

  return (
    <div className="space-y-6">
      <LearningGuideCard {...guide} />
      <StepFlow title={pageCopy.flowTitle} items={pageCopy.flow} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard>
          <PageHeader
            eyebrow={pageCopy.formEyebrow}
            title={pageCopy.formTitle}
            description={pageCopy.formDescription}
          />

          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text)]">
                {t(language, 'domain')}
              </label>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{pageCopy.domainHelp}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{pageCopy.domainHint}</p>
              <p className="mt-1 text-xs text-[var(--warning)]">{pageCopy.domainMistake}</p>
              <select
                value={generatorDomain}
                onChange={(event) => setGeneratorDomain(event.target.value as typeof generatorDomain)}
                className="mt-3 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)] outline-none"
              >
                {DOMAIN_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.key}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)]">
                {t(language, 'difficulty')}
              </label>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {pageCopy.difficultyHelp}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{pageCopy.difficultyHint}</p>
              <p className="mt-1 text-xs text-[var(--warning)]">
                {pageCopy.difficultyMistake}
              </p>
              <select
                value={generatorDifficulty}
                onChange={(event) => setGeneratorDifficulty(Number(event.target.value))}
                className="mt-3 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)] outline-none"
              >
                {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    Level {value} — {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)]">
                {pageCopy.trainingCode}
              </label>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{pageCopy.seedHelp}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{pageCopy.seedExample}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{pageCopy.seedHint}</p>
              <p className="mt-1 text-xs text-[var(--warning)]">{pageCopy.seedMistake}</p>
              <input
                value={seedInput}
                onChange={(event) => setSeedInput(event.target.value.toUpperCase())}
                placeholder="HEALTH-L5-TRIAGE-001"
                className="mt-3 w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                {t(language, 'seedFormatHint', generatorDifficulty)}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button variant="secondary" onClick={previewScenario}>
                {pageCopy.generatePreview}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSeedInput('')
                  previewScenario()
                }}
              >
                {t(language, 'newSeed')}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  startScenario()
                  navigate(ROUTES.workspace)
                }}
              >
                {pageCopy.startScenario}
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <PageHeader
            eyebrow={pageCopy.storyEyebrow}
            title={pageCopy.storyTitle}
            description={pageCopy.storyDescription}
          />
          {preview ? (
            <div className="mt-5 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>{preview.domain}</Pill>
                <Pill tone="accent">
                  Level {preview.difficulty} — {preview.difficultyLabel}
                </Pill>
                <Pill>{preview.seed}</Pill>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {pageCopy.situation}
                </p>
                <p className="mt-2 text-base leading-7 text-[var(--text)]">{preview.context}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {pageCopy.objective}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text)]">{preview.objective}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {pageCopy.challenge}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text)]">
                    {DIFFICULTY_SUMMARIES[preview.difficulty]}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {pageCopy.importantInfo}
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {preview.constraints.map((constraint) => (
                    <li key={constraint}>• {constraint}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {pageCopy.risks}
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {preview.risks.map((risk) => (
                    <li key={risk}>• {risk}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] bg-[var(--surface-raised)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {t(language, 'sampleSituation')}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text)]">
                  {preview.sampleSituation}
                </p>
              </div>

              <details className="rounded-[20px] bg-[var(--surface-raised)] px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-medium text-[var(--text)]">
                  {pageCopy.advancedInfo}
                </summary>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>{pageCopy.infoCount(preview.difficultyProfile.informationCompleteness)}</Pill>
                  <Pill tone={preview.difficultyProfile.timePressure ? 'warning' : 'default'}>
                    {preview.difficultyProfile.timePressure
                      ? pageCopy.timePressure
                      : pageCopy.noTimer}
                  </Pill>
                  <Pill>{pageCopy.agentCount(preview.difficultyProfile.agentCount)}</Pill>
                  <Pill>
                    {pageCopy.environment}: {preview.difficultyProfile.environmentalStability}
                  </Pill>
                </div>
              </details>

              <div className="rounded-[20px] border border-[color:rgba(91,123,245,0.18)] bg-[color:rgba(91,123,245,0.08)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                  {pageCopy.nextStep}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text)]">{pageCopy.nextStepBody}</p>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm text-[var(--text-secondary)]">{pageCopy.noPreview}</p>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

export default ScenarioGeneratorPage
