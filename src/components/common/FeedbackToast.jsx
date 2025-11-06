import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

export default function FeedbackToast({ message, type = 'info', isVisible, onClose }) {
  const Icon = icons[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`${colors[type]} border rounded-xl shadow-lg p-4 flex items-center gap-3`}>
            <Icon size={20} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for easy toast usage
export function useFeedback() {
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' })

  const showFeedback = (message, type = 'info', duration = 3000) => {
    setToast({ isVisible: true, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), duration)
  }

  return { toast, showFeedback }
}
