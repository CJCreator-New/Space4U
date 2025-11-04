import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('space4u_welcome_dismissed')
    const user = JSON.parse(localStorage.getItem('space4u_user') || '{}')
    const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
    
    // Show if not dismissed and user is new (less than 3 mood logs)
    if (!dismissed && Object.keys(moods).length < 3) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('space4u_welcome_dismissed', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Dismiss welcome banner"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Welcome to Space4U!</h3>
              <p className="text-white/90 mb-4">
                Start your wellness journey by logging your first mood. Track patterns, 
                join supportive circles, and discover tools that help.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  100% Private
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  No Judgment
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  Supportive Community
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

