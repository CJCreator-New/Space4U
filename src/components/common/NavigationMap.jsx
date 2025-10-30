import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Users, Brain, Heart, Book, Settings, TrendingUp, Award } from 'lucide-react'

const navigationMap = [
  {
    id: 'home',
    icon: Home,
    label: 'Home',
    path: '/',
    description: 'Dashboard & quick actions',
    connections: ['circles', 'insights', 'resources']
  },
  {
    id: 'circles',
    icon: Users,
    label: 'Circles',
    path: '/circles',
    description: 'Support communities',
    connections: ['home', 'profile']
  },
  {
    id: 'insights',
    icon: Brain,
    label: 'Insights',
    path: '/insights',
    description: 'Mood analytics',
    connections: ['home', 'analytics']
  },
  {
    id: 'resources',
    icon: Book,
    label: 'Resources',
    path: '/resources',
    description: 'Wellness tools',
    connections: ['home', 'tools']
  },
  {
    id: 'profile',
    icon: Award,
    label: 'Profile',
    path: '/profile',
    description: 'Your progress',
    connections: ['settings', 'circles']
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    description: 'Preferences',
    connections: ['profile']
  }
]

export default function NavigationMap({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!isOpen) return null

  const currentPage = navigationMap.find(item => item.path === location.pathname)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Navigation Map</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {navigationMap.map((item) => {
            const Icon = item.icon
            const isCurrent = item.path === location.pathname
            const isConnected = currentPage?.connections.includes(item.id)

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate(item.path)
                  onClose()
                }}
                className={`p-4 rounded-xl text-left transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg'
                    : isConnected
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-700'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Icon size={24} className="mb-2" />
                <h3 className="font-semibold mb-1">{item.label}</h3>
                <p className={`text-xs ${isCurrent ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                  {item.description}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Tip:</strong> Highlighted cards show pages connected to your current location.
            Click any card to navigate instantly.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
