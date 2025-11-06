import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

function HabitHeatMap({ habitId, habitName }) {
  const [hoveredDay, setHoveredDay] = useState(null)

  // Memoize the last 14 days calculation
  const days = useMemo(() => {
    const days = []
    const today = new Date()
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate()
      })
    }
    return days
  }, [])

  // Memoize habit data retrieval
  const completedDates = useMemo(() => {
    try {
      const habits = JSON.parse(localStorage.getItem('space4u_habits') || '[]')
      const habit = habits.find(h => h.id === habitId)
      return habit?.completedDates || []
    } catch (error) {
      console.error('Error reading habit data:', error)
      return []
    }
  }, [habitId])

  // Memoize streak calculation
  const streak = useMemo(() => {
    return days.reduce((count, day) => {
      if (completedDates.includes(day.date)) return count + 1
      return 0
    }, 0)
  }, [days, completedDates])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">14-Day Progress</h3>
        {streak > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 rounded-full">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">{streak} days</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCompleted = completedDates.includes(day.date)
          const isToday = day.date === new Date().toISOString().split('T')[0]
          
          return (
            <div
              key={day.date}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className="relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isCompleted 
                    ? 'bg-green-500 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                } ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >
                <div className="text-xs font-medium">{day.dayName}</div>
                <div className="text-lg font-bold">{day.dayNum}</div>
              </motion.div>
              
              {hoveredDay?.date === day.date && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                  {isCompleted ? '✓ Completed' : 'Not completed'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>Incomplete</span>
        </div>
      </div>
    </motion.div>
  )
}

export default HabitHeatMap
