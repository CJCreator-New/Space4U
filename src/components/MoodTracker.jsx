import { useState, useEffect, useCallback, useMemo, useReducer } from 'react'
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

const initialMoodState = {
  selectedMood: null,
  showNote: false,
  isLogged: false,
  showSuccess: false,
  todaysMood: null,
  streak: 0,
  storageError: false,
  unlockedBadges: []
}

const moodReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_MOOD':
      return { ...state, selectedMood: action.payload, showNote: true }
    case 'SET_SHOW_SUCCESS':
      return { ...state, showSuccess: action.payload }
    case 'SET_TODAYS_MOOD':
      return { ...state, todaysMood: action.payload, isLogged: true }
    case 'SET_STREAK':
      return { ...state, streak: action.payload }
    case 'SET_STORAGE_ERROR':
      return { ...state, storageError: action.payload }
    case 'SET_UNLOCKED_BADGES':
      return { ...state, unlockedBadges: action.payload }
    case 'RESET_MOOD_STATE':
      return { ...initialMoodState }
    default:
      return state
  }
}

function MoodTracker({ onMoodLogged }) {
  const [moodState, dispatch] = useReducer(moodReducer, initialMoodState)

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    mode: 'onBlur',
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

  const getMoodEmoji = useCallback((value) => {
    const mood = moods.find(m => m.value === value)
    return mood?.emoji || '😐'
  }, [])

  const getMoodLabel = useCallback((value) => {
    const mood = moods.find(m => m.value === value)
    return mood?.label || 'Okay'
  }, [])

  useEffect(() => {
    const todayMood = moodsData[today]
    
    if (todayMood) {
      dispatch({ type: 'SET_TODAYS_MOOD', payload: todayMood })
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
    
    dispatch({ type: 'SET_STREAK', payload: streakCount })
  }

  const handleMoodSelect = useCallback((mood) => {
    dispatch({ type: 'SET_SELECTED_MOOD', payload: mood })
    announce(`Selected ${mood.label} mood`)
  }, [])

  const handleLogMood = useCallback(async (data) => {
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
    
    // Show success immediately
    dispatch({ type: 'SET_SHOW_SUCCESS', payload: true })
    calculateStreak({ ...moodsData, [today]: moodData })
    announce('Mood logged successfully!')
    
    // Defer badge checks to not block UI
    setTimeout(() => {
      addPoints(POINT_VALUES.moodLog, 'Mood logged')
      const badgeResults = checkMoodLogBadges()
      const newlyUnlocked = badgeResults.filter(r => r.unlocked)
      
      if (newlyUnlocked.length > 0) {
        dispatch({ type: 'SET_UNLOCKED_BADGES', payload: newlyUnlocked })
      }
    }, 0)
    
    // Reduce success animation time
    setTimeout(() => {
      dispatch({ type: 'SET_SHOW_SUCCESS', payload: false })
      dispatch({ type: 'SET_TODAYS_MOOD', payload: moodData })
      dispatch({ type: 'RESET_MOOD_STATE' })
      reset()
      onMoodLogged?.()
    }, 2000)
  }, [getMoodEmoji, getMoodLabel, saveMood, today, moodsData, reset, onMoodLogged])

  const handleCloseBadgeModal = () => {
    dispatch({ type: 'SET_UNLOCKED_BADGES', payload: [] })
  }

  const handleUpdate = () => {
    setIsLogged(false)
    setTodaysMood(null)
  }

  const remainingChars = 200 - note.length
  const charCountColor = remainingChars < 20 ? 'text-danger' : remainingChars < 50 ? 'text-warning' : 'text-text-secondary'

  if (moodState.showSuccess) {
    return (
      <Box
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
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
        {moodState.streak > 1 && (
          <Text color="gray.600">
            {moodState.streak} day streak! Keep it up 🔥
          </Text>
        )}
      </Box>
    )
  }

  if (moodState.isLogged && moodState.todaysMood) {
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
            <Text fontSize="3xl">{moodState.todaysMood.emoji}</Text>
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
                  dispatch({ type: 'SET_SELECTED_MOOD', payload: moods.find(m => m.value === value) })
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
          {moodState.selectedMood && (
            <Text fontSize="xs" color="gray.600" mt={1}>
              {moodState.selectedMood.label}
            </Text>
          )}
        </FormControl>

        {moodState.showNote && (
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