import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lightbulb } from 'lucide-react'

const tips = {
  home: {
    title: "Welcome to Your Safe Space",
    content: "Track your mood daily, explore wellness tools, and connect with supportive communities.",
    action: "Got it"
  },
  circles: {
    title: "Join Support Circles",
    content: "Find communities that understand your journey. All interactions are anonymous and supportive.",
    action: "Explore Circles"
  },
  insights: {
    title: "Track Your Progress",
    content: "View your mood patterns, streaks, and wellness insights to understand your mental health journey.",
    action: "View Insights"
  },
  profile: {
    title: "Your Anonymous Profile",
    content: "Customize your avatar and track achievements while staying completely anonymous.",
    action: "Customize"
  },
  resources: {
    title: "Wellness Resources",
    content: "Access breathing exercises, meditations, articles, and crisis support anytime you need.",
    action: "Explore"
  }
}

export default function OnboardingTip({ page }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = JSON.parse(localStorage.getItem('safespace_tips_dismissed') || '{}')
    if (!dismissed[page]) {
      setTimeout(() => setIsVisible(true), 1000)
    } else {
      setIsDismissed(true)
    }
  }, [page])

  const handleDismiss = () => {
    const dismissed = JSON.parse(localStorage.getItem('safespace_tips_dismissed') || '{}')
    dismissed[page] = true
    localStorage.setItem('safespace_tips_dismissed', JSON.stringify(dismissed))
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (isDismissed || !tips[page]) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Lightbulb size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{tips[page].title}</h3>
                <p className="text-sm text-white/90 mb-3">{tips[page].content}</p>
                <button
                  onClick={handleDismiss}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  {tips[page].action}
                </button>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
