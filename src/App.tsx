import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.tsx'
import { ROUTES } from './lib/routes.ts'
import DashboardPage from './pages/DashboardPage.tsx'
import EvaluationPage from './pages/EvaluationPage.tsx'
import HistoryPage from './pages/HistoryPage.tsx'
import ScenarioGeneratorPage from './pages/ScenarioGeneratorPage.tsx'
import WorkspacePage from './pages/WorkspacePage.tsx'
import { useAppStore } from './store/appStore.ts'

function App() {
  const theme = useAppStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.generator} element={<ScenarioGeneratorPage />} />
          <Route path={ROUTES.workspace} element={<WorkspacePage />} />
          <Route path={`${ROUTES.evaluation}/:attemptId`} element={<EvaluationPage />} />
          <Route path={ROUTES.history} element={<HistoryPage />} />
          <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
