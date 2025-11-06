import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useSupabaseAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ReminderProvider } from './contexts/ReminderContext'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from './components/Layout'
import theme from './theme'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import ErrorBoundary from './components/ErrorBoundary'
import LazyLoadErrorBoundary from './components/LazyLoadErrorBoundary'
import MigrationStatus from './components/MigrationStatus'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/common/PageTransition'
import PageLoader from './components/common/PageLoader'
import LiveRegion from './components/common/LiveRegion'
import KeyboardHelpModal from './components/common/KeyboardHelpModal'
import GlobalSearch from './components/GlobalSearch'
import QuickActions from './components/QuickActions'
import OnboardingTour from './components/OnboardingTour'
import SplashScreen from './components/SplashScreen'
import ReminderContainer from './components/common/ReminderContainer'
import ReminderScheduler from './components/common/ReminderScheduler'
import PremiumDay6Banner from './components/PremiumDay6Banner'
import MobileMenu from './components/MobileMenu'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { initNotifications, requestNotificationPermission } from './utils/notifications'
import { safeStorage } from './utils/safeStorage'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const CirclesPage = lazy(() => import('./pages/CirclesPage'))
const CircleFeedPage = lazy(() => import('./pages/CircleFeedPage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ResourceLibraryPage = lazy(() => import('./pages/ResourceLibraryPage'))
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const PremiumPage = lazy(() => import('./pages/PremiumPage'))
const PremiumSuccessPage = lazy(() => import('./pages/PremiumSuccessPage'))
const PremiumManagePage = lazy(() => import('./pages/PremiumManagePage'))
const PremiumFeaturesPage = lazy(() => import('./pages/PremiumFeaturesPage'))
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
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))
const PersonalizationPage = lazy(() => import('./pages/PersonalizationPage'))
const GesturesDemoPage = lazy(() => import('./pages/GesturesDemoPage'))
const VisualDemoPage = lazy(() => import('./pages/VisualDemoPage'))
const NativeDemoPage = lazy(() => import('./pages/NativeDemoPage'))
const PerformanceDemoPage = lazy(() => import('./pages/PerformanceDemoPage'))
const DemoHubPage = lazy(() => import('./pages/DemoHubPage'))

function App() {
  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <ReminderProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <AppContent />
                </BrowserRouter>
              </ReminderProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </ChakraProvider>
    </ErrorBoundary>
  )
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useSupabaseAuth()
  const navigate = useNavigate()
  const location = useLocation()
  useKeyboardShortcuts()

  useEffect(() => {
    if (!loading) {
      if (!user && location.pathname !== '/auth') {
        navigate('/auth', { replace: true })
      } else if (user) {
        const onboardingComplete = safeStorage.getItem(`space4u_onboarding_complete_${user.id}`)
        setIsOnboardingComplete(onboardingComplete === 'true')
        
        const tourCompleted = safeStorage.getItem('space4u_tour_completed')
        if (onboardingComplete === 'true' && !tourCompleted) {
          setShowTour(true)
        }
        
        if (onboardingComplete === 'true') {
          requestNotificationPermission()
          initNotifications()
        }
      }
      setIsLoading(false)
    }
  }, [user, loading, navigate, location])

  const handleOnboardingComplete = () => {
    if (user) {
      safeStorage.setItem(`space4u_onboarding_complete_${user.id}`, 'true')
    }
    setIsOnboardingComplete(true)
  }

  useEffect(() => {
    // Show keyboard help on first visit
    const hasSeenHelp = safeStorage.getItem('space4u_seen_keyboard_help')
    if (!hasSeenHelp) {
      setTimeout(() => {
        setShowKeyboardHelp(true)
        safeStorage.setItem('space4u_seen_keyboard_help', 'true')
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

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  if (loading || isLoading) {
    return <PageLoader message="Loading..." />
  }

  if (user && !isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <>
      <LiveRegion />
      <MigrationStatus />
      <PremiumDay6Banner />
      <MobileMenu />
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      {user && isOnboardingComplete && <QuickActions />}
      <KeyboardHelpModal 
        isOpen={showKeyboardHelp} 
        onClose={() => setShowKeyboardHelp(false)} 
      />
      {showTour && <OnboardingTour onComplete={() => setShowTour(false)} />}
      <ReminderContainer />
      <ReminderScheduler />
      <LazyLoadErrorBoundary>
        <Suspense fallback={<PageLoader message="Loading page..." />}>
          <PageTransition>
            <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/circles" element={<CirclesPage />} />
              <Route path="/circles/:circleId" element={<CircleFeedPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/resources" element={<ResourceLibraryPage />} />
              <Route path="/resources/:id" element={<ResourceDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
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
              <Route path="/personalization" element={<PersonalizationPage />} />
              <Route path="/demo/gestures" element={<GesturesDemoPage />} />
              <Route path="/demo/visual" element={<VisualDemoPage />} />
              <Route path="/demo/native" element={<NativeDemoPage />} />
              <Route path="/demo/performance" element={<PerformanceDemoPage />} />
              <Route path="/demo" element={<DemoHubPage />} />
            </Route>
          </Routes>
          </PageTransition>
        </Suspense>
      </LazyLoadErrorBoundary>
    </>
  )
}

export default App
