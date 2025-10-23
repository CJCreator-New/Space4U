import { useEffect, useState } from 'react'
import { SplashScreen as CapacitorSplash } from '@capacitor/splash-screen'

function SplashScreen({ duration = 2000, onComplete }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      CapacitorSplash.hide()
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center">
      <div className="animate-scaleIn">
        <div className="text-8xl mb-4 animate-bounce">🧠</div>
        <h1 className="text-4xl font-bold text-white text-center mb-2">Space4U</h1>
        <p className="text-white/80 text-center">Your mental wellness companion</p>
        <div className="mt-8 flex justify-center">
          <div className="spinner border-white/30 border-t-white" />
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
