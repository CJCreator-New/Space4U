import { NavLink } from 'react-router-dom'
import { Home, Users, Brain, User } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/circles', icon: Users, label: 'Circles' },
  { path: '/insights', icon: Brain, label: 'Insights' },
  { path: '/profile', icon: User, label: 'Profile' },
]

function Navigation() {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-64 bg-surface dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-8">Safespace</h1>
          <div className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                    isActive
                      ? 'bg-primary dark:bg-primary-light text-white'
                      : 'text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation