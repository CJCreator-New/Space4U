import { useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { usePWA } from '../hooks/usePWA'

function InstallPrompt() {
  const { isInstallable, installApp } = usePWA()
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('install_prompt_dismissed') === 'true'
  })

  if (!isInstallable || isDismissed) {
    return null
  }

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      setIsDismissed(true)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('install_prompt_dismissed', 'true')
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Smartphone className="text-primary dark:text-primary-light" size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary dark:text-white text-sm mb-1">
              Install Space4U
            </h3>
            <p className="text-text-secondary dark:text-gray-300 text-xs mb-3">
              Add to your home screen for quick access and offline support
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary dark:bg-primary-light text-white rounded-lg text-xs font-medium hover:bg-primary/90 dark:hover:bg-primary-light/90 transition-colors"
              >
                <Download size={14} />
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white text-xs transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt