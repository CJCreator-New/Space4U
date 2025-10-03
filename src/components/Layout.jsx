import Navigation from './Navigation'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors">
      <div className="md:flex">
        <Navigation />
        <main className="flex-1 pb-20 md:pb-0 md:ml-64">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout