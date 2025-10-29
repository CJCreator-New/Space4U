import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { addPoints, POINT_VALUES, checkMoodLogBadges } from '../utils/badgeSystem'
import { queueMoodLog } from '../utils/offlineQueue'
import { useMoods } from '../hooks/useMoods'
import { getLocalDate } from '../utils/dateHelpers'
import { announce } from './common/LiveRegion'
import { useFocusTrap } from '../hooks/useFocusTrap'
import TagSelector from './mood/TagSelector'
import {
  Box,
  Button,
  Text,
  Textarea,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  useColorModeValue,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const moods = [
  { emoji: '😊', label: 'Amazing', value: 5, color: '#10B981' },
  { emoji: '🙂', label: 'Good', value: 4, color: '#84CC16' },
  { emoji: '😐', label: 'Okay', value: 3, color: '#F59E0B' },
  { emoji: '😢', label: 'Low', value: 2, color: '#F97316' },
  { emoji: '😰', label: 'Struggling', value: 1, color: '#EF4444' },
]

function MoodTracker({ onMoodLogged }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [showNote, setShowNote] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [todaysMood, setTodaysMood] = useState(null)
  const [streak, setStreak] = useState(0)
  const [storageError, setStorageError] = useState(false)
  const [unlockedBadges, setUnlockedBadges] = useState([])

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      mood: 3,
      note: '',
      tags: []
    }
  })

  const watchedMood = watch('mood')
  const watchedNote = watch('note')

  const today = getLocalDate()
  const now = new Date()
  const hour = now.getHours()
  
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const { moods: moodsData, saveMood } = useMoods()

  const getMoodEmoji = (value) => {
    const mood = moods.find(m => m.value === value)
    return mood?.emoji || '😐'
  }

  const getMoodLabel = (value) => {
    const mood = moods.find(m => m.value === value)
    return mood?.label || 'Okay'
  }

  useEffect(() => {
    const todayMood = moodsData[today]
    
    if (todayMood) {
      setTodaysMood(todayMood)
      setIsLogged(true)
    }
    
    calculateStreak(moodsData)
  }, [today, moodsData])

  const calculateStreak = (moods) => {
    let streakCount = 0
    const currentDate = new Date()
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(currentDate)
      checkDate.setDate(currentDate.getDate() - i)
      const dateKey = checkDate.toISOString().split('T')[0]
      
      if (moods[dateKey]) {
        streakCount++
      } else {
        break
      }
    }
    
    setStreak(streakCount)
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setShowNote(true)
    announce(`Selected ${mood.label} mood`)
  }

  const handleLogMood = async (data) => {
    const moodData = {
      mood: data.mood,
      emoji: getMoodEmoji(data.mood),
      label: getMoodLabel(data.mood),
      note: data.note.trim(),
      tags: data.tags || [],
      timestamp: new Date().toISOString()
    }
    
    // Save to Supabase or localStorage
    await saveMood(today, moodData)
    
    // Queue for offline sync
    queueMoodLog({ ...moodData, date: today })
    
    // Add points and check for badge unlocks
    addPoints(POINT_VALUES.moodLog, 'Mood logged')
    const badgeResults = checkMoodLogBadges()
    const newlyUnlocked = badgeResults.filter(r => r.unlocked)
    
    if (newlyUnlocked.length > 0) {
      setUnlockedBadges(newlyUnlocked)
    }
    
    setShowSuccess(true)
    calculateStreak({ ...moodsData, [today]: moodData })
    announce('Mood logged successfully!')
    
    setTimeout(() => {
      setShowSuccess(false)
      setTodaysMood(moodData)
      setIsLogged(true)
      setSelectedMood(null)
      setShowNote(false)
      reset()
      onMoodLogged?.()
    }, 3000)
  }

  const handleCloseBadgeModal = () => {
    setUnlockedBadges([])
  }

  const handleUpdate = () => {
    setIsLogged(false)
    setTodaysMood(null)
  }

  const remainingChars = 200 - note.length
  const charCountColor = remainingChars < 20 ? 'text-danger' : remainingChars < 50 ? 'text-warning' : 'text-text-secondary'

  if (showSuccess) {
    return (
      <Box
        as={motion.div}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        p={6}
        mb={6}
        textAlign="center"
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        shadow="md"
      >
        <Text fontSize="4xl" mb={4}>🎉</Text>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Mood logged!
        </Text>
        {streak > 1 && (
          <Text color="gray.600">
            {streak} day streak! Keep it up 🔥
          </Text>
        )}
      </Box>
    )
  }

  if (isLogged && todaysMood) {
    return (
      <Box
        p={6}
        mb={6}
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        shadow="md"
      >
        <HStack justify="space-between" align="start">
          <HStack gap={3}>
            <Text fontSize="3xl">{todaysMood.emoji}</Text>
            <Box>
              <Text fontWeight="semibold">
                Today's mood: {todaysMood.label}
              </Text>
              {todaysMood.note && (
                <Text fontSize="sm" color="gray.600" noOfLines={1} maxW="xs">
                  {todaysMood.note}
                </Text>
              )}
            </Box>
          </HStack>
          <VStack gap={2}>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button variant="ghost" size="sm">
              View History
            </Button>
          </VStack>
        </HStack>
      </Box>
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleLogMood)}
      p={6}
      mb={6}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="xl"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      shadow="md"
    >
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="sm" color="gray.600">{dateString}</Text>
          <Text fontSize="xl" fontWeight="semibold">{greeting}!</Text>
          <Text mt={2}>How are you feeling right now?</Text>
        </Box>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">Select your mood</FormLabel>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <Slider
                {...field}
                min={1}
                max={5}
                step={1}
                colorScheme="blue"
                onChange={(value) => {
                  field.onChange(value)
                  setSelectedMood(moods.find(m => m.value === value))
                  setShowNote(true)
                }}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
                {moods.map((mood) => (
                  <SliderMark
                    key={mood.value}
                    value={mood.value}
                    mt={6}
                    fontSize="sm"
                    color={watchedMood === mood.value ? 'blue.500' : 'gray.500'}
                  >
                    {mood.emoji}
                  </SliderMark>
                ))}
              </Slider>
            )}
          />
          {selectedMood && (
            <Text fontSize="xs" color="gray.600" mt={1}>
              {selectedMood.label}
            </Text>
          )}
        </FormControl>

        {showNote && (
          <VStack spacing={4} align="stretch">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagSelector
                  selectedTags={field.value}
                  onChange={field.onChange}
                  maxTags={5}
                />
              )}
            />

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Add a note (optional)
              </FormLabel>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="How are you feeling?"
                    rows={3}
                    maxLength={200}
                    resize="none"
                  />
                )}
              />
              <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
                {watchedNote?.length || 0}/200
              </Text>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={false}
            >
              Log Mood
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default MoodTracker