import { NavLink } from 'react-router-dom'
import { Home, Users, Brain, User, Activity, Heart, Sparkles, Building2, LogOut, LogIn } from 'lucide-react'
import { useSupabaseAuth } from '../contexts/AuthContext'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/circles', icon: Users, label: 'Circles' },
  { path: '/insights', icon: Brain, label: 'Insights' },
  { path: '/gratitude', icon: Heart, label: 'Gratitude' },
  { path: '/tools', icon: Activity, label: 'Tools' },
  { path: '/analytics', icon: Sparkles, label: 'Analytics' },
  { path: '/professional', icon: Building2, label: 'Professional' },
  { path: '/profile', icon: User, label: 'Profile' },
]

function Navigation() {
  const { user, signOut } = useSupabaseAuth()

  const handleLogout = async () => {
    await signOut()
  }
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50" aria-label="Mobile navigation">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 6).map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              aria-label={`Navigate to ${label} page`}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              <Icon size={24} aria-hidden="true" />
              <span className="text-xs mt-1">{label}</span>
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
            >
              <LogOut size={24} aria-hidden="true" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          ) : (
            <NavLink
              to="/auth"
              aria-label="Login or Sign Up"
              className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
            >
              <LogIn size={24} aria-hidden="true" />
              <span className="text-xs mt-1">Login</span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-64 bg-surface dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50" aria-label="Main navigation">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-8">Safespace</h1>
          <div className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                aria-label={`Navigate to ${label} page`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                    isActive
                      ? 'bg-primary dark:bg-primary-light text-white'
                      : 'text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Icon size={20} aria-hidden="true" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                aria-label="Logout"
              >
                <LogOut size={20} aria-hidden="true" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <NavLink
                to="/auth"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Login or Sign Up"
              >
                <LogIn size={20} aria-hidden="true" />
                <span className="font-medium">Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation