import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import ErrorBoundary from './components/ErrorBoundary'
import InstallPrompt from './components/InstallPrompt'
import OfflineBanner from './components/OfflineBanner'
import { useTheme } from './hooks/useTheme'
import HomePage from './pages/HomePage'
import CirclesPage from './pages/CirclesPage'
import CircleFeedPage from './pages/CircleFeedPage'
import InsightsPage from './pages/InsightsPage'
import ProfilePage from './pages/ProfilePage'
import ResourceLibraryPage from './pages/ResourceLibraryPage'
import SettingsPage from './pages/SettingsPage'
import PremiumPage from './pages/PremiumPage'
import PremiumSuccessPage from './pages/PremiumSuccessPage'

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme() // Initialize theme

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('safespace_onboarding_complete')
    setIsOnboardingComplete(onboardingComplete === 'true')
    setIsLoading(false)
  }, [])

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/circles" element={<CirclesPage />} />
          <Route path="/circles/:circleId" element={<CircleFeedPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resources" element={<ResourceLibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/premium/success" element={<PremiumSuccessPage />} />
        </Routes>
      </Layout>
      <InstallPrompt />
    </ErrorBoundary>
  )
}

export default App