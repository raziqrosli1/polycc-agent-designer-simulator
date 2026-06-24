import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import { t } from '../lib/copy'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 items-center justify-center rounded-full px-3 py-2 text-center text-sm transition ${
    isActive
      ? 'bg-[var(--surface-raised)] text-[var(--text)]'
      : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
  }`

function AppShell({ children }: PropsWithChildren) {
  const theme = useAppStore((state) => state.theme)
  const language = useAppStore((state) => state.language)
  const setTheme = useAppStore((state) => state.setTheme)
  const setLanguage = useAppStore((state) => state.setLanguage)

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <header className="sticky top-3 z-20 mb-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--shell-backdrop)] px-3 py-3 shadow-[var(--shadow-card)] backdrop-blur sm:top-4 sm:mb-8 sm:px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  {t(language, 'appTitle')}
                </p>
                <h1 className="text-base font-medium sm:text-lg">{t(language, 'localMvp')}</h1>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
                <div className="grid grid-cols-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      language === 'en'
                        ? 'bg-[var(--surface-raised)] text-[var(--text)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {t(language, 'languageEnglish')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ms')}
                    aria-pressed={language === 'ms'}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      language === 'ms'
                        ? 'bg-[var(--surface-raised)] text-[var(--text)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {t(language, 'languageMalay')}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]"
                >
                  {theme === 'dark' ? t(language, 'lightMode') : t(language, 'darkMode')}
                </button>
              </div>
            </div>

            <nav
              aria-label="Primary navigation"
              className="grid grid-cols-2 gap-2 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-2 sm:grid-cols-4"
            >
              <NavLink to={ROUTES.dashboard} className={navClass} end>
                {t(language, 'navDashboard')}
              </NavLink>
              <NavLink to={ROUTES.generator} className={navClass}>
                {t(language, 'navGenerate')}
              </NavLink>
              <NavLink to={ROUTES.workspace} className={navClass}>
                {t(language, 'navWorkspace')}
              </NavLink>
              <NavLink to={ROUTES.history} className={navClass}>
                {t(language, 'navHistory')}
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
