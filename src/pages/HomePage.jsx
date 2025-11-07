import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Crown, Sparkles, Smile, Heart, BookOpen, BarChart, Trophy, MessageCircle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Avatar,
  Badge,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Skeleton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import MoodTracker from '../components/MoodTracker'
import SafeComponent from '../components/SafeComponent'
import FABMenu from '../components/common/FABMenu'
import MicroInteraction from '../components/common/MicroInteraction'
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
  <Box mb={6}>
    <Skeleton height="200px" borderRadius="xl" />
  </Box>
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
      <Box maxW="4xl" mx="auto" p={4}>
        <Card bg="red.50" borderColor="red.200" borderWidth={1} borderRadius="xl" p={6} textAlign="center">
          <Text color="red.600" mb={4}>{error}</Text>
          <Button colorScheme="red" onClick={() => window.location.reload()}>
            {t('errors.reloadPage')}
          </Button>
        </Card>
      </Box>
    )
  }

  return (
    <Box maxW="4xl" mx="auto" as="main" role="main" aria-label="Home page">
      <OnboardingTip page="home" />
      <NavigationMap isOpen={showNavMap} onClose={() => setShowNavMap(false)} />
      
      <WelcomeBanner />
      
      {/* Core Actions Section */}
      <Box mb={8}>
        <Heading size="lg" mb={4} color="gray.900">Start Your Day</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Card
            as={motion.div}
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            p={6}
            bg="gradient-to-br from-blue-50 to-indigo-50"
            borderLeft="4px solid"
            borderColor="blue.500"
            cursor="pointer"
            onClick={() => {
              trackEvent(EVENTS.MOOD_LOG_OPENED, { source: 'core_action_card' })
              setShowMoodTracker(true)
            }}
          >
            <VStack align="start" gap={3}>
              <Box p={3} bg="blue.500" borderRadius="xl">
                <Icon as={Smile} color="white" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" mb={1}>Log Your Mood</Heading>
                <Text fontSize="sm" color="gray.600">Track how you're feeling today</Text>
              </Box>
              <Button colorScheme="blue" size="sm" rightIcon={<Sparkles size={16} />}>
                Check In Now
              </Button>
            </VStack>
          </Card>

          <Card
            as={motion.div}
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            p={6}
            bg="gradient-to-br from-purple-50 to-pink-50"
            borderLeft="4px solid"
            borderColor="purple.500"
            cursor="pointer"
            onClick={() => {
              trackEvent(EVENTS.CIRCLE_RECOMMENDATION_VIEWED, { source: 'core_action_card' })
              navigate('/circles')
            }}
          >
            <VStack align="start" gap={3}>
              <Box p={3} bg="purple.500" borderRadius="xl">
                <Icon as={Heart} color="white" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" mb={1}>Join a Circle</Heading>
                <Text fontSize="sm" color="gray.600">Connect with supportive communities</Text>
              </Box>
              <Button colorScheme="purple" size="sm" rightIcon={<Sparkles size={16} />}>
                Discover
              </Button>
            </VStack>
          </Card>

          <Card
            as={motion.div}
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            p={6}
            bg="gradient-to-br from-green-50 to-emerald-50"
            borderLeft="4px solid"
            borderColor="green.500"
            cursor="pointer"
            onClick={() => {
              trackEvent(EVENTS.TOOL_LIST_OPENED, { source: 'core_action_card' })
              navigate('/resources')
            }}
          >
            <VStack align="start" gap={3}>
              <Box p={3} bg="green.500" borderRadius="xl">
                <Icon as={BookOpen} color="white" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" mb={1}>Explore Tools</Heading>
                <Text fontSize="sm" color="gray.600">Access wellness resources</Text>
              </Box>
              <Button colorScheme="green" size="sm" rightIcon={<Sparkles size={16} />}>
                Browse
              </Button>
            </VStack>
          </Card>
        </SimpleGrid>
      </Box>

      <QuickMoodCheckIn onMoodLogged={() => {
        trackEvent(EVENTS.MOOD_LOG_SUBMITTED, { source: 'quick_checkin' })
        setRefreshKey(prev => prev + 1)
      }} />
      
      <Box mb={6}>
        <MoodTimeline key={refreshKey} />
      </Box>
      
      <Box mb={6}>
        <DailyTipWidget />
      </Box>
      
      <Suspense fallback={<LoadingFallback />}>
        <Box mb={6}>
          <DashboardWidgets />
        </Box>
      </Suspense>
      
      <SafeComponent>
        <Suspense fallback={<LoadingFallback />}>
          <Box mb={6}>
            <MoodCalendar key={refreshKey} />
          </Box>
        </Suspense>
      </SafeComponent>
      
      <SafeComponent>
        <Suspense fallback={<LoadingFallback />}>
          <Box mb={6}>
            <MoodTrends key={refreshKey} />
          </Box>
        </Suspense>
      </SafeComponent>
      
      {/* Collapsible Wellness Tools */}
      <Box mb={6} as="section" aria-label="Wellness tools">
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">{t('home.quickActions')}</Heading>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/wellness')}
            rightIcon={<Sparkles size={16} />}
          >
            View All
          </Button>
        </HStack>
        <SimpleGrid columns={{ base: 2, md: 3 }} gap={3}>
          {[
            { path: '/wellness', icon: BarChart, key: 'wellnessScore', color: 'blue.500' },
            { path: '/gamification', icon: Trophy, key: 'gamification', color: 'yellow.500' },
            { path: '/social', icon: MessageCircle, key: 'socialHub', color: 'purple.500' },
            { path: '/analytics', icon: TrendingUp, key: 'analytics', color: 'green.500' },
          ].map(({ path, icon: IconComponent, key, color }) => (
            <Link key={path} to={path} style={{ textDecoration: 'none' }}>
              <Card
                as={motion.div}
                whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                p={4}
                transition="all 0.2s"
                cursor="pointer"
              >
                <VStack gap={2}>
                  <Icon as={IconComponent} boxSize={8} color={color} />
                  <Text fontSize="sm" fontWeight="medium" textAlign="center">
                    {t(`wellnessTools.${key}`)}
                  </Text>
                </VStack>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Box>

      <FABMenu actions={fabActions} />
    </Box>
  )
}

export default HomePage
