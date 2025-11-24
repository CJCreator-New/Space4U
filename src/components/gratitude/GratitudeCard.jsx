import { Edit2, Trash2, Calendar, Play, Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import { GRATITUDE_CATEGORIES } from '../../data/gratitudeCategories'

function GratitudeCard({ entry, onEdit, onDelete, isPremium }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getMoodEmoji = (rating) => {
    return ['😔', '😕', '😊', '😄', '🤩'][rating - 1] || '😐'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(entry.date)}
              </span>
              <span className="text-2xl ml-2">
                {getMoodEmoji(entry.mood_rating)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(entry)}
                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                aria-label="Edit entry"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(entry.date)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Delete entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {entry.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-xl">✨</span>
                <p className="flex-1 text-gray-800 dark:text-gray-200">{item}</p>
              </div>
            ))}
          </div>

          {entry.categories && entry.categories.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {entry.categories.map(catId => {
                  const category = GRATITUDE_CATEGORIES.find(c => c.id === catId)
                  return category ? (
                    <span
                      key={catId}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-800 dark:bg-${category.color}-900/30 dark:text-${category.color}-300`}
                    >
                      {category.icon} {category.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          {entry.voiceRecording && (
            <div className="mb-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mic size={16} className="text-blue-500" />
                <span className="text-sm text-blue-700 dark:text-blue-300 flex-1">
                  Voice recording ({Math.floor(entry.voiceRecording.duration / 60)}:{(entry.voiceRecording.duration % 60).toString().padStart(2, '0')})
                </span>
                <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800/50 rounded transition-colors">
                  <Play size={12} />
                  Play
                </button>
              </div>
            </div>
          )}

          {entry.notes && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {entry.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default GratitudeCard
