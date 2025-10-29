import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from './common/IconLibrary'
import { useState } from 'react'

function QuickActions() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: 'Smile', label: 'Log Mood', action: () => navigate('/'), color: '#3B82F6' },
    { icon: 'Heart', label: 'Gratitude', action: () => navigate('/gratitude'), color: '#EC4899' },
    { icon: 'BookOpen', label: 'Resources', action: () => navigate('/resources'), color: '#8B5CF6' },
    { icon: 'Users', label: 'Circles', action: () => navigate('/circles'), color: '#10B981' },
    { icon: 'TrendingUp', label: 'Insights', action: () => navigate('/insights'), color: '#F59E0B' }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center"
        aria-label="Quick actions"
      >
        <Icon name="Plus" library="lucide" size={24} color="white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {actions.map((action, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { action.action(); setIsOpen(false); }}
                className="flex items-center gap-3 text-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
                style={{ backgroundColor: action.color }}
              >
                <Icon name={action.icon} library="lucide" size={18} color="white" />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuickActions
