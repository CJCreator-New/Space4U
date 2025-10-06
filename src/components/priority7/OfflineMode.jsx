import { useState, useEffect } from 'react'
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react'

function OfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncQueue, setSyncQueue] = useState([])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const saved = localStorage.getItem('safespace_sync_queue')
    if (saved) setSyncQueue(JSON.parse(saved))

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const clearQueue = () => {
    setSyncQueue([])
    localStorage.removeItem('safespace_sync_queue')
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex items-center gap-3 mb-3">
          {isOnline ? <Wifi className="text-green-600" size={32} /> : <WifiOff className="text-orange-600" size={32} />}
          <div>
            <h3 className="text-lg font-semibold">{isOnline ? 'Online' : 'Offline'}</h3>
            <p className="text-sm">{isOnline ? 'Connected to the internet' : 'Working offline'}</p>
          </div>
        </div>
        {!isOnline && (
          <p className="text-sm text-orange-800">
            Your data is being saved locally and will sync when you're back online.
          </p>
        )}
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Offline Features</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">Mood tracking works offline</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">All tools accessible offline</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">Data saved to local storage</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-text-primary">Auto-sync when online</span>
          </div>
        </div>
      </div>

      {syncQueue.length > 0 && (
        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Sync Queue</h3>
            <button
              onClick={clearQueue}
              className="text-sm text-primary hover:underline"
            >
              Clear Queue
            </button>
          </div>
          <div className="space-y-2">
            {syncQueue.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-xl">
                <AlertCircle className="text-orange-500" size={18} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{item.table}</p>
                  <p className="text-xs text-text-secondary">{item.operation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">📱 Offline Mode</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All features work without internet</li>
          <li>• Data syncs automatically when online</li>
          <li>• Crisis resources cached for offline access</li>
          <li>• No data loss during offline periods</li>
        </ul>
      </div>
    </div>
  )
}

export default OfflineMode
