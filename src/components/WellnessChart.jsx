import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const COLORS = {
  mood: '#4F46E5',
  habit: '#10B981',
  gratitude: '#F59E0B',
  emotion: '#EF4444'
}

function WellnessChart({ scores }) {
  const navigate = useNavigate()

  // Memoize data transformation and calculations
  const { data, totalScore, averageScore } = useMemo(() => {
    const data = [
      { name: 'Mood', value: scores.mood || 0, color: COLORS.mood, route: '/insights' },
      { name: 'Habits', value: scores.habit || 0, color: COLORS.habit, route: '/habits' },
      { name: 'Gratitude', value: scores.gratitude || 0, color: COLORS.gratitude, route: '/gratitude' },
      { name: 'Emotions', value: scores.emotion || 0, color: COLORS.emotion, route: '/emotions' }
    ]

    const totalScore = data.reduce((sum, item) => sum + item.value, 0)
    const averageScore = Math.round(totalScore / 4)

    return { data, totalScore, averageScore }
  }, [scores])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <div className="font-semibold text-text-primary">{data.name}</div>
          <div className="text-sm text-text-secondary">{data.value}/25 points</div>
          <div className="text-xs text-primary mt-1">Click to explore</div>
        </div>
      )
    }
    return null
  }

  const handleClick = (entry) => {
    if (entry.route) {
      navigate(entry.route)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <h3 className="font-semibold text-text-primary mb-4">Wellness Dimensions</h3>
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              onClick={(entry) => handleClick(entry)}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Score */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-4xl font-bold text-text-primary">{averageScore}</div>
          <div className="text-sm text-text-secondary">/ 100</div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item)}
            className="btn-micro flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-text-primary text-sm">{item.name}</div>
              <div className="text-xs text-text-secondary">{item.value}/25</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
        <p className="text-xs text-text-secondary">
          💡 Click on any dimension to explore and improve that area
        </p>
      </div>
    </motion.div>
  )
}

export default WellnessChart
