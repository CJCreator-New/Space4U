import { useState } from 'react'
import { Shield, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '../utils/toast'

function StreakInsurance({ currentStreak, onUseFreeze }) {
  const [showModal, setShowModal] = useState(false)
  const freezesUsed = parseInt(localStorage.getItem('space4u_freezes_used') || '0')
  const freezesAvailable = 2 - freezesUsed
  const lastReset = localStorage.getItem('space4u_freeze_reset')
  
  // Reset monthly
  const now = new Date()
  if (!lastReset || new Date(lastReset).getMonth() !== now.getMonth()) {
    localStorage.setItem('space4u_freezes_used', '0')
    localStorage.setItem('space4u_freeze_reset', now.toISOString())
  }

  const handleUseFreeze = () => {
    if (freezesAvailable <= 0) {
      toast.warning('No freezes available this month')
      return
    }
    
    localStorage.setItem('space4u_freezes_used', (freezesUsed + 1).toString())
    localStorage.setItem('space4u_last_freeze', new Date().toISOString())
    
    if (onUseFreeze) onUseFreeze()
    setShowModal(false)
    toast.success('Streak freeze activated! 🛡️')
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-micro flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
      >
        <Shield size={16} />
        <span className="text-sm">Freeze ({freezesAvailable}/2)</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="text-blue-600" />
                  Streak Insurance
                </h3>
                <button onClick={() => setShowModal(false)} className="btn-micro p-2">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Protect your {currentStreak}-day streak! Use a freeze to maintain your streak even if you miss a day.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Available this month:</span>
                    <span className="text-2xl font-bold text-blue-600">{freezesAvailable}/2</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Resets on the 1st of each month
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>Protects your streak for 24 hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>Premium members get 2 freezes per month</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>Use wisely - they don't carry over!</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUseFreeze}
                  disabled={freezesAvailable <= 0}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use Freeze
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default StreakInsurance
