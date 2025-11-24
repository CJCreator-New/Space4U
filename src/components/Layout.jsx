import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import NotificationCenter from './NotificationCenter'
import LanguageSwitcher from './LanguageSwitcher'
import CrisisSupport from './CrisisSupport'

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
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