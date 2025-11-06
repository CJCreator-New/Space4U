import { useState, useEffect } from 'react'
import { Crown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function PremiumDay6Banner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const firstVisit = localStorage.getItem('space4u_first_visit')
    const dismissed = localStorage.getItem('space4u_premium_banner_dismissed')
    const premium = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
    
    if (premium.isPremium) return

    if (!firstVisit) {
      localStorage.setItem('space4u_first_visit', Date.now())
      return
    }

    const daysSinceFirst = (Date.now() - parseInt(firstVisit)) / (1000 * 60 * 60 * 24)
    
    if (daysSinceFirst >= 6 && !dismissed) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('space4u_premium_banner_dismissed', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-white/80 hover:text-white btn-micro"
            >
              <X size={20} />
            </button>
            <div className="flex items-start gap-3">
              <Crown className="text-white flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-white mb-1">Unlock Premium!</h3>
                <p className="text-white/90 text-sm mb-3">
                  You've been here 6 days. Upgrade for advanced analytics, custom themes & more!
                </p>
                <button
                  onClick={() => window.location.href = '/premium'}
                  className="btn-micro px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PremiumDay6Banner
