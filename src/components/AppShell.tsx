import { useEffect, useState, type PropsWithChildren } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '../lib/routes'
import { useAppStore } from '../store/appStore'

const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 min-w-0 items-center justify-center rounded-full px-3 py-2 text-center text-sm leading-5 font-medium transition ${
    isActive
      ? 'bg-[var(--surface-raised)] text-[var(--text)]'
      : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
  }`

const drawerNavClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 items-center rounded-[16px] px-4 py-3 text-sm font-medium transition ${
    isActive
      ? 'bg-[var(--surface-raised)] text-[var(--text)]'
      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)]'
  }`

function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const theme = useAppStore((state) => state.theme)
  const language = useAppStore((state) => state.language)
  const beginnerMode = useAppStore((state) => state.beginnerMode)
  const setTheme = useAppStore((state) => state.setTheme)
  const setLanguage = useAppStore((state) => state.setLanguage)
  const setBeginnerMode = useAppStore((state) => state.setBeginnerMode)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const labels =
    language === 'ms'
      ? {
          official: 'Platform latihan rasmi',
          productName: 'POLYCC Agent Designer Simulator',
          openMenu: 'Buka menu',
          closeMenu: 'Tutup menu',
          menu: 'Menu',
          settings: 'Tetapan',
          language: 'Bahasa',
          appearance: 'Paparan',
          learningMode: 'Cara belajar',
          englishShort: 'EN',
          malayShort: 'BM',
          darkShort: 'Gelap',
          lightShort: 'Cerah',
          beginnerOn: 'Mod Asas aktif',
          beginnerOff: 'Mod Asas belum aktif',
          darkModeLabel: 'Mod gelap',
          lightModeLabel: 'Mod cerah',
          onLabel: 'Aktif',
          offLabel: 'Belum',
        }
      : {
          official: 'Official preparation platform',
          productName: 'POLYCC Agent Designer Simulator',
          openMenu: 'Open menu',
          closeMenu: 'Close menu',
          menu: 'Menu',
          settings: 'Settings',
          language: 'Language',
          appearance: 'Appearance',
          learningMode: 'Learning mode',
          englishShort: 'EN',
          malayShort: 'BM',
          darkShort: 'Dark',
          lightShort: 'Light',
          beginnerOn: 'Beginner Mode: ON',
          beginnerOff: 'Beginner Mode: OFF',
          darkModeLabel: 'Dark mode',
          lightModeLabel: 'Light mode',
          onLabel: 'On',
          offLabel: 'Off',
        }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="sticky top-2 z-20 mb-4 rounded-[24px] border border-[var(--border)] bg-[var(--shell-backdrop)] px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur sm:top-4 sm:mb-6 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:hidden">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {labels.official}
              </p>
              <h1 className="mt-1 text-sm font-semibold leading-tight">{labels.productName}</h1>
            </div>
            <button
              type="button"
              aria-label={drawerOpen ? labels.closeMenu : labels.openMenu}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((current) => !current)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--border-strong)]"
            >
              {drawerOpen ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6L18 18" />
                  <path d="M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M4 7H20" />
                  <path d="M4 12H20" />
                  <path d="M4 17H20" />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-col sm:gap-4">
            <div className="flex items-start justify-between gap-4 lg:items-center">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  {labels.official}
                </p>
                <h1 className="mt-1 text-base font-semibold leading-tight lg:text-lg">
                  {labels.productName}
                </h1>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
                  <span className="px-2 text-xs text-[var(--text-muted)]">{labels.language}</span>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                    aria-label="English"
                    className={`min-h-11 rounded-full px-3 py-2 text-xs font-medium transition ${
                      language === 'en'
                        ? 'bg-[var(--surface-raised)] text-[var(--text)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {labels.englishShort}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ms')}
                    aria-pressed={language === 'ms'}
                    aria-label="Bahasa Melayu"
                    className={`min-h-11 rounded-full px-3 py-2 text-xs font-medium transition ${
                      language === 'ms'
                        ? 'bg-[var(--surface-raised)] text-[var(--text)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {labels.malayShort}
                  </button>
                </div>

                <div className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
                  <span className="px-2 text-xs text-[var(--text-muted)]">{labels.appearance}</span>
                  <button
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label={theme === 'dark' ? labels.lightShort : labels.darkShort}
                    className="min-h-11 rounded-full px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-raised)] hover:text-[var(--text)]"
                  >
                    {theme === 'dark' ? labels.lightShort : labels.darkShort}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setBeginnerMode(!beginnerMode)}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                    beginnerMode
                      ? 'border-[color:rgba(91,123,245,0.28)] bg-[color:rgba(91,123,245,0.12)] text-[var(--accent)]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                  }`}
                >
                  {beginnerMode ? labels.beginnerOn : labels.beginnerOff}
                </button>
              </div>
            </div>

            <nav
              aria-label="Primary navigation"
              className="grid grid-cols-4 gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
            >
              <NavLink to={ROUTES.dashboard} className={desktopNavClass} end>
                {language === 'ms' ? 'Utama' : 'Dashboard'}
              </NavLink>
              <NavLink to={ROUTES.generator} className={desktopNavClass}>
                {language === 'ms' ? 'Pilih Latihan' : 'Practice'}
              </NavLink>
              <NavLink to={ROUTES.workspace} className={desktopNavClass}>
                {language === 'ms' ? 'Ruang Latihan' : 'Training Room'}
              </NavLink>
              <NavLink to={ROUTES.history} className={desktopNavClass}>
                {language === 'ms' ? 'Kemajuan Saya' : 'My Progress'}
              </NavLink>
            </nav>
          </div>
        </header>

        {drawerOpen ? (
          <div className="fixed inset-0 z-30 sm:hidden">
            <button
              type="button"
              aria-label={labels.closeMenu}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-[color:rgba(10,10,15,0.58)] backdrop-blur-sm"
            />
            <aside className="absolute right-0 top-0 flex h-full w-[min(84vw,360px)] flex-col border-l border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-strong)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    {labels.menu}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{labels.productName}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={labels.closeMenu}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M6 6L18 18" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav aria-label="Primary navigation" className="mt-6 grid gap-2">
                <NavLink to={ROUTES.dashboard} className={drawerNavClass} end>
                  {language === 'ms' ? 'Utama' : 'Dashboard'}
                </NavLink>
                <NavLink to={ROUTES.generator} className={drawerNavClass}>
                  {language === 'ms' ? 'Pilih Latihan' : 'Practice'}
                </NavLink>
                <NavLink to={ROUTES.workspace} className={drawerNavClass}>
                  {language === 'ms' ? 'Ruang Latihan' : 'Training Room'}
                </NavLink>
                <NavLink to={ROUTES.history} className={drawerNavClass}>
                  {language === 'ms' ? 'Kemajuan Saya' : 'My Progress'}
                </NavLink>
              </nav>

              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {labels.settings}
                  </p>
                </div>

                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {labels.language}
                  </p>
                  <div className="mt-3 inline-flex min-h-11 w-full items-center rounded-full bg-[var(--surface)] p-1">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      aria-pressed={language === 'en'}
                      className={`min-h-11 flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                        language === 'en'
                          ? 'bg-[var(--surface-raised)] text-[var(--text)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {labels.englishShort}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('ms')}
                      aria-pressed={language === 'ms'}
                      className={`min-h-11 flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                        language === 'ms'
                          ? 'bg-[var(--surface-raised)] text-[var(--text)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {labels.malayShort}
                    </button>
                  </div>
                </div>

                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {labels.appearance}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-between rounded-[16px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium"
                  >
                    <span>{theme === 'dark' ? labels.lightShort : labels.darkShort}</span>
                    <span className="text-[var(--text-muted)]">
                      {theme === 'dark' ? labels.lightModeLabel : labels.darkModeLabel}
                    </span>
                  </button>
                </div>

                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {labels.learningMode}
                  </p>
                  <button
                    type="button"
                    onClick={() => setBeginnerMode(!beginnerMode)}
                    className={`mt-3 inline-flex min-h-11 w-full items-center justify-between rounded-[16px] border px-4 py-3 text-sm font-medium ${
                      beginnerMode
                        ? 'border-[color:rgba(91,123,245,0.28)] bg-[color:rgba(91,123,245,0.12)] text-[var(--accent)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>{beginnerMode ? labels.beginnerOn : labels.beginnerOff}</span>
                    <span>{beginnerMode ? labels.onLabel : labels.offLabel}</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
