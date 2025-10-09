import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import ErrorBoundary from './components/ErrorBoundary'
import MigrationStatus from './components/MigrationStatus'
import ProtectedRoute from './components/ProtectedRoute'
import PageLoader from './components/common/PageLoader'
import LiveRegion from './components/common/LiveRegion'
import KeyboardHelpModal from './components/common/KeyboardHelpModal'
import GlobalSearch from './components/GlobalSearch'
import QuickActions from './components/QuickActions'
import OnboardingTour from './components/OnboardingTour'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { initNotifications, requestNotificationPermission } from './utils/notifications'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const CirclesPage = lazy(() => import('./pages/CirclesPage'))
const CircleFeedPage = lazy(() => import('./pages/CircleFeedPage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ResourceLibraryPage = lazy(() => import('./pages/ResourceLibraryPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const PremiumPage = lazy(() => import('./pages/PremiumPage'))
const PremiumSuccessPage = lazy(() => import('./pages/PremiumSuccessPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const TherapeuticToolsPage = lazy(() => import('./pages/TherapeuticToolsPage'))
const GratitudeJournalPage = lazy(() => import('./pages/GratitudeJournalPage'))
const HabitTrackerPage = lazy(() => import('./pages/HabitTrackerPage'))
const EmotionTrackerPage = lazy(() => import('./pages/EmotionTrackerPage'))
const CopingSkillsPage = lazy(() => import('./pages/CopingSkillsPage'))
const RemindersPage = lazy(() => import('./pages/RemindersPage'))
const WellnessDashboardPage = lazy(() => import('./pages/WellnessDashboardPage'))
const Priority2FeaturesPage = lazy(() => import('./pages/Priority2FeaturesPage'))
const GamificationPage = lazy(() => import('./pages/GamificationPage'))
const WellnessPlanPage = lazy(() => import('./pages/WellnessPlanPage'))
const SocialHubPage = lazy(() => import('./pages/SocialHubPage'))
const AdvancedAnalyticsPage = lazy(() => import('./pages/AdvancedAnalyticsPage'))
const ProfessionalPage = lazy(() => import('./pages/ProfessionalPage'))
const TechnicalFeaturesPage = lazy(() => import('./pages/TechnicalFeaturesPage'))
const PremiumManagePage = lazy(() => import('./pages/PremiumManagePage'))
const PremiumFeaturesPage = lazy(() => import('./pages/PremiumFeaturesPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('safespace_onboarding_complete')
    setIsOnboardingComplete(onboardingComplete === 'true')
    
    // Check if tour should be shown
    const tourCompleted = localStorage.getItem('safespace_tour_completed')
    if (onboardingComplete === 'true' && !tourCompleted) {
      setShowTour(true)
    }
    
    // Initialize notifications
    if (onboardingComplete === 'true') {
      requestNotificationPermission()
      initNotifications()
    }
    
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
          {showTour && <OnboardingTour onComplete={() => setShowTour(false)} />}
          <AppContent showKeyboardHelp={showKeyboardHelp} setShowKeyboardHelp={setShowKeyboardHelp} />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

function AppContent({ showKeyboardHelp, setShowKeyboardHelp }) {
  const [showSearch, setShowSearch] = useState(false)
  useKeyboardShortcuts()

  useEffect(() => {
    // Show keyboard help on first visit
    const hasSeenHelp = localStorage.getItem('safespace_seen_keyboard_help')
    if (!hasSeenHelp) {
      setTimeout(() => {
        setShowKeyboardHelp(true)
        localStorage.setItem('safespace_seen_keyboard_help', 'true')
      }, 2000)
    }

    // Listen for keyboard help trigger
    const handleShowHelp = () => setShowKeyboardHelp(true)
    window.addEventListener('showKeyboardHelp', handleShowHelp)
    
    // Listen for global search trigger (Ctrl+K or Cmd+K or /)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('showKeyboardHelp', handleShowHelp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setShowKeyboardHelp])

  return (
    <>
      <LiveRegion />
      <MigrationStatus />
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <QuickActions />
      <KeyboardHelpModal 
        isOpen={showKeyboardHelp} 
        onClose={() => setShowKeyboardHelp(false)} 
      />
      <Suspense fallback={<PageLoader message="Loading page..." />}>
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
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App