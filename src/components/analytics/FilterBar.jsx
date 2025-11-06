import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Activity } from 'lucide-react'

export default function FilterBar({ filters, onFiltersChange }) {
  const timeframes = [
    { value: '7d', label: '7 Days' },
    { value: '14d', label: '14 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' }
  ]

  const metrics = [
    { value: 'mood', label: 'Mood', icon: TrendingUp },
    { value: 'activity', label: 'Activity', icon: Activity },
    { value: 'circles', label: 'Circles', icon: Calendar }
  ]

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
          <div className="flex flex-wrap gap-2">
            {timeframes.map(({ value, label }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFiltersChange({ ...filters, timeframe: value })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.timeframe === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
          <div className="flex flex-wrap gap-2">
            {metrics.map(({ value, label, icon: Icon }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFiltersChange({ ...filters, metric: value })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filters.metric === value
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
