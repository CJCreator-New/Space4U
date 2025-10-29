import { useState, useEffect, useMemo, useCallback } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, Target, Award } from '../config/icons'
import { useMoods } from '../hooks/useMoods'
import {
  Box,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
  Skeleton,
  Select,
} from '@chakra-ui/react'

const moodLabels = {
  5: { label: 'Amazing', emoji: '😊' },
  4: { label: 'Good', emoji: '🙂' },
  3: { label: 'Okay', emoji: '😐' },
  2: { label: 'Low', emoji: '😢' },
  1: { label: 'Struggling', emoji: '😰' }
}

function MoodTrends() {
  const [period, setPeriod] = useState('7')
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState(null)
  const { moods, loading: moodsLoading } = useMoods()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!moodsLoading) {
      loadMoodData()
    }
  }, [period, moods, moodsLoading])

  const loadMoodData = () => {
    const moodEntries = Object.entries(moods || {}).map(([date, mood]) => ({
      date,
      mood: mood.mood,
      emoji: mood.emoji,
      label: mood.label,
      note: mood.note,
      timestamp: mood.timestamp
    })).sort((a, b) => new Date(a.date) - new Date(b.date))

    const days = period === 'all' ? moodEntries.length : parseInt(period)
    const filteredData = period === 'all' ? moodEntries : moodEntries.slice(-days)
    
    const processedData = filteredData.map(entry => ({
      ...entry,
      displayDate: new Date(entry.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }))

    setChartData(processedData)
    calculateStats(processedData, moodEntries)
    setLoading(false)
  }

  const calculateStats = (currentData, allData) => {
    if (currentData.length === 0) {
      setStats(null)
      return
    }

    const currentAvg = currentData.reduce((sum, entry) => sum + entry.mood, 0) / currentData.length
    
    // Previous period comparison
    const prevPeriodData = period === 'all' ? [] : allData.slice(-(parseInt(period) * 2), -parseInt(period))
    const prevAvg = prevPeriodData.length > 0 
      ? prevPeriodData.reduce((sum, entry) => sum + entry.mood, 0) / prevPeriodData.length 
      : currentAvg
    
    const trend = currentAvg - prevAvg

    // Best day
    const bestDay = currentData.reduce((best, entry) => 
      entry.mood > best.mood ? entry : best
    )

    // Most common mood
    const moodCounts = currentData.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1
      return counts
    }, {})
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    )

    // Good days percentage
    const goodDays = currentData.filter(entry => entry.mood >= 4).length
    const goodDaysPercent = Math.round((goodDays / currentData.length) * 100)

    // Most consistent day of week
    const dayOfWeekMoods = currentData.reduce((days, entry) => {
      const dayOfWeek = new Date(entry.date).getDay()
      if (!days[dayOfWeek]) days[dayOfWeek] = []
      days[dayOfWeek].push(entry.mood)
      return days
    }, {})

    const dayVariances = Object.entries(dayOfWeekMoods).map(([day, moods]) => {
      const avg = moods.reduce((sum, mood) => sum + mood, 0) / moods.length
      const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - avg, 2), 0) / moods.length
      return { day: parseInt(day), variance }
    })

    const mostConsistentDay = dayVariances.length > 0 
      ? dayVariances.reduce((min, curr) => curr.variance < min.variance ? curr : min)
      : null

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    setStats({
      average: currentAvg,
      trend,
      bestDay,
      mostCommonMood: parseInt(mostCommonMood),
      goodDaysPercent,
      mostConsistentDay: mostConsistentDay ? dayNames[mostConsistentDay.day] : null
    })
  }

  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Card bg={useColorModeValue('white', 'gray.700')} shadow="lg" borderRadius="xl">
          <CardBody p={3}>
            <Text fontWeight="medium">
              {new Date(data.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text fontSize="lg">{data.emoji} {data.label}</Text>
            {data.note && (
              <Text fontSize="sm" color="gray.600" mt={1} maxW="xs">
                {data.note.length > 50 ? `${data.note.slice(0, 50)}...` : data.note}
              </Text>
            )}
          </CardBody>
        </Card>
      )
    }
    return null
  }, [])

  const formatYAxisLabel = useCallback((value) => {
    return moodLabels[value]?.emoji || ''
  }, [])

  if (loading) {
    return (
      <Card mb={6}>
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            <Skeleton height="6" width="48" />
            <Skeleton height="64" />
          </VStack>
        </CardBody>
      </Card>
    )
  }

  if (chartData.length < 3) {
    return (
      <Card mb={6} textAlign="center">
        <CardBody p={6}>
          <Text fontSize="4xl" mb={4}>📈</Text>
          <Text fontSize="xl" fontWeight="semibold" mb={2}>Your Mood Trends</Text>
          <Text color="gray.600" mb={4}>Keep logging to see trends</Text>
          <Box
            bg="gray.100"
            borderRadius="full"
            h={2}
            mb={2}
            position="relative"
          >
            <Box
              bg="blue.500"
              h={2}
              borderRadius="full"
              transition="all 0.3s"
              width={`${(chartData.length / 3) * 100}%`}
            />
          </Box>
          <Text fontSize="sm" color="gray.600">{chartData.length}/3 moods needed</Text>
        </CardBody>
      </Card>
    )
  }

  const periodLabels = useMemo(() => ({
    '7': 'Last 7 days',
    '30': 'Last 30 days',
    'all': 'All time'
  }), [])

  return (
    <Card mb={6}>
      <CardBody p={6}>
        <HStack justify="space-between" align="center" mb={6}>
          <Box>
            <Text fontSize="xl" fontWeight="semibold">Your Mood Trends</Text>
            <Text fontSize="sm" color="gray.600">{periodLabels[period]}</Text>
          </Box>
          <HStack gap={2}>
            {['7', '30', 'all'].map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'solid' : 'ghost'}
                colorScheme={period === p ? 'blue' : 'gray'}
                onClick={() => setPeriod(p)}
              >
                {p === 'all' ? 'All time' : `${p} days`}
              </Button>
            ))}
          </HStack>
        </HStack>

        {stats && (
          <Box mb={6} p={4} bg="blue.50" borderRadius="xl">
            <HStack gap={2} mb={2}>
              <Text fontSize="2xl">{moodLabels[Math.round(stats.average)]?.emoji}</Text>
              <Text fontSize="lg" fontWeight="semibold">
                Your average mood: {stats.average.toFixed(1)}
              </Text>
            </HStack>
            {stats.trend !== 0 && (
              <Text fontSize="sm" color="gray.600">
                {stats.trend > 0 ? '↑' : '↓'} {Math.abs(stats.trend).toFixed(1)} {stats.trend > 0 ? 'better' : 'lower'} than last period
              </Text>
            )}
          </Box>
        )}

        <Box h={{ base: "64", md: "80" }} mb={6}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={formatYAxisLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 16 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#4F46E5"
                strokeWidth={3}
                fill="url(#moodGradient)"
                dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {stats && (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
            <HStack gap={3} p={3} bg="gray.50" borderRadius="xl">
              <Icon as={Award} color="blue.500" boxSize={5} />
              <Box>
                <Text fontSize="sm" fontWeight="medium">Best day</Text>
                <Text fontSize="xs" color="gray.600">
                  {new Date(stats.bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {stats.bestDay.emoji}
                </Text>
              </Box>
            </HStack>

            <HStack gap={3} p={3} bg="gray.50" borderRadius="xl">
              <Icon as={Target} color="blue.500" boxSize={5} />
              <Box>
                <Text fontSize="sm" fontWeight="medium">Most common mood</Text>
                <Text fontSize="xs" color="gray.600">
                  {moodLabels[stats.mostCommonMood]?.emoji} {moodLabels[stats.mostCommonMood]?.label}
                </Text>
              </Box>
            </HStack>

            <HStack gap={3} p={3} bg="gray.50" borderRadius="xl">
              <Icon as={TrendingUp} color="blue.500" boxSize={5} />
              <Box>
                <Text fontSize="sm" fontWeight="medium">Good days</Text>
                <Text fontSize="xs" color="gray.600">{stats.goodDaysPercent}% felt good or better</Text>
              </Box>
            </HStack>

            {stats.mostConsistentDay && (
              <HStack gap={3} p={3} bg="gray.50" borderRadius="xl">
                <Icon as={Calendar} color="blue.500" boxSize={5} />
                <Box>
                  <Text fontSize="sm" fontWeight="medium">Most consistent</Text>
                  <Text fontSize="xs" color="gray.600">{stats.mostConsistentDay}s</Text>
                </Box>
              </HStack>
            )}
          </SimpleGrid>
        )}
      </CardBody>
    </Card>
  )
}

export default MoodTrends