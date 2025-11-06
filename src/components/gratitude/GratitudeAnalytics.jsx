import { useMemo } from 'react'
import { TrendingUp, Calendar, BarChart3, PieChart, Target, Heart } from 'lucide-react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Grid,
  GridItem,
  Progress,
  Badge,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import { GRATITUDE_CATEGORIES } from '../../data/gratitudeCategories'

function GratitudeAnalytics({ entries }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const analytics = useMemo(() => {
    if (!entries.length) return null

    // Basic stats
    const totalEntries = entries.length
    const avgItemsPerEntry = entries.reduce((sum, entry) => sum + (entry.items?.length || 0), 0) / totalEntries
    const avgMoodRating = entries.reduce((sum, entry) => sum + (entry.mood_rating || 3), 0) / totalEntries

    // Category distribution
    const categoryCount = {}
    entries.forEach(entry => {
      if (entry.categories) {
        entry.categories.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })
      }
    })

    // Monthly trends
    const monthlyData = {}
    entries.forEach(entry => {
      const date = new Date(entry.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    // Day of week patterns
    const dayOfWeekCount = Array(7).fill(0)
    entries.forEach(entry => {
      const day = new Date(entry.date).getDay()
      dayOfWeekCount[day]++
    })

    // Most common words in gratitude items
    const wordCount = {}
    entries.forEach(entry => {
      if (entry.items) {
        entry.items.forEach(item => {
          const words = item.toLowerCase().split(/\s+/)
          words.forEach(word => {
            if (word.length > 3) { // Only count meaningful words
              wordCount[word] = (wordCount[word] || 0) + 1
            }
          })
        })
      }
    })

    const topWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    // Streak analysis
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date))
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDate = null

    sortedEntries.forEach(entry => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)

      if (lastDate) {
        const diffDays = Math.floor((entryDate - lastDate) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          tempStreak++
          currentStreak = tempStreak
          longestStreak = Math.max(longestStreak, tempStreak)
        } else if (diffDays > 1) {
          tempStreak = 1
          currentStreak = 1
        }
      } else {
        tempStreak = 1
        currentStreak = 1
        longestStreak = 1
      }

      lastDate = entryDate
    })

    return {
      totalEntries,
      avgItemsPerEntry: Math.round(avgItemsPerEntry * 10) / 10,
      avgMoodRating: Math.round(avgMoodRating * 10) / 10,
      categoryCount,
      monthlyData,
      dayOfWeekCount,
      topWords,
      currentStreak,
      longestStreak
    }
  }, [entries])

  if (!analytics) return null

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const mostActiveDay = analytics.dayOfWeekCount.indexOf(Math.max(...analytics.dayOfWeekCount))

  return (
    <VStack spacing={6} align="stretch">
      <HStack spacing={2}>
        <BarChart3 size={20} color="blue" />
        <Text fontWeight="semibold" fontSize="lg">Gratitude Analytics</Text>
      </HStack>

      {/* Key Metrics */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
            <CardBody textAlign="center">
              <Calendar size={24} color="blue" />
              <Text fontSize="2xl" fontWeight="bold" color="blue.500" mt={2}>
                {analytics.totalEntries}
              </Text>
              <Text fontSize="sm" color="gray.600">Total Entries</Text>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
            <CardBody textAlign="center">
              <Target size={24} color="green" />
              <Text fontSize="2xl" fontWeight="bold" color="green.500" mt={2}>
                {analytics.avgItemsPerEntry}
              </Text>
              <Text fontSize="sm" color="gray.600">Avg Items/Entry</Text>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
            <CardBody textAlign="center">
              <Heart size={24} color="pink" />
              <Text fontSize="2xl" fontWeight="bold" color="pink.500" mt={2}>
                {analytics.avgMoodRating}/5
              </Text>
              <Text fontSize="sm" color="gray.600">Avg Mood</Text>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
            <CardBody textAlign="center">
              <TrendingUp size={24} color="purple" />
              <Text fontSize="2xl" fontWeight="bold" color="purple.500" mt={2}>
                {analytics.longestStreak}
              </Text>
              <Text fontSize="sm" color="gray.600">Longest Streak</Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        {/* Category Distribution */}
        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
            <CardBody>
              <HStack mb={4}>
                <PieChart size={20} color="orange" />
                <Text fontWeight="semibold">Category Distribution</Text>
              </HStack>
              <VStack spacing={3} align="stretch">
                {Object.entries(analytics.categoryCount)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([catId, count]) => {
                    const category = GRATITUDE_CATEGORIES.find(c => c.id === catId)
                    const percentage = Math.round((count / analytics.totalEntries) * 100)
                    return (
                      <Box key={catId}>
                        <HStack justify="space-between" mb={1}>
                          <HStack>
                            <Text>{category?.icon || '✨'}</Text>
                            <Text fontSize="sm">{category?.name || catId}</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">{count} ({percentage}%)</Text>
                        </HStack>
                        <Progress value={percentage} colorScheme="orange" size="sm" borderRadius="full" />
                      </Box>
                    )
                  })}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Activity Patterns */}
        <GridItem>
          <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
            <CardBody>
              <HStack mb={4}>
                <Calendar size={20} color="teal" />
                <Text fontWeight="semibold">Activity Patterns</Text>
              </HStack>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Most Active Day</Text>
                  <Badge colorScheme="teal" fontSize="sm" px={3} py={1}>
                    {dayNames[mostActiveDay]} ({analytics.dayOfWeekCount[mostActiveDay]} entries)
                  </Badge>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>Current Streak</Text>
                  <HStack>
                    <Text fontSize="lg" fontWeight="bold" color="teal.500">
                      {analytics.currentStreak} days
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      (Best: {analytics.longestStreak})
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Top Words */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
        <CardBody>
          <HStack mb={4}>
            <BarChart3 size={20} color="purple" />
            <Text fontWeight="semibold">Most Common Words in Your Gratitude</Text>
          </HStack>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {analytics.topWords.map(([word, count]) => (
              <Badge
                key={word}
                variant="subtle"
                colorScheme="purple"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="sm"
              >
                {word} ({count})
              </Badge>
            ))}
          </Box>
        </CardBody>
      </Card>
    </VStack>
  )
}

export default GratitudeAnalytics