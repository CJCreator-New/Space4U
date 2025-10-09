import { useEffect, useState } from 'react'

function LiveRegion() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Listen for custom events to announce messages
    const handleAnnounce = (e) => {
      setMessage(e.detail.message)
      // Clear after announcement
      setTimeout(() => setMessage(''), 100)
    }

    window.addEventListener('announce', handleAnnounce)
    return () => window.removeEventListener('announce', handleAnnounce)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Helper function to announce messages
export function announce(message) {
  window.dispatchEvent(new CustomEvent('announce', { detail: { message } }))
}

export default LiveRegion
