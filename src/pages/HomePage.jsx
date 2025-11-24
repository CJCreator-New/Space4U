import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Crown, Sparkles, Smile, Heart, BookOpen, BarChart, Trophy, MessageCircle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import MoodTracker from '../components/MoodTracker'
import SafeComponent from '../components/SafeComponent'
import FABMenu from '../components/common/FABMenu'
import QuickMoodCheckIn from '../components/home/QuickMoodCheckIn'
import DailyTipWidget from '../components/home/DailyTipWidget'
import WelcomeBanner from '../components/home/WelcomeBanner'
import MoodTimeline from '../components/home/MoodTimeline'
import OnboardingTip from '../components/common/OnboardingTip'
import NavigationMap from '../components/common/NavigationMap'
import { getPremiumStatus } from '../utils/premiumUtils'
import { initPersonalization } from '../utils/personalizationEngine'
import { trackFeatureUsage } from '../utils/usageTracker'
import { trackEvent, EVENTS, trackPageView } from '../utils/analytics'

// Lazy load heavy components
const MoodCalendar = lazy(() => import('../components/MoodCalendar'))
const MoodTrends = lazy(() => import('../components/MoodTrends'))
const DashboardWidgets = lazy(() => import('../components/dashboard/DashboardWidgets'))
const AdaptiveDashboard = lazy(() => import('../components/personalization/AdaptiveDashboard'))

const LoadingFallback = () => (
  <div className="mb-6">
    <div className="h-[200px] w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
  </div>
)

function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState(null)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const [showNavMap, setShowNavMap] = useState(false)
  const { isPremium, trialActive, daysLeft } = getPremiumStatus()

  // Memoize user data
  const userData = useMemo(() => {
    try {
      const data = localStorage.getItem('space4u_user')
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    try {
      setUser(userData)
      initPersonalization()
      trackPageView('home')
    } catch (err) {
      console.error('Error loading user data:', err)
      setError(t('errors.failedToLoad'))
    }
  }, [userData])

  const handleMoodLogged = () => {
    try {
      setRefreshKey(prev => prev + 1)
      setShowMoodTracker(false)
    } catch (err) {
      console.error('Error refreshing mood data:', err)
    }
  }

  const fabActions = [
    {
      icon: <Smile size={20} />,
      label: t('mood.logMood'),
      onClick: () => {
        trackEvent(EVENTS.MOOD_LOG_OPENED, { source: 'fab' })
        setShowMoodTracker(true)
      },
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: <Heart size={20} />,
      label: t('gratitude title'),
      onClick: () => navigate('/gratitude'),
      color: 'from-pink-500 to-red-600'
    },
    {
      icon: <BookOpen size={20} />,
      label: t('home.journal'),
      onClick: () => navigate('/advanced-tools'),
      color: 'from-blue-500 to-cyan-600'
    }
  ]

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {t('errors.reloadPage')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto" role="main" aria-label="Home page">
      <OnboardingTip page="home" />
      <NavigationMap isOpen={showNavMap} onClose={() => setShowNavMap(false)} />

      <WelcomeBanner />

      {/* Core Actions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Start Your Day</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-xl cursor-pointer shadow-sm"
            onClick={() => {
              trackEvent(EVENTS.MOOD_LOG_OPENED, { source: 'core_action_card' })
              setShowMoodTracker(true)
            }}
          >
            <div className="flex flex-col items-start gap-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Smile className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Log Your Mood</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Track how you're feeling today</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                Check In Now
                <Sparkles size={16} />
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500 rounded-xl cursor-pointer shadow-sm"
            onClick={() => {
              trackEvent(EVENTS.CIRCLE_RECOMMENDATION_VIEWED, { source: 'core_action_card' })
              navigate('/circles')
            }}
          >
            <div className="flex flex-col items-start gap-3">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Join a Circle</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Connect with supportive communities</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors">
                Discover
                <Sparkles size={16} />
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 rounded-xl cursor-pointer shadow-sm"
            onClick={() => {
              trackEvent(EVENTS.TOOL_LIST_OPENED, { source: 'core_action_card' })
              navigate('/resources')
            }}
          >
            <div className="flex flex-col items-start gap-3">
              <div className="p-3 bg-green-500 rounded-xl">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Explore Tools</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Access wellness resources</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
                Browse
                <Sparkles size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <QuickMoodCheckIn onMoodLogged={() => {
        trackEvent(EVENTS.MOOD_LOG_SUBMITTED, { source: 'quick_checkin' })
        setRefreshKey(prev => prev + 1)
      }} />

      <div className="mb-6">
        <MoodTimeline key={refreshKey} />
      </div>

      <div className="mb-6">
        <DailyTipWidget />
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <div className="mb-6">
          <DashboardWidgets />
        </div>
      </Suspense>

      <SafeComponent>
        <Suspense fallback={<LoadingFallback />}>
          <div className="mb-6">
            <MoodCalendar key={refreshKey} />
          </div>
        </Suspense>
      </SafeComponent>

      <SafeComponent>
        <Suspense fallback={<LoadingFallback />}>
          <div className="mb-6">
            <MoodTrends key={refreshKey} />
          </div>
        </Suspense>
      </SafeComponent>

      {/* Collapsible Wellness Tools */}
      <section className="mb-6" aria-label="Wellness tools">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.quickActions')}</h2>
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            View All
            <Sparkles size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { path: '/wellness', icon: BarChart, key: 'wellnessScore', color: 'text-blue-500' },
            { path: '/gamification', icon: Trophy, key: 'gamification', color: 'text-yellow-500' },
            { path: '/social', icon: MessageCircle, key: 'socialHub', color: 'text-purple-500' },
            { path: '/analytics', icon: TrendingUp, key: 'analytics', color: 'text-green-500' },
          ].map(({ path, icon: IconComponent, key, color }) => (
            <Link key={path} to={path} className="no-underline block">
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer shadow-sm transition-all"
              >
                <div className="flex flex-col items-center gap-2">
                  <IconComponent size={32} className={color} />
                  <p className="text-sm font-medium text-center text-gray-900 dark:text-white">
                    {t(`wellnessTools.${key}`)}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <FABMenu actions={fabActions} />

      {showMoodTracker && (
        <MoodTracker
          isOpen={showMoodTracker}
          onClose={() => setShowMoodTracker(false)}
          onSave={handleMoodLogged}
        />
      )}
    </div>
  )
}

export default HomePage
