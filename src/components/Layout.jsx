import { Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import CrisisSupport from './CrisisSupport'
import { useFeatureFlag } from '../config/featureFlags'
import { ModernLayout } from './modern/ModernLayout'
import PageLoader from './common/PageLoader'

// Lazy load heavy components
const Navigation = lazy(() => import('./Navigation'))
const LanguageSwitcher = lazy(() => import('./LanguageSwitcher'))
const NotificationCenter = lazy(() => import('./NotificationCenter'))

function Layout() {
  const useModernUI = useFeatureFlag('ENABLE_MODERN_UI');

  if (useModernUI) {
    return <ModernLayout />;
  }

  // Legacy implementation
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      
      <div className="md:flex">
        <Suspense fallback={<div className="w-64 bg-surface animate-pulse" />}>
          <Navigation />
        </Suspense>
        <main id="main-content" className="flex-1 pb-20 md:pb-0 md:ml-64">
          <div className="p-4 md:p-6">
            <div className="flex justify-end items-center gap-3 mb-4">
              <Suspense fallback={<div className="w-8 h-8 bg-surface animate-pulse rounded-full" />}>
                <NotificationCenter />
              </Suspense>
              <Suspense fallback={<div className="w-20 h-8 bg-surface animate-pulse rounded" />}>
                <LanguageSwitcher />
              </Suspense>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Crisis Support - Always Available */}
      <CrisisSupport />
    </div>
  )
}

export default Layout