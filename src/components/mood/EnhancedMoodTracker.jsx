import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import * as RadixSwitch from '@radix-ui/react-switch'
import { motion, AnimatePresence } from 'framer-motion'
import { addPoints, POINT_VALUES, checkMoodLogBadges } from '../../utils/badgeSystem'
import { queueMoodLog } from '../../utils/offlineQueue'
import { useMoods } from '../../hooks/useMoods'
import { getLocalDate } from '../../utils/dateHelpers'
import { announce } from '../common/LiveRegion'
import TagSelector from './TagSelector'

const MotionDiv = motion.div

const moods = [
  { emoji: '', label: 'Amazing', value: 5, color: '#10B981' },
  { emoji: '', label: 'Good', value: 4, color: '#84CC16' },
  { emoji: '', label: 'Okay', value: 3, color: '#F59E0B' },
  { emoji: '', label: 'Low', value: 2, color: '#F97316' },
  { emoji: '', label: 'Struggling', value: 1, color: '#EF4444' },
]

function EnhancedMoodTracker({ onMoodLogged }) {
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [todaysMood, setTodaysMood] = useState(null)
  const [streak, setStreak] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(false)
  
  const today = getLocalDate()
  const { moods: moodsData, saveMood } = useMoods()

  const { control, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      mood: 3,
      note: '',
      tags: [],
    },
  })

  const selectedMood = watch('mood')
  const currentMoodData = moods.find(m => m.value === selectedMood)
  const noteValue = watch('note')

  useEffect(() => {
    const todayMood = moodsData[today]
    if (todayMood) {
      setTodaysMood(todayMood)
    }
    calculateStreak(moodsData)
    
    const hasLoggedBefore = localStorage.getItem('space4u_has_logged_mood')
    if (!hasLoggedBefore) {
      setIsFirstTime(true)
    }
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

  const onSubmit = async (data) => {
    const moodData = {
      mood: data.mood,
      emoji: currentMoodData.emoji,
      label: currentMoodData.label,
      note: data.note.trim(),
      tags: data.tags,
      timestamp: new Date().toISOString(),
      isAnonymous,
    }
    
    await saveMood(today, moodData)
    queueMoodLog({ ...moodData, date: today })
    
    addPoints(POINT_VALUES.moodLog, 'Mood logged')
    const badgeResults = checkMoodLogBadges()
    
    setShowSuccess(true)
    calculateStreak({ ...moodsData, [today]: moodData })
    announce('Mood logged successfully!')
    
    localStorage.setItem('space4u_has_logged_mood', 'true')
    
    setTimeout(() => {
      setShowSuccess(false)
      setTodaysMood(moodData)
      reset()
      onMoodLogged?.()
    }, 2000)
  }

  if (showSuccess) {
    return (
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6 mb-6 text-center"
      >
        <div className="text-4xl mb-4">
        <h3 className="text-xl font-semibold mb-2">Mood logged!</h3>
        {streak > 1 && (
          <p className="text-gray-600">
            {streak} day streak! Keep it up 
          </p>
        )}
      </MotionDiv>
    )
  }

  if (todaysMood) {
    return (
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{todaysMood.emoji}</span>
            <div>
              <h3 className="font-semibold">
                Today's mood: {todaysMood.label}
              </h3>
              {todaysMood.note && (
                <p className="text-gray-600 text-sm truncate max-w-xs">
                  {todaysMood.note}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setTodaysMood(null)}
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    )
  }

  return (
    <RadixTooltip.Provider>
      <MotionDiv
        className="card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isFirstTime && (
          <AnimatePresence>
            <MotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-blue-50 rounded-xl"
            >
              <p className="text-sm text-blue-700">
                 Welcome! Track your mood daily to unlock insights and build healthy habits.
              </p>
            </MotionDiv>
          </AnimatePresence>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <h2 className="text-xl font-semibold">
                How are you feeling right now?
              </h2>
            </div>

            <div>
              <label htmlFor="mood-slider" className="block mb-2 font-medium">
                Current Mood: {currentMoodData.emoji} {currentMoodData.label}
              </label>
              <Controller
                name="mood"
                control={control}
                rules={{ required: 'Please select your mood' }}
                render={({ field }) => (
                  <div className="relative">
                    <input
                      id="mood-slider"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value))
                        announce(`Selected ${moods.find(m => m.value === parseInt(e.target.value))?.label} mood`)
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${currentMoodData.color} 0%, ${currentMoodData.color} ${((selectedMood - 1) / 4) * 100}%, #e5e7eb ${((selectedMood - 1) / 4) * 100}%, #e5e7eb 100%)`
                      }}
                      aria-label="Mood slider"
                    />
                    <div className="flex justify-between mt-4">
                      {moods.map((mood) => (
                        <RadixTooltip.Root key={mood.value}>
                          <RadixTooltip.Trigger asChild>
                            <span 
                              role="img" 
                              aria-label={mood.label}
                              className="text-2xl cursor-pointer"
                            >
                              {mood.emoji}
                            </span>
                          </RadixTooltip.Trigger>
                          <RadixTooltip.Portal>
                            <RadixTooltip.Content
                              className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                              sideOffset={5}
                            >
                              {mood.label}
                              <RadixTooltip.Arrow className="fill-gray-900" />
                            </RadixTooltip.Content>
                          </RadixTooltip.Portal>
                        </RadixTooltip.Root>
                      ))}
                    </div>
                  </div>
                )}
              />
              {errors.mood && (
                <p className="text-red-500 text-sm mt-1">{errors.mood.message}</p>
              )}
            </div>

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

            <div>
              <label htmlFor="mood-note" className="block mb-2 font-medium">
                Add a note (optional)
              </label>
              <Controller
                name="note"
                control={control}
                rules={{ maxLength: { value: 200, message: 'Note must be 200 characters or less' } }}
                render={({ field }) => (
                  <textarea
                    id="mood-note"
                    placeholder="What's on your mind?"
                    aria-label="Mood note"
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl resize-none focus:border-primary outline-none transition-colors"
                    {...field}
                  />
                )}
              />
              <div className="flex justify-between mt-1">
                {errors.note && (
                  <p className="text-red-500 text-sm">{errors.note.message}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {noteValue.length}/200
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RadixSwitch.Root
                  id="anonymous-switch"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-primary transition-colors"
                  aria-label="Toggle anonymous mode"
                >
                  <RadixSwitch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                </RadixSwitch.Root>
                <label htmlFor="anonymous-switch" className="text-sm cursor-pointer">
                  Anonymous
                </label>
              </div>
              {streak > 0 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                   {streak} day streak
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Logging...' : 'Log Mood'}
            </button>
          </div>
        </form>
      </MotionDiv>
    </RadixTooltip.Provider>
  )
}

export default EnhancedMoodTracker

