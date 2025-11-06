import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Users, Calendar, ArrowRight } from 'lucide-react'

const trendingPosts = [
  { id: 1, title: "How I overcame anxiety", circle: "Anxiety Support", engagement: 234 },
  { id: 2, title: "Daily gratitude practice changed my life", circle: "Wellness", engagement: 189 },
  { id: 3, title: "Finding hope after depression", circle: "Depression Support", engagement: 156 },
]

const upcomingEvents = [
  { id: 1, title: "Mindfulness Meditation Session", time: "Today, 6:00 PM", participants: 45 },
  { id: 2, title: "Anxiety Management Workshop", time: "Tomorrow, 3:00 PM", participants: 32 },
]

const recommendedCircles = [
  { id: 1, name: "Anxiety Support", members: 1234, emoji: "🌊" },
  { id: 2, name: "Self-Care Warriors", members: 892, emoji: "💪" },
  { id: 3, name: "Mindfulness Practice", members: 756, emoji: "🧘" },
]

export default function TrendingContent() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-500" size={24} />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Trending Posts</h3>
        </div>
        <div className="space-y-3">
          {trendingPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ x: 4 }}
              onClick={() => navigate('/circles')}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-all"
            >
              <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{post.title}</p>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{post.circle}</span>
                <span>❤️ {post.engagement}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <button
          onClick={() => navigate('/circles')}
          className="mt-4 w-full py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          View All <ArrowRight size={14} />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-500" size={24} />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Upcoming Events</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ x: 4 }}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-all"
            >
              <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{event.title}</p>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{event.time}</span>
                <span>👥 {event.participants}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <button
          onClick={() => navigate('/social')}
          className="mt-4 w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          View Calendar <ArrowRight size={14} />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-purple-500" size={24} />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recommended Circles</h3>
        </div>
        <div className="space-y-3">
          {recommendedCircles.map((circle, idx) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ x: 4 }}
              onClick={() => navigate('/circles')}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{circle.emoji}</span>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{circle.name}</p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 ml-9">{circle.members.toLocaleString()} members</p>
            </motion.div>
          ))}
        </div>
        <button
          onClick={() => navigate('/circles')}
          className="mt-4 w-full py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          Explore All <ArrowRight size={14} />
        </button>
      </motion.div>
    </div>
  )
}
