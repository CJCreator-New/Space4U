import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Megaphone } from 'lucide-react'

const announcements = [
  {
    id: 1,
    message: "🎉 New Feature: AI-powered mood predictions now available in Analytics!",
    type: "feature",
    link: "/analytics"
  },
  {
    id: 2,
    message: "💪 Join our 7-Day Wellness Challenge starting tomorrow!",
    type: "event",
    link: "/gamification"
  }
]

export default function AnnouncementBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || announcements.length === 0) return null

  const announcement = announcements[currentIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-4 mb-6 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Megaphone size={20} className="flex-shrink-0" />
            <p className="text-sm font-medium">{announcement.message}</p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
