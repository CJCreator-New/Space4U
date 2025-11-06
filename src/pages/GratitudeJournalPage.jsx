import { useState, useEffect } from 'react'
import { Heart, Plus, Calendar, TrendingUp, Sparkles, Info, BookOpen, Crown, Lock, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import GratitudeEntryModal from '../components/gratitude/GratitudeEntryModal'
import GratitudeCard from '../components/gratitude/GratitudeCard'
import GratitudeAnalytics from '../components/gratitude/GratitudeAnalytics'
import StreakDisplay from '../components/gratitude/StreakDisplay'
import GratitudeChallenges from '../components/gratitude/GratitudeChallenges'
import SafeComponent from '../components/SafeComponent'
import WeeklySummary from '../components/gratitude/WeeklySummary'
import GratitudeStats from '../components/gratitude/GratitudeStats'
import { getPremiumStatus } from '../utils/premiumUtils'
import { useNavigate } from 'react-router-dom'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ResearchCard from '../components/wellness/ResearchCard'
import CrisisResources from '../components/wellness/CrisisResources'
import { disclaimers } from '../data/disclaimers'
import { researchCitations } from '../data/researchCitations'
import EnhancedPrompts from '../components/gratitude/EnhancedPrompts'
import { trackEvent, EVENTS, trackPageView } from '../utils/analytics'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Grid,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionDiv = motion.div

function GratitudeJournalPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [dailyPrompt, setDailyPrompt] = useState('')
  const { isPremium } = getPremiumStatus()
  
  const FREE_ENTRY_LIMIT = 10

  useEffect(() => {
    loadEntries()
  }, [user])

  useEffect(() => {
    // Track page view only once on mount
    trackPageView('gratitude_journal')
  }, [])

  const loadEntries = async () => {
    const { getGratitudeEntries } = await import('../utils/storageHelpers')
    const entries = await getGratitudeEntries()
    setEntries(entries)
    calculateStreak(entries)
  }

  const calculateStreak = (entries) => {
    if (!entries.length) {
      setStreak(0)
      setLongestStreak(0)
      return
    }
    
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    let current = 0
    let longest = 0
    let tempStreak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === current) {
        current++
        tempStreak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else break
    }
    
    // Calculate longest streak
    const dates = sorted.map(e => new Date(e.date).setHours(0, 0, 0, 0))
    let maxStreak = 0
    let currentStreak = 1
    
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }
    
    setStreak(tempStreak)
    setLongestStreak(Math.max(maxStreak, tempStreak))
  }

  const handleSave = async (entry) => {
    const { getGratitudeEntries, saveGratitudeEntries } = await import('../utils/storageHelpers')
    const saved = await getGratitudeEntries()
    const existing = saved.findIndex(e => e.date === entry.date)
    
    if (!isPremium && existing < 0 && saved.length >= FREE_ENTRY_LIMIT) {
      return
    }
    
    if (existing >= 0) saved[existing] = entry
    else saved.unshift(entry)
    
    await saveGratitudeEntries(saved)
    trackEvent(EVENTS.FEATURE_USED, { feature: 'gratitude_entry_saved', isNew: existing < 0 })
    loadEntries()
    setShowModal(false)
    setSelectedEntry(null)
  }
  
  const handleAddClick = () => {
    if (!isPremium && entries.length >= FREE_ENTRY_LIMIT && !todayEntry) {
      navigate('/premium')
      return
    }
    setShowModal(true)
  }

  const handleEdit = (entry) => {
    setSelectedEntry(entry)
    setShowModal(true)
  }

  const handleDelete = async (date) => {
    const { getGratitudeEntries, saveGratitudeEntries } = await import('../utils/storageHelpers')
    const saved = await getGratitudeEntries()
    const filtered = saved.filter(e => e.date !== date)
    await saveGratitudeEntries(filtered)
    loadEntries()
  }

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0])

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <SafeComponent>
      <Container maxW="6xl" py={8}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Disclaimer */}
          <Box mb={6}>
            <DisclaimerBanner disclaimer={disclaimers.gratitude} />
          </Box>

          {/* Research Support */}
          <Box mb={6}>
            <ResearchCard citations={researchCitations.gratitude} title="Why Gratitude Works" />
          </Box>

          <VStack spacing={8} align="stretch">
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <HStack spacing={3}>
                <Icon as={Heart} w={8} h={8} color="pink.500" />
                <Box>
                  <Heading size="xl">{t('gratitude.title')}</Heading>
                  <Text color="gray.600">{t('gratitude.subtitle')}</Text>
                </Box>
              </HStack>
              <Button
                leftIcon={<Plus />}
                colorScheme="pink"
                size="lg"
                onClick={handleAddClick}
                _hover={{ transform: 'scale(1.05)' }}
                transition="all 0.2s"
              >
                {todayEntry ? t('gratitude.editToday') : t('gratitude.addEntry')}
              </Button>
            </Flex>

            {!isPremium && entries.length >= FREE_ENTRY_LIMIT && (
              <Alert status="warning" borderRadius="xl">
                <AlertIcon />
                <Box flex="1">
                  <AlertTitle>{t('gratitude.limitReached')}</AlertTitle>
                  <AlertDescription>{t('gratitude.limitMessage', { limit: FREE_ENTRY_LIMIT })}</AlertDescription>
                </Box>
                <Button
                  leftIcon={<Crown />}
                  colorScheme="orange"
                  size="sm"
                  onClick={() => navigate('/premium')}
                  ml={4}
                >
                  {t('premium.upgrade')}
                </Button>
              </Alert>
            )}

            {/* Enhanced Prompts */}
            <Card bg="gradient-to-br from-purple-50 to-pink-50" borderWidth={1} borderColor="purple.200" borderRadius="xl" shadow="lg">
              <CardBody>
                <EnhancedPrompts
                  onPromptSelect={setDailyPrompt}
                  currentPrompt={dailyPrompt}
                />
              </CardBody>
            </Card>

            {/* Streak Display */}
            <Box mb={6}>
              <StreakDisplay current={streak} longest={longestStreak} />
            </Box>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                <CardBody>
                  <HStack spacing={3} mb={2}>
                    <Icon as={Sparkles} w={5} h={5} color="yellow.500" />
                    <Text color="gray.600">{t('gratitude currentStreak')}</Text>
                  </HStack>
                  <Heading size="2xl" color="yellow.500">{streak}</Heading>
                  <Text fontSize="sm" color="gray.500">{t('gratitude days')}</Text>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                <CardBody>
                  <HStack spacing={3} mb={2}>
                    <Icon as={Calendar} w={5} h={5} color="blue.500" />
                    <Text color="gray.600">{t('gratitude totalEntries')}</Text>
                  </HStack>
                  <Heading size="2xl" color="blue.500">{entries.length}</Heading>
                  <Text fontSize="sm" color="gray.500">{t('gratitude entries')}</Text>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                <CardBody>
                  <HStack spacing={3} mb={2}>
                    <Icon as={TrendingUp} w={5} h={5} color="green.500" />
                    <Text color="gray.600">{t('gratitude weeklyGoal')}</Text>
                  </HStack>
                  <Heading size="2xl" color="green.500">
                    {Math.min(7, entries.filter(e => {
                      const entryDate = new Date(e.date)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return entryDate >= weekAgo
                    }).length)}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">/7 {t('gratitude.thisWeek')}</Text>
                </CardBody>
              </Card>
            </Grid>

            <VStack spacing={4} align="stretch">
              <Heading size="lg">{t('gratitude recentEntries')}</Heading>
              {entries.length === 0 ? (
                <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                  <CardBody textAlign="center" py={12}>
                    <Icon as={BookOpen} w={12} h={12} color="gray.400" mb={4} />
                    <Heading size="md" color="gray.500" mb={2}>{t('gratitude noEntries')}</Heading>
                    <Text color="gray.600" mb={4}>{t('gratitude.startJourney')}</Text>
                    <Button
                      leftIcon={<Plus />}
                      colorScheme="pink"
                      onClick={handleAddClick}
                      size="lg"
                    >
                      {t('gratitude.addFirstEntry')}
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <VStack spacing={4} align="stretch">
                  {entries.slice(0, 5).map((entry, index) => (
                    <MotionDiv
                      key={entry.date || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GratitudeCard
                        entry={entry}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isPremium={isPremium}
                      />
                    </MotionDiv>
                  ))}
                </VStack>
              )}
            </VStack>

            {entries.length > 0 && (
              <>
                <Box>
                  <GratitudeChallenges entries={entries} />
                </Box>
                <Box>
                  <GratitudeAnalytics entries={entries} />
                </Box>
                <Box>
                  <WeeklySummary entries={Object.fromEntries(entries.map(e => [e.date, e]))} />
                </Box>
                <Box>
                  <GratitudeStats entries={entries} />
                </Box>
              </>
            )}
          </VStack>
        </motion.div>

        <GratitudeEntryModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedEntry(null)
          }}
          onSave={handleSave}
          entry={selectedEntry}
          isPremium={isPremium}
        />
      </Container>
    </SafeComponent>
  )
}

export default GratitudeJournalPage

