import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { getToolMetadata } from '../../utils/toolRecommendations'

export default function RecommendedSection({ toolIds, onToolClick }) {
  if (!toolIds || toolIds.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
      </div>
      <p className="text-gray-600 mb-6">Based on your recent mood patterns</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {toolIds.slice(0, 6).map((toolId, index) => {
          const metadata = getToolMetadata(toolId)
          return (
            <motion.div
              key={toolId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
              className="bg-white rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-purple-300 transition-all"
              onClick={() => onToolClick(toolId)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{getToolIcon(toolId)}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(metadata.category)}`}>
                  {metadata.category}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{formatToolName(toolId)}</h3>
              <p className="text-sm text-gray-600 mb-4">{metadata.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{metadata.duration}</span>
                <div className="flex items-center gap-1 text-purple-600 font-medium">
                  Start
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

const getToolIcon = (toolId) => {
  const icons = {
    'breathing-exercises': '🫁',
    'crisis-resources': '🆘',
    'grounding-techniques': '🌍',
    'self-compassion': '💝',
    'emergency-contacts': '📞',
    'mood-boosters': '✨',
    'coping-skills': '💪',
    'mindfulness': '🌸',
    'self-care-tips': '🛀',
    'gratitude-journal': '📝',
    'goal-setting': '🎯',
    'wellness-challenges': '🏆',
    'habit-tracker': '✅',
    'meditation': '🧘'
  }
  return icons[toolId] || '🔧'
}

const formatToolName = (toolId) => {
  return toolId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getCategoryColor = (category) => {
  const colors = {
    calming: 'bg-blue-100 text-blue-700',
    resilience: 'bg-green-100 text-green-700',
    connection: 'bg-purple-100 text-purple-700',
    general: 'bg-gray-100 text-gray-700'
  }
  return colors[category] || colors.general
}
