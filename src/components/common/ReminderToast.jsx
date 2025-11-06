import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Sparkles } from 'lucide-react'

const ReminderToast = ({
  message,
  type = 'reminder',
  duration = 5000,
  onDismiss,
  action,
  actionLabel
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Wait for exit animation
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onDismiss])

  const getIcon = () => {
    switch (type) {
      case 'gratitude':
        return <Heart className="w-5 h-5 text-pink-500" />
      case 'mood':
        return <Sparkles className="w-5 h-5 text-blue-500" />
      case 'achievement':
        return <Sparkles className="w-5 h-5 text-yellow-500" />
      default:
        return <Sparkles className="w-5 h-5 text-primary" />
    }
  }

  const getGradient = () => {
    switch (type) {
      case 'gratitude':
        return 'from-pink-50 to-rose-50 border-pink-200'
      case 'mood':
        return 'from-blue-50 to-indigo-50 border-blue-200'
      case 'achievement':
        return 'from-yellow-50 to-amber-50 border-yellow-200'
      default:
        return 'from-primary/5 to-purple-50 border-primary/20'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className={`bg-gradient-to-r ${getGradient()} border rounded-2xl p-4 shadow-lg backdrop-blur-sm`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  {message}
                </p>
                
                {action && actionLabel && (
                  <button
                    onClick={() => {
                      action()
                      setIsVisible(false)
                      setTimeout(onDismiss, 300)
                    }}
                    className="mt-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onDismiss, 300)
                }}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            {duration > 0 && (
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="mt-3 h-0.5 bg-primary/30 rounded-full"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReminderToast