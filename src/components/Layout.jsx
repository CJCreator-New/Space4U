import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

function Layout() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      
      <div className="md:flex">
        <Navigation />
        <main id="main-content" className="flex-1 pb-20 md:pb-0 md:ml-64">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout