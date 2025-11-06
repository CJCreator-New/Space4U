import { useState } from 'react'
import { Menu, X, Home, Users, Brain, User, Settings, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Circles', path: '/circles' },
    { icon: Brain, label: 'Insights', path: '/insights' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ]

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden btn-micro p-3 min-h-[48px] min-w-[48px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold text-primary">Space4U</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-micro p-2 min-h-[48px] min-w-[48px]"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={`btn-micro w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors min-h-[48px] ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </nav>

                {/* Premium CTA */}
                <div className="p-4 border-t">
                  <button
                    onClick={() => handleNavigate('/premium')}
                    className="btn-micro w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium min-h-[48px]"
                  >
                    <Crown size={20} />
                    <span>Upgrade to Premium</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileMenu
