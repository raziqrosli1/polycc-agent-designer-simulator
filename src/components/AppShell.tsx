import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import { t } from '../lib/copy'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 min-w-0 items-center justify-center rounded-full px-2 py-2 text-center text-[11px] leading-4 font-medium transition sm:px-3 sm:text-sm ${
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
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="sticky top-2 z-20 mb-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--shell-backdrop)] p-2 shadow-[var(--shadow-card)] backdrop-blur sm:top-4 sm:mb-6 sm:p-4">
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 sm:items-center">
              <div className="min-w-0 py-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)] sm:text-xs sm:tracking-[0.24em]">
                  {t(language, 'appTitle')}
                </p>
                <h1 className="mt-1 hidden text-sm font-medium leading-tight sm:block sm:text-base">
                  {t(language, 'localMvp')}
                </h1>
              </div>

              <div className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
                <div className="grid grid-cols-2 rounded-full bg-[var(--surface-raised)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                    aria-label={t(language, 'languageEnglish')}
                    className={`min-h-11 rounded-full px-2.5 py-2 text-xs font-medium transition sm:px-3 ${
                      language === 'en'
                        ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ms')}
                    aria-pressed={language === 'ms'}
                    aria-label={t(language, 'languageMalay')}
                    className={`min-h-11 rounded-full px-2.5 py-2 text-xs font-medium transition sm:px-3 ${
                      language === 'ms'
                        ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    BM
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label={theme === 'dark' ? t(language, 'lightMode') : t(language, 'darkMode')}
                  className="min-h-11 rounded-full px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:text-[var(--text)] sm:text-sm"
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>

            <nav
              aria-label="Primary navigation"
              className="grid grid-cols-4 gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
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
