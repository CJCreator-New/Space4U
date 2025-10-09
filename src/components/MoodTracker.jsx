import { useState, useEffect } from 'react'
import { addPoints, POINT_VALUES, checkMoodLogBadges } from '../utils/badgeSystem'
import { queueMoodLog } from '../utils/offlineQueue'
import { useMoods } from '../hooks/useMoods'
import { getLocalDate } from '../utils/dateHelpers'
import { announce } from './common/LiveRegion'
import { useFocusTrap } from '../hooks/useFocusTrap'
import TagSelector from './mood/TagSelector'

const moods = [
  { emoji: '😊', label: 'Amazing', value: 5, color: '#10B981' },
  { emoji: '🙂', label: 'Good', value: 4, color: '#84CC16' },
  { emoji: '😐', label: 'Okay', value: 3, color: '#F59E0B' },
  { emoji: '😢', label: 'Low', value: 2, color: '#F97316' },
  { emoji: '😰', label: 'Struggling', value: 1, color: '#EF4444' },
]

function MoodTracker({ onMoodLogged }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showNote, setShowNote] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [todaysMood, setTodaysMood] = useState(null)
  const [streak, setStreak] = useState(0)
  const [storageError, setStorageError] = useState(false)
  const [unlockedBadges, setUnlockedBadges] = useState([])

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

  const handleLogMood = async () => {
    const moodData = {
      mood: selectedMood.value,
      emoji: selectedMood.emoji,
      label: selectedMood.label,
      note: note.trim(),
      tags: selectedTags,
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
      setNote('')
      setShowNote(false)
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
      <div className="card p-6 mb-6 text-center dark:bg-gray-800 dark:border-gray-700">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2">Mood logged!</h3>
        {streak > 1 && (
          <p className="text-text-secondary">
            {streak} day streak! Keep it up 🔥
          </p>
        )}
      </div>
    )
  }

  if (isLogged && todaysMood) {
    return (
      <div className="card p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{todaysMood.emoji}</span>
            <div>
              <h3 className="font-semibold text-text-primary dark:text-white">
                Today's mood: {todaysMood.label}
              </h3>
              {todaysMood.note && (
                <p className="text-text-secondary dark:text-gray-300 text-sm truncate max-w-xs">
                  {todaysMood.note}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-primary dark:bg-primary-light text-white rounded-xl text-sm font-medium hover:bg-primary/90 dark:hover:bg-primary-light/90 transition-colors"
            >
              Update
            </button>
            <button className="text-text-secondary dark:text-gray-300 text-sm hover:text-text-primary dark:hover:text-white">
              View History
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="mb-4">
        <p className="text-text-secondary dark:text-gray-300 text-sm">{dateString}</p>
        <h2 className="text-xl font-semibold text-text-primary dark:text-white">{greeting}!</h2>
        <p className="text-text-primary dark:text-gray-100 mt-2">How are you feeling right now?</p>
      </div>

      <div className="flex justify-between gap-2 mb-4">
        {moods.map((mood) => (
          <div key={mood.value} className="flex flex-col items-center">
            <button
              onClick={() => handleMoodSelect(mood)}
              aria-label={`Select ${mood.label} mood`}
              aria-pressed={selectedMood?.value === mood.value}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-200 hover:scale-110 ${
                selectedMood?.value === mood.value 
                  ? 'scale-110 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              style={{ backgroundColor: `${mood.color}20` }}
            >
              {mood.emoji}
            </button>
            {selectedMood?.value === mood.value && (
              <span className="text-xs text-text-secondary dark:text-gray-300 mt-1 font-medium">
                {mood.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {showNote && (
        <div className="overflow-hidden transition-all duration-300 ease-out">
          <div className="mb-4">
            <TagSelector 
              selectedTags={selectedTags}
              onChange={setSelectedTags}
              maxTags={5}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="mood-note" className="sr-only">
              Add a note about your mood (optional)
            </label>
            <textarea
              id="mood-note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              placeholder="Want to add a note? (optional)"
              aria-label="Mood note"
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl resize-none focus:border-primary dark:focus:border-primary-light outline-none transition-colors"
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${charCountColor}`}>
                {remainingChars}/200
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLogMood}
              aria-label="Log your mood"
              className="flex-1 bg-primary dark:bg-primary-light text-white py-3 rounded-xl font-semibold hover:bg-primary/90 dark:hover:bg-primary-light/90 transition-colors"
            >
              Log Mood
            </button>
            <button
              onClick={() => {
                setSelectedMood(null)
                setShowNote(false)
                setNote('')
                setSelectedTags([])
              }}
              className="text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* Badge Unlock Modal */}
      {unlockedBadges.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          onClick={handleCloseBadgeModal}
          role="dialog"
          aria-labelledby="badge-modal-title"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 id="badge-modal-title" className="text-2xl font-bold text-text-primary dark:text-white mb-2">
                Badge Unlocked!
              </h3>
              {unlockedBadges.map((result, index) => (
                <div key={index} className="mb-4">
                  <div className="text-4xl mb-2">{result.badge.emoji}</div>
                  <h4 className="text-xl font-semibold text-text-primary dark:text-white">
                    {result.badge.name}
                  </h4>
                  <p className="text-text-secondary dark:text-gray-300">
                    {result.badge.description}
                  </p>
                  <p className="text-primary dark:text-primary-light font-medium mt-2">
                    +{result.badge.points} points
                  </p>
                </div>
              ))}
              <button
                onClick={handleCloseBadgeModal}
                className="mt-4 px-6 py-3 bg-primary dark:bg-primary-light text-white rounded-xl font-medium hover:bg-primary/90 dark:hover:bg-primary-light/90 transition-colors"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MoodTracker