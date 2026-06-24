import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
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

  useEffect(() => {
    if (!preview) previewScenario()
  }, [preview, previewScenario])

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionCard>
        <PageHeader
          eyebrow={t(language, 'scenarioGenerator')}
          title={t(language, 'scenarioGeneratorTitle')}
          description={t(language, 'scenarioGeneratorDescription')}
        />

        <div className="mt-6 space-y-4">
          <label className="block text-sm text-[var(--text-secondary)]">
            {t(language, 'domain')}
            <select
              value={generatorDomain}
              onChange={(event) => setGeneratorDomain(event.target.value as typeof generatorDomain)}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)] outline-none"
            >
              {DOMAIN_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.key}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-[var(--text-secondary)]">
            {t(language, 'difficulty')}
            <select
              value={generatorDifficulty}
              onChange={(event) => setGeneratorDifficulty(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)] outline-none"
            >
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  Level {value} — {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-[var(--text-secondary)]">
            {t(language, 'seed')}
            <input
              value={seedInput}
              onChange={(event) => setSeedInput(event.target.value.toUpperCase())}
              placeholder="HEALTH-L5-TRIAGE-001"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
            />
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {t(language, 'seedFormatHint', generatorDifficulty)}
            </p>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="primary" onClick={previewScenario}>
              {t(language, 'generatePreview')}
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
              variant="secondary"
              onClick={() => {
                startScenario()
                navigate(ROUTES.workspace)
              }}
            >
              {t(language, 'startScenario')}
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {t(language, 'preview')}
        </p>
        {preview ? (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{preview.domain}</Pill>
              <Pill tone="accent">
                Level {preview.difficulty} — {preview.difficultyLabel}
              </Pill>
              <Pill>{preview.seed}</Pill>
            </div>
            <div>
              <h2 className="text-2xl font-medium">{preview.title}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {preview.context}
              </p>
            </div>
            <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {t(language, 'difficultyEngine')}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {DIFFICULTY_SUMMARIES[preview.difficulty]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>{preview.difficultyProfile.informationCompleteness} info</Pill>
                <Pill tone={preview.difficultyProfile.timePressure ? 'warning' : 'default'}>
                  {preview.difficultyProfile.timePressure ? 'Time pressure' : 'No timer'}
                </Pill>
                <Pill>{preview.difficultyProfile.agentCount} agent</Pill>
                <Pill>{preview.difficultyProfile.environmentalStability}</Pill>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {t(language, 'objective')}
              </p>
              <p className="mt-2 text-sm text-[var(--text)]">{preview.objective}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {t(language, 'constraints')}
                </p>
                <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                  {preview.constraints.map((constraint) => (
                    <li key={constraint}>• {constraint}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {t(language, 'risks')}
                </p>
                <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                  {preview.risks.map((risk) => (
                    <li key={risk}>• {risk}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {t(language, 'sampleSituation')}
              </p>
              <p className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-sm text-[var(--text)]">
                {preview.sampleSituation}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            {t(language, 'generatePreview')}
          </p>
        )}
      </SectionCard>
    </div>
  )
}

export default ScenarioGeneratorPage
