import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, TrendingUp, User, Settings, Menu, X } from 'lucide-react'
import { useCapacitor } from '../../hooks/useCapacitor'
import MobileOptimizedButton from './MobileOptimizedButton'

function MobileNavigation() {
  const { hapticFeedback } = useCapacitor()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/circles', icon: Users, label: 'Circles' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  const handleNavClick = async () => {
    await hapticFeedback()
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 4).map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 min-w-[60px] ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`
              }
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </NavLink>
          ))}
          
          <MobileOptimizedButton
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center py-2 px-3 min-w-[60px] text-gray-500"
          >
            <Menu size={24} />
            <span className="text-xs mt-1">More</span>
          </MobileOptimizedButton>
        </div>
      </nav>

      {/* Slide-up Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 safe-area-pb">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Menu</h3>
              <MobileOptimizedButton
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={24} />
              </MobileOptimizedButton>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { path: '/gratitude', label: 'Gratitude', icon: '🙏' },
                { path: '/habits', label: 'Habits', icon: '✅' },
                { path: '/emotions', label: 'Emotions', icon: '😊' },
                { path: '/coping-skills', label: 'Coping', icon: '🛠️' },
                { path: '/reminders', label: 'Reminders', icon: '⏰' },
                { path: '/wellness', label: 'Wellness', icon: '💚' },
                { path: '/resources', label: 'Resources', icon: '📚' },
                { path: '/premium', label: 'Premium', icon: '👑' }
              ].map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={handleNavClick}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <span className="text-2xl mr-3">{icon}</span>
                  <span className="font-medium">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavigation