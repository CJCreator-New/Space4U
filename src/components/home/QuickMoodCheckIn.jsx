import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, Meh, Frown, Check } from 'lucide-react'

const moods = [
  { emoji: 'ðŸ˜Š', label: 'Great', value: 5, color: 'from-green-400 to-emerald-500' },
  { emoji: 'ðŸ™‚', label: 'Good', value: 4, color: 'from-lime-400 to-green-500' },
  { emoji: 'ðŸ˜', label: 'Okay', value: 3, color: 'from-yellow-400 to-amber-500' },
  { emoji: 'ðŸ˜”', label: 'Low', value: 2, color: 'from-orange-400 to-red-500' },
  { emoji: 'ðŸ˜¢', label: 'Struggling', value: 1, color: 'from-red-400 to-rose-500' },
]

export default function QuickMoodCheckIn({ onMoodLogged }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [saved, setSaved] = useState(false)

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setSaved(true)
    
    const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
    const today = new Date().toISOString().split('T')[0]
    moods[today] = { mood: mood.value, value: mood.value, emoji: mood.emoji, label: mood.label, timestamp: new Date().toISOString() }
    localStorage.setItem('space4u_moods', JSON.stringify(moods))

    if (onMoodLogged) onMoodLogged()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-800 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Smile className="text-blue-500" size={24} />
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Quick Mood Check-In</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">How are you feeling right now?</p>
      
      <div className="flex gap-3 justify-between">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(mood)}
            className={`flex-1 p-4 rounded-xl transition-all ${
              selectedMood?.value === mood.value
                ? `bg-gradient-to-br ${mood.color} shadow-lg`
                : 'bg-white dark:bg-gray-700 hover:shadow-md'
            }`}
          >
            <div className="text-3xl mb-1">{mood.emoji}</div>
            <div className={`text-xs font-medium ${
              selectedMood?.value === mood.value ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {mood.label}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400"
          >
            <Check size={18} />
            <span className="text-sm font-medium">Mood logged successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

