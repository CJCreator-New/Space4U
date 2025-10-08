import { useState, useEffect } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import ErrorBoundary from './components/ErrorBoundary'
import MigrationStatus from './components/MigrationStatus'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CirclesPage from './pages/CirclesPage'
import CircleFeedPage from './pages/CircleFeedPage'
import InsightsPage from './pages/InsightsPage'
import ProfilePage from './pages/ProfilePage'
import ResourceLibraryPage from './pages/ResourceLibraryPage'
import SettingsPage from './pages/SettingsPage'
import PremiumPage from './pages/PremiumPage'
import PremiumSuccessPage from './pages/PremiumSuccessPage'
import AuthPage from './pages/AuthPage'
import TherapeuticToolsPage from './pages/TherapeuticToolsPage'
import GratitudeJournalPage from './pages/GratitudeJournalPage'
import HabitTrackerPage from './pages/HabitTrackerPage'
import EmotionTrackerPage from './pages/EmotionTrackerPage'
import CopingSkillsPage from './pages/CopingSkillsPage'
import RemindersPage from './pages/RemindersPage'
import WellnessDashboardPage from './pages/WellnessDashboardPage'
import Priority2FeaturesPage from './pages/Priority2FeaturesPage'
import GamificationPage from './pages/GamificationPage'
import WellnessPlanPage from './pages/WellnessPlanPage'
import SocialHubPage from './pages/SocialHubPage'
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage'
import ProfessionalPage from './pages/ProfessionalPage'
import TechnicalFeaturesPage from './pages/TechnicalFeaturesPage'
import PremiumManagePage from './pages/PremiumManagePage'
import PremiumFeaturesPage from './pages/PremiumFeaturesPage'

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <MigrationStatus />
          <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/circles" element={<CirclesPage />} />
            <Route path="/circles/:circleId" element={<CircleFeedPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/resources" element={<ResourceLibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/premium/success" element={<PremiumSuccessPage />} />
            <Route path="/premium/manage" element={<PremiumManagePage />} />
            <Route path="/premium/features" element={<PremiumFeaturesPage />} />
            <Route path="/tools" element={<TherapeuticToolsPage />} />
            <Route path="/gratitude" element={<GratitudeJournalPage />} />
            <Route path="/habits" element={<HabitTrackerPage />} />
            <Route path="/emotions" element={<EmotionTrackerPage />} />
            <Route path="/coping-skills" element={<CopingSkillsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/wellness" element={<WellnessDashboardPage />} />
            <Route path="/advanced-tools" element={<Priority2FeaturesPage />} />
            <Route path="/gamification" element={<GamificationPage />} />
            <Route path="/wellness-plan" element={<WellnessPlanPage />} />
            <Route path="/social" element={<SocialHubPage />} />
            <Route path="/analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="/professional" element={<ProfessionalPage />} />
            <Route path="/technical" element={<TechnicalFeaturesPage />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App