import { Zap, Heart, Brain, Activity, BookOpen, Users, MessageCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function QuickActionsWidget() {
  const navigate = useNavigate()

  const quickActions = [
    {
      icon: Heart,
      label: 'Log Mood',
      description: 'Track how you feel',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      hoverColor: 'hover:bg-red-200 dark:hover:bg-red-900/50',
      path: '/emotions',
      popular: true
    },
    {
      icon: BookOpen,
      label: 'Gratitude',
      description: 'Write what you\'re thankful for',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      hoverColor: 'hover:bg-green-200 dark:hover:bg-green-900/50',
      path: '/gratitude',
      popular: true
    },
    {
      icon: Brain,
      label: 'Insights',
      description: 'View your mental health trends',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      hoverColor: 'hover:bg-purple-200 dark:hover:bg-purple-900/50',
      path: '/insights'
    },
    {
      icon: Activity,
      label: 'Tools',
      description: 'Access coping resources',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-900/50',
      path: '/tools'
    },
    {
      icon: Users,
      label: 'Circles',
      description: 'Connect with community',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      hoverColor: 'hover:bg-orange-200 dark:hover:bg-orange-900/50',
      path: '/circles'
    },
    {
      icon: MessageCircle,
      label: 'Professional',
      description: 'Get professional support',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      hoverColor: 'hover:bg-indigo-200 dark:hover:bg-indigo-900/50',
      path: '/professional'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg">
          <Zap className="text-yellow-600 dark:text-yellow-400" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-text-primary dark:text-white">Quick Actions</h3>
          <p className="text-sm text-text-secondary dark:text-gray-400">Jump to your favorite tools</p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(action.path)}
            className={`${action.bgColor} ${action.hoverColor} rounded-xl p-4 text-left transition-all relative group`}
          >
            {/* Popular Badge */}
            {action.popular && (
              <div className="absolute top-2 right-2">
                <Sparkles size={14} className="text-yellow-500" />
              </div>
            )}

            {/* Icon */}
            <div className="mb-3">
              <action.icon className={action.color} size={28} />
            </div>

            {/* Label */}
            <div>
              <p className={`font-semibold text-sm mb-1 ${action.color}`}>
                {action.label}
              </p>
              <p className="text-xs text-text-tertiary dark:text-gray-500 line-clamp-2">
                {action.description}
              </p>
            </div>

            {/* Hover Arrow */}

          </motion.button>
        ))}
      </div>

      {/* Footer Tip */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-text-secondary dark:text-gray-400 text-center">
          💡 <strong>Tip:</strong> Regular check-ins help track your mental wellness journey
        </p>
      </div>
    </motion.div>
  )
}
