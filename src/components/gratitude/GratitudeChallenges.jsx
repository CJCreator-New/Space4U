import { useState, useEffect } from 'react'
import { Trophy, Target, Calendar, CheckCircle, Circle, Flame } from 'lucide-react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Progress,
  Badge,
  Wrap,
  WrapItem,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const GRATITUDE_CHALLENGES = [
  {
    id: 'seven_days',
    title: '7-Day Gratitude Streak',
    description: 'Write gratitude entries for 7 consecutive days',
    target: 7,
    reward: 'Consistency Champion',
    icon: Flame,
    color: 'orange'
  },
  {
    id: 'three_entries',
    title: 'Triple Gratitude',
    description: 'Write 3 gratitude items in a single entry',
    target: 1,
    reward: 'Detail Master',
    icon: Target,
    color: 'blue'
  },
  {
    id: 'monthly_master',
    title: 'Monthly Master',
    description: 'Complete 30 gratitude entries in a month',
    target: 30,
    reward: 'Monthly Champion',
    icon: Calendar,
    color: 'green'
  },
  {
    id: 'category_explorer',
    title: 'Category Explorer',
    description: 'Use 5 different gratitude categories',
    target: 5,
    reward: 'Explorer Badge',
    icon: Trophy,
    color: 'purple'
  },
  {
    id: 'reflection_pro',
    title: 'Reflection Pro',
    description: 'Add notes/reflections to 10 entries',
    target: 10,
    reward: 'Reflection Expert',
    icon: CheckCircle,
    color: 'pink'
  }
]

function GratitudeChallenges({ entries }) {
  const [completedChallenges, setCompletedChallenges] = useState([])
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    calculateProgress()
  }, [entries])

  const calculateProgress = () => {
    const completed = []

    // 7-Day Streak Challenge
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    let currentStreak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))

      if (diffDays === currentStreak) {
        currentStreak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else break
    }

    if (currentStreak >= 7) {
      completed.push('seven_days')
    }

    // Triple Gratitude Challenge
    const hasTripleEntry = entries.some(entry => entry.items && entry.items.length >= 3)
    if (hasTripleEntry) {
      completed.push('three_entries')
    }

    // Monthly Master Challenge
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear
    })
    if (monthlyEntries.length >= 30) {
      completed.push('monthly_master')
    }

    // Category Explorer Challenge
    const allCategories = new Set()
    entries.forEach(entry => {
      if (entry.categories) {
        entry.categories.forEach(cat => allCategories.add(cat))
      }
    })
    if (allCategories.size >= 5) {
      completed.push('category_explorer')
    }

    // Reflection Pro Challenge
    const entriesWithNotes = entries.filter(entry => entry.notes && entry.notes.trim())
    if (entriesWithNotes.length >= 10) {
      completed.push('reflection_pro')
    }

    setCompletedChallenges(completed)
  }

  const getChallengeProgress = (challenge) => {
    switch (challenge.id) {
      case 'seven_days':
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
        let streak = 0
        let date = new Date()
        date.setHours(0, 0, 0, 0)

        for (const entry of sortedEntries) {
          const entryDate = new Date(entry.date)
          entryDate.setHours(0, 0, 0, 0)
          const diffDays = Math.floor((date - entryDate) / (1000 * 60 * 60 * 24))

          if (diffDays === streak) {
            streak++
            date.setDate(date.getDate() - 1)
          } else break
        }
        return Math.min(streak, challenge.target)

      case 'three_entries':
        return entries.some(entry => entry.items && entry.items.length >= 3) ? challenge.target : 0

      case 'monthly_master':
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyCount = entries.filter(entry => {
          const entryDate = new Date(entry.date)
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear
        }).length
        return Math.min(monthlyCount, challenge.target)

      case 'category_explorer':
        const categories = new Set()
        entries.forEach(entry => {
          if (entry.categories) {
            entry.categories.forEach(cat => categories.add(cat))
          }
        })
        return Math.min(categories.size, challenge.target)

      case 'reflection_pro':
        const notesCount = entries.filter(entry => entry.notes && entry.notes.trim()).length
        return Math.min(notesCount, challenge.target)

      default:
        return 0
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={2}>
        <Trophy size={20} color="gold" />
        <Text fontWeight="semibold" fontSize="lg">Gratitude Challenges</Text>
      </HStack>

      <Wrap spacing={4}>
        {GRATITUDE_CHALLENGES.map((challenge) => {
          const IconComponent = challenge.icon
          const progress = getChallengeProgress(challenge)
          const isCompleted = completedChallenges.includes(challenge.id)
          const progressPercent = (progress / challenge.target) * 100

          return (
            <WrapItem key={challenge.id} flexBasis={{ base: '100%', md: '48%', lg: '32%' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Card
                  bg={isCompleted ? `${challenge.color}.50` : bgColor}
                  borderColor={isCompleted ? `${challenge.color}.300` : borderColor}
                  borderWidth={2}
                  borderRadius="xl"
                  shadow="lg"
                  h="full"
                >
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between" align="start">
                        <IconComponent
                          size={24}
                          color={isCompleted ? 'green' : challenge.color}
                        />
                        {isCompleted && (
                          <Badge colorScheme="green" borderRadius="full">
                            ✓ Completed
                          </Badge>
                        )}
                      </HStack>

                      <Box>
                        <Text fontWeight="semibold" fontSize="md" mb={1}>
                          {challenge.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          {challenge.description}
                        </Text>
                      </Box>

                      <Box>
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="sm" color="gray.600">
                            Progress: {progress}/{challenge.target}
                          </Text>
                          <Text fontSize="sm" fontWeight="semibold" color={`${challenge.color}.600`}>
                            {Math.round(progressPercent)}%
                          </Text>
                        </HStack>
                        <Progress
                          value={progressPercent}
                          colorScheme={challenge.color}
                          borderRadius="full"
                          size="sm"
                        />
                      </Box>

                      {isCompleted && (
                        <Badge
                          colorScheme={challenge.color}
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                          py={1}
                          alignSelf="center"
                        >
                          🏆 {challenge.reward}
                        </Badge>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </motion.div>
            </WrapItem>
          )
        })}
      </Wrap>

      {completedChallenges.length > 0 && (
        <Card bg="yellow.50" borderColor="yellow.200" borderWidth={1} borderRadius="xl">
          <CardBody>
            <HStack spacing={3}>
              <Trophy size={20} color="gold" />
              <Box>
                <Text fontWeight="semibold" color="yellow.800">
                  Achievement Unlocked! 🎉
                </Text>
                <Text fontSize="sm" color="yellow.700">
                  You've completed {completedChallenges.length} gratitude challenge{completedChallenges.length > 1 ? 's' : ''}!
                </Text>
              </Box>
            </HStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
}

export default GratitudeChallenges