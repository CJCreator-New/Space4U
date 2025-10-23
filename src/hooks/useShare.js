import { useState } from 'react'

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)

  const share = async ({ title, text, url, files }) => {
    setIsSharing(true)
    
    try {
      if (window.Capacitor) {
        const { Share } = await import('@capacitor/share')
        await Share.share({
          title,
          text,
          url,
          dialogTitle: 'Share with'
        })
        return { success: true }
      } else if (navigator.share) {
        await navigator.share({ title, text, url, files })
        return { success: true }
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url || text)
        return { success: true, fallback: 'clipboard' }
      }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsSharing(false)
    }
  }

  const canShare = () => {
    return !!(window.Capacitor || navigator.share)
  }

  return { share, isSharing, canShare }
}
