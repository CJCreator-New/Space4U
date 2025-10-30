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
import OnboardingTip from '../components/common/OnboardingTip'
import NavigationMap from '../components/common/NavigationMap'
import { getPremiumStatus } from '../utils/premiumUtils'
import { initPersonalization } from '../utils/personalizationEngine'
import { trackFeatureUsage } from '../utils/usageTracker'

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
      const userData = localStorage.getItem('safespace_user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
      initPersonalization()
      trackFeatureUsage('home', 0)
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
      onClick: () => setShowMoodTracker(true),
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
      
      <HeroSection user={user} />
      
      <AnnouncementBanner />
      
      {!isPremium && (
        <Link to="/premium" style={{ textDecoration: 'none' }}>
          <Card
            as={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            mb={6}
            bgGradient="linear(to-r, yellow.50, orange.50)"
            border="2px solid"
            borderColor="yellow.300"
            _hover={{ shadow: "xl" }}
            transition="all 0.3s"
          >
            <CardBody>
              <HStack justify="space-between" align="center">
                <HStack gap={4}>
                  <Box
                    w={12}
                    h={12}
                    bgGradient="linear(to-r, yellow.400, orange.400)"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={Crown} color="white" boxSize={6} />
                  </Box>
                  <Box>
                    <Heading size="md" color="gray.900">
                      {t('premium.upgrade')}
                    </Heading>
                    <Text fontSize="sm" color="gray.700">
                      {t('premium.unlockUnlimited')}
                    </Text>
                  </Box>
                </HStack>
                <Icon as={Sparkles} color="yellow.500" boxSize={6} />
              </HStack>
            </CardBody>
          </Card>
        </Link>
      )}
      
      <QuickMoodCheckIn />
      
      <Box mb={6}>
        <DailyTipWidget />
      </Box>
      
      <TrendingContent />
      
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
      
      <Box mb={6} as="section" aria-label="Wellness tools">
        <Heading size="lg" mb={4}>{t('home.quickActions')}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {[
            { path: '/circles', emoji: '🤝', key: 'circles' },
            { path: '/resources', emoji: '📚', key: 'resources' },
            { path: '/wellness', emoji: '📊', key: 'wellnessScore' },
            { path: '/gamification', emoji: '🏆', key: 'gamification' },
            { path: '/social', emoji: '💬', key: 'socialHub' },
            { path: '/analytics', emoji: '📈', key: 'analytics' },
          ].map(({ path, emoji, key }) => (
            <Link key={path} to={path} style={{ textDecoration: 'none' }}>
              <Card
                as={motion.div}
                whileHover={{ y: -4, shadow: 'xl' }}
                p={6}
                transition="all 0.3s"
                cursor="pointer"
              >
                <HStack gap={3} mb={2}>
                  <Text fontSize="3xl">{emoji}</Text>
                  <Heading size="md">{t(`wellnessTools.${key}`)}</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">{t(`wellnessTools.${key}Desc`)}</Text>
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