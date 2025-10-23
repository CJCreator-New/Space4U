import { useState, useEffect } from 'react'
import { Heart, Plus, Calendar, TrendingUp, Sparkles, Info, BookOpen, Crown, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import GratitudeEntryModal from '../components/gratitude/GratitudeEntryModal'
import GratitudeCard from '../components/gratitude/GratitudeCard'
import GratitudeStats from '../components/gratitude/GratitudeStats'
import SafeComponent from '../components/SafeComponent'
import { getPremiumStatus } from '../utils/premiumUtils'
import { useNavigate } from 'react-router-dom'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ResearchCard from '../components/wellness/ResearchCard'
import CrisisResources from '../components/wellness/CrisisResources'
import { disclaimers } from '../data/disclaimers'
import { researchCitations } from '../data/researchCitations'
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

function GratitudeJournalPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [streak, setStreak] = useState(0)
  const { isPremium } = getPremiumStatus()
  
  const FREE_ENTRY_LIMIT = 10

  useEffect(() => {
    loadEntries()
  }, [user])

  const loadEntries = () => {
    const saved = localStorage.getItem('safespace_gratitude_entries')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed)
      calculateStreak(parsed)
    }
  }

  const calculateStreak = (entries) => {
    if (!entries.length) return setStreak(0)
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    let count = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === count) {
        count++
        currentDate.setDate(currentDate.getDate() - 1)
      } else break
    }
    setStreak(count)
  }

  const handleSave = (entry) => {
    const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const existing = saved.findIndex(e => e.date === entry.date)
    
    if (!isPremium && existing < 0 && saved.length >= FREE_ENTRY_LIMIT) {
      return
    }
    
    if (existing >= 0) saved[existing] = entry
    else saved.unshift(entry)
    
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(saved))
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

  const handleDelete = (date) => {
    const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const filtered = saved.filter(e => e.date !== date)
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(filtered))
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

            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                <CardBody>
                  <HStack spacing={3} mb={2}>
                    <Icon as={Sparkles} w={5} h={5} color="yellow.500" />
                    <Text color="gray.600">{t('gratitude.currentStreak')}</Text>
                  </HStack>
                  <Heading size="2xl" color="yellow.500">{streak}</Heading>
                  <Text fontSize="sm" color="gray.500">{t('gratitude.days')}</Text>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                <CardBody>
                  <HStack spacing={3} mb={2}>
                    <Icon as={Calendar} w={5} h={5} color="blue.500" />
                    <Text color="gray.600">{t('gratitude.totalEntries')}</Text>
                  </HStack>
                  <Heading size="2xl" color="blue.500">{entries.length}</Heading>
                  <Text fontSize="sm" color="gray.500">{t('gratitude.entries')}</Text>
                </CardBody>
              </Card>

              <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                <CardBody>
                  <HStack spacing={3} mb={2}>
                    <Icon as={TrendingUp} w={5} h={5} color="green.500" />
                    <Text color="gray.600">{t('gratitude.weeklyGoal')}</Text>
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
              <Heading size="lg">{t('gratitude.recentEntries')}</Heading>
              {entries.length === 0 ? (
                <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
                  <CardBody textAlign="center" py={12}>
                    <Icon as={BookOpen} w={12} h={12} color="gray.400" mb={4} />
                    <Heading size="md" color="gray.500" mb={2}>{t('gratitude.noEntries')}</Heading>
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
                    <motion.div
                      key={entry.date}
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
                    </motion.div>
                  ))}
                </VStack>
              )}
            </VStack>

            {entries.length > 0 && (
              <Box>
                <GratitudeStats entries={entries} />
              </Box>
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
