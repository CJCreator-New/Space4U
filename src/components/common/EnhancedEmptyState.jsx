import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function EnhancedEmptyState({ 
  icon, 
  title, 
  description, 
  actions = [],
  illustration 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : (
        <div className="text-6xl mb-6">{icon}</div>
      )}
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">{description}</p>
      
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                index === 0
                  ? 'bg-primary text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
              {index === 0 && <ArrowRight size={18} />}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
