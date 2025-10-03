import { WifiOff, Wifi } from 'lucide-react'
import { usePWA } from '../hooks/usePWA'

function OfflineBanner() {
  const { isOnline } = usePWA()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium z-50">
      <div className="flex items-center justify-center gap-2">
        <WifiOff size={16} />
        <span>You're offline. Your data will sync when you reconnect.</span>
      </div>
    </div>
  )
}

export default OfflineBanner