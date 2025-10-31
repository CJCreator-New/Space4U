import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'
import { trackEvent, EVENTS } from '../../utils/analytics'

export default function BookmarkButton({ toolId, size = 20 }) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('space4u_bookmarked_tools') || '[]')
    setBookmarked(saved.includes(toolId))
  }, [toolId])

  const handleToggle = (e) => {
    e.stopPropagation()
    
    const saved = JSON.parse(localStorage.getItem('space4u_bookmarked_tools') || '[]')
    const updated = bookmarked
      ? saved.filter(id => id !== toolId)
      : [...saved, toolId]
    
    localStorage.setItem('space4u_bookmarked_tools', JSON.stringify(updated))
    setBookmarked(!bookmarked)
    
    trackEvent(EVENTS.TOOL_BOOKMARKED, { toolId, bookmarked: !bookmarked })
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors ${
        bookmarked 
          ? 'bg-yellow-100 text-yellow-600' 
          : 'bg-gray-100 text-gray-400 hover:text-gray-600'
      }`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark size={size} fill={bookmarked ? 'currentColor' : 'none'} />
    </motion.button>
  )
}

