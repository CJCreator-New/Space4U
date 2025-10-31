import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Crown, Sparkles, Smile, Heart, BookOpen } from 'lucide-react'
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import MoodTracker from '../components/MoodTracker'
import MoodCalendar from '../components/MoodCalendar'
import MoodTrends from '../components/MoodTrends'
import SafeComponent from '../components/SafeComponent'
import AdaptiveDashboard from '../components/personalization/AdaptiveDashboard'
import FABMenu from '../components/common/FABMenu'
import MicroInteraction from '../components/common/MicroInteraction'
import NotificationTestPanel from '../components/NotificationTestPanel'
import DashboardWidgets from '../components/dashboard/DashboardWidgets'
import HeroSection from '../components/home/HeroSection'
import QuickMoodCheckIn from '../components/home/QuickMoodCheckIn'
import DailyTipWidget from '../components/home/DailyTipWidget'
import TrendingContent from '../components/home/TrendingContent'
import AnnouncementBanner from '../components/home/AnnouncementBanner'
import WelcomeBanner from '../components/home/WelcomeBanner'
import MoodTimeline from '../components/home/MoodTimeline'
import OnboardingTip from '../components/common/OnboardingTip'
import NavigationMap from '../components/common/NavigationMap'
import { getPremiumStatus } from '../utils/premiumUtils'
import { initPersonalization } from '../utils/personalizationEngine'
import { trackFeatureUsage } from '../utils/usageTracker'
import { trackEvent, EVENTS, trackPageView } from '../utils/analytics'

function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState(null)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const [showNavMap, setShowNavMap] = useState(false)
  const { isPremium, trialActive, daysLeft } = getPremiumStatus()

  useEffect(() => {
    try {
      const userData = localStorage.getItem('space4u_user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
      initPersonalization()
      trackPageView('home')
    } catch (err) {
      console.error('Error loading user data:', err)
      setError(t('errors.failedToLoad'))
    }
  }, [])

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
      label: t('gratitude.title'),
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
            whileHover={{ y: -4, shadow: 'xl' }}
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
            whileHover={{ y: -4, shadow: 'xl' }}
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
            whileHover={{ y: -4, shadow: 'xl' }}
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
      
      <Box mb={6}>
        <DashboardWidgets />
      </Box>
      
      <SafeComponent>
        <Box mb={6}>
          <MoodCalendar key={refreshKey} />
        </Box>
      </SafeComponent>
      
      <SafeComponent>
        <Box mb={6}>
          <MoodTrends key={refreshKey} />
        </Box>
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
            { path: '/wellness', emoji: 'ðŸ“Š', key: 'wellnessScore' },
            { path: '/gamification', emoji: 'ðŸ†', key: 'gamification' },
            { path: '/social', emoji: 'ðŸ’¬', key: 'socialHub' },
            { path: '/analytics', emoji: 'ðŸ“ˆ', key: 'analytics' },
          ].map(({ path, emoji, key }) => (
            <Link key={path} to={path} style={{ textDecoration: 'none' }}>
              <Card
                as={motion.div}
                whileHover={{ y: -2, shadow: 'md' }}
                p={4}
                transition="all 0.2s"
                cursor="pointer"
              >
                <VStack gap={2}>
                  <Text fontSize="2xl">{emoji}</Text>
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
