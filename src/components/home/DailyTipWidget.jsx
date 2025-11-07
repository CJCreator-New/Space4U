import { useState, useEffect, memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, RefreshCw } from 'lucide-react'

// Cache tips array
const tips = [
  { text: "Take 3 deep breaths when feeling overwhelmed", category: "Mindfulness" },
  { text: "Gratitude journaling can boost mood by 25%", category: "Wellness" },
  { text: "Connect with someone today - social bonds reduce stress", category: "Connection" },
  { text: "5-minute walks improve mental clarity instantly", category: "Movement" },
  { text: "Celebrate small wins - progress is progress", category: "Motivation" },
  { text: "Sleep 7-9 hours for optimal emotional regulation", category: "Rest" },
  { text: "Name your emotions to reduce their intensity", category: "Awareness" },
  { text: "Set boundaries - saying no is self-care", category: "Self-Care" },
]

const DailyTipWidget = memo(function DailyTipWidget() {
  const [tip, setTip] = useState(tips[0])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setTip(randomTip)
  }, [])

  const refreshTip = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      setTip(randomTip)
      setIsRefreshing(false)
    }, 300)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500 rounded-lg">
            <Lightbulb className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Wellness Tip</h3>
            <span className="text-xs text-amber-600 dark:text-amber-400">{tip.category}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshTip}
          className="p-2 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors"
        >
          <RefreshCw className={`text-amber-600 dark:text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} size={18} />
        </motion.button>
      </div>
      <motion.p
        key={tip.text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-700 dark:text-gray-300 leading-relaxed"
      >
        {tip.text}
      </motion.p>
    </motion.div>
  )
})

export default DailyTipWidget
