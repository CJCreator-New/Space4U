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
    <Box maxW="4xl" mx="auto">
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        position="relative"
        overflow="hidden"
        borderRadius="2xl"
        bgGradient="linear(135deg, primary.500, purple.500, pink.500)"
        p={8}
        mb={6}
        shadow="xl"
      >
        <Box position="absolute" inset={0} bg="blackAlpha.100" />
        <Box position="relative" zIndex={10}>
          <HStack justify="space-between" align="center">
            <HStack gap={4}>
              {user?.avatar && (
                <Avatar
                  size="xl"
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  border="2px solid"
                  borderColor="whiteAlpha.300"
                  shadow="lg"
                  position="relative"
                >
                  {user.avatar}
                  {isPremium && (
                    <Badge
                      position="absolute"
                      top={-1}
                      right={-1}
                      bgGradient="linear(to-r, yellow.400, orange.400)"
                      color="white"
                      borderRadius="full"
                      w={6}
                      h={6}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={Crown} w={3.5} h={3.5} />
                    </Badge>
                  )}
                </Avatar>
              )}
              <Box>
                <Heading
                  size={{ base: "lg", md: "xl" }}
                  color="white"
                  textShadow="lg"
                >
                  {t('welcome.back')}{user?.username ? `, ${user.username}` : ''}! 👋
                </Heading>
                <Text color="whiteAlpha.900" fontSize="lg" mt={1}>
                  {t('home.subtitle')}
                </Text>
              </Box>
            </HStack>
            {isPremium && (
              <HStack
                display={{ base: "none", md: "flex" }}
                gap={2}
                px={4}
                py={2}
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.300"
              >
                <Icon as={Crown} w={5} h={5} color="yellow.300" />
                <Text color="white" fontWeight="medium">
                  {trialActive ? t('premium.trialDaysLeft', { days: daysLeft }) : t('premium.title')}
                </Text>
              </HStack>
            )}
          </HStack>
        </Box>
      </Box>
      
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
      
      {/* Mood Tracking Section - Wrapped in SafeComponent */}
      {showMoodTracker && (
        <SafeComponent>
          <Box mb={6}>
            <MoodTracker onMoodLogged={handleMoodLogged} />
          </Box>
        </SafeComponent>
      )}
      
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

      <SafeComponent>
        <Box mb={6}>
          <AdaptiveDashboard />
        </Box>
      </SafeComponent>
      
      <Box mb={6}>
        <Heading size="lg" mb={4}>{t('home.quickActions')}</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          <MicroInteraction type="lift">
            <Link to="/gratitude" style={{ textDecoration: 'none' }}>
              <Card
                p={6}
                _hover={{ shadow: "xl" }}
                transition="all 0.3s"
                as={motion.div}
                whileHover={{ y: -2 }}
              >
                <HStack gap={3} mb={2}>
                  <Text fontSize="3xl">❤️</Text>
                  <Heading size="md">{t('wellnessTools.gratitude')}</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">{t('wellnessTools.gratitudeDesc')}</Text>
              </Card>
            </Link>
          </MicroInteraction>
          
          <MicroInteraction type="lift">
            <Link to="/habits" style={{ textDecoration: 'none' }}>
              <Card
                p={6}
                _hover={{ shadow: "xl" }}
                transition="all 0.3s"
                as={motion.div}
                whileHover={{ y: -2 }}
              >
                <HStack gap={3} mb={2}>
                  <Text fontSize="3xl">🎯</Text>
                  <Heading size="md">{t('wellnessTools.habits')}</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">{t('wellnessTools.habitsDesc')}</Text>
              </Card>
            </Link>
          </MicroInteraction>
          
          <MicroInteraction type="lift">
            <Link to="/emotions" style={{ textDecoration: 'none' }}>
              <Card
                p={6}
                _hover={{ shadow: "xl" }}
                transition="all 0.3s"
                as={motion.div}
                whileHover={{ y: -2 }}
              >
                <HStack gap={3} mb={2}>
                  <Text fontSize="3xl">💭</Text>
                  <Heading size="md">{t('wellnessTools.emotions')}</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">{t('wellnessTools.emotionsDesc')}</Text>
              </Card>
            </Link>
          </MicroInteraction>
          
          <Link to="/coping-skills" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">🛠️</Text>
                <Heading size="md">{t('wellnessTools.copingSkills')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.copingSkillsDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/reminders" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">⏰</Text>
                <Heading size="md">{t('wellnessTools.reminders')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.remindersDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/tools" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">🧰</Text>
                <Heading size="md">{t('wellnessTools.therapyTools')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.therapyToolsDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/wellness" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">📊</Text>
                <Heading size="md">{t('wellnessTools.wellnessScore')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.wellnessScoreDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/advanced-tools" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">🚀</Text>
                <Heading size="md">{t('wellnessTools.advancedTools')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.advancedToolsDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/gamification" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">🏆</Text>
                <Heading size="md">{t('wellnessTools.gamification')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.gamificationDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/wellness-plan" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">📅</Text>
                <Heading size="md">{t('wellnessTools.wellnessPlan')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.wellnessPlanDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/social" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">🤝</Text>
                <Heading size="md">{t('wellnessTools.socialHub')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.socialHubDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/analytics" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">📊</Text>
                <Heading size="md">{t('wellnessTools.analytics')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.analyticsDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/professional" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">🏥</Text>
                <Heading size="md">{t('wellnessTools.professional')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.professionalDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/technical" style={{ textDecoration: 'none' }}>
            <Card p={6} _hover={{ shadow: "xl" }} transition="all 0.3s">
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">📡</Text>
                <Heading size="md">{t('wellnessTools.technical')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.technicalDesc')}</Text>
            </Card>
          </Link>
          
          <Link to="/premium/features" style={{ textDecoration: 'none' }}>
            <Card
              p={6}
              _hover={{ shadow: "xl" }}
              transition="all 0.3s"
              border="2px solid"
              borderColor="yellow.400"
            >
              <HStack gap={3} mb={2}>
                <Text fontSize="3xl">👑</Text>
                <Heading size="md">{t('wellnessTools.premiumFeatures')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">{t('wellnessTools.premiumFeaturesDesc')}</Text>
            </Card>
          </Link>
        </SimpleGrid>
      </Box>

      {/* FAB Menu for Quick Actions */}
      <FABMenu actions={fabActions} />
    </Box>
  )
}

export default HomePage