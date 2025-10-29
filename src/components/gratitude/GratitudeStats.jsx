import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Card,
  CardBody,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

function GratitudeStats({ entries }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (entries.length === 0) return null

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map(date => {
    const entry = entries.find(e => e.date === date)
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry?.mood_rating || 0
    }
  })

  const avgMood = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.mood_rating, 0) / entries.length).toFixed(1)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl" shadow="lg">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="lg">Weekly Mood Trend</Heading>

            <HStack spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.600">Average Mood</Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {avgMood}/5
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">Total Entries</Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {entries.length}
                </Text>
              </Box>
            </HStack>

            <Box height="200px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    stroke={useColorModeValue('#666', '#ccc')}
                    fontSize={12}
                  />
                  <YAxis
                    domain={[0, 5]}
                    stroke={useColorModeValue('#666', '#ccc')}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="mood"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </motion.div>
  )
}

export default GratitudeStats
