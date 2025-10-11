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
      <nav className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50 safe-area-bottom" aria-label="Mobile navigation">
        <div className="flex justify-around px-2 py-1">
          {navItems.slice(0, 5).map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              aria-label={`Navigate to ${label} page`}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[64px] min-h-[56px] px-2 py-1 rounded-lg transition-colors active:scale-95 ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary'
                }`
              }
            >
              <Icon size={24} aria-hidden="true" strokeWidth={2} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            aria-label="Navigate to Profile page"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[56px] px-2 py-1 rounded-lg transition-colors active:scale-95 ${
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary'
              }`
            }
          >
            <User size={24} aria-hidden="true" strokeWidth={2} />
            <span className="text-[10px] mt-1 font-medium">Profile</span>
          </NavLink>
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