import { useState, useEffect } from 'react'
import { Smartphone, Bell, Download, CheckCircle } from 'lucide-react'

function PWASettings() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches)
    setNotificationsEnabled(Notification.permission === 'granted')
  }, [])

  const requestNotifications = async () => {
    const permission = await Notification.requestPermission()
    setNotificationsEnabled(permission === 'granted')
    if (permission === 'granted') {
      new Notification('Space4U', { body: 'Notifications enabled!' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="text-primary" size={32} />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">PWA Status</h3>
            <p className="text-sm text-text-secondary">
              {isInstalled ? 'Installed as app' : 'Running in browser'}
            </p>
          </div>
        </div>

        {isInstalled ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span>App is installed on your device</span>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 mb-3">
              Install Space4U for a better experience:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 mb-3">
              <li>• Faster loading times</li>
              <li>• Works offline</li>
              <li>• App-like experience</li>
              <li>• Home screen icon</li>
            </ul>
            <p className="text-xs text-blue-700">
              Look for the install button in your browser's menu or address bar
            </p>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="text-primary" size={24} />
            <div>
              <h3 className="font-semibold text-text-primary">Push Notifications</h3>
              <p className="text-sm text-text-secondary">Get reminders and updates</p>
            </div>
          </div>
          {notificationsEnabled ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <button
              onClick={requestNotifications}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90"
            >
              Enable
            </button>
          )}
        </div>

        {notificationsEnabled && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked className="rounded" />
              Mood check-in reminders
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked className="rounded" />
              Medication reminders
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked className="rounded" />
              Habit reminders
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              Community updates
            </label>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">PWA Features</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">Offline functionality</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">Background sync</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">Add to home screen</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">Fast loading</span>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <h4 className="font-semibold text-purple-900 mb-2">📱 Install Instructions</h4>
        <div className="text-sm text-purple-800 space-y-2">
          <p><strong>Chrome/Edge:</strong> Click the install icon in the address bar</p>
          <p><strong>Safari (iOS):</strong> Tap Share → Add to Home Screen</p>
          <p><strong>Firefox:</strong> Menu → Install</p>
        </div>
      </div>
    </div>
  )
}

export default PWASettings
