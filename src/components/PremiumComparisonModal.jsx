import { Check, X as XIcon, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const features = [
  { name: 'Mood Tracking', free: true, premium: true },
  { name: 'Basic Analytics', free: true, premium: true },
  { name: 'Community Circles', free: true, premium: true },
  { name: 'Advanced Analytics', free: false, premium: true },
  { name: 'Custom Themes', free: false, premium: true },
  { name: 'Wellness Breakdown', free: false, premium: true },
  { name: 'Predictive Alerts', free: false, premium: true },
  { name: 'Streak Insurance', free: false, premium: true },
  { name: 'Priority Support', free: false, premium: true },
  { name: 'Ad-Free Experience', free: false, premium: true }
]

function PremiumComparisonModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Free vs Premium</h2>
              <button onClick={onClose} className="btn-micro p-2">
                <XIcon size={24} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Free</th>
                    <th className="text-center py-3 px-4 bg-yellow-50">
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="text-yellow-600" size={20} />
                        <span>Premium</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{feature.name}</td>
                      <td className="text-center py-3 px-4">
                        {feature.free ? (
                          <Check className="text-green-500 mx-auto" size={20} />
                        ) : (
                          <XIcon className="text-gray-300 mx-auto" size={20} />
                        )}
                      </td>
                      <td className="text-center py-3 px-4 bg-yellow-50">
                        <Check className="text-green-500 mx-auto" size={20} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-white">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold">$4.99/month</div>
                <div className="text-sm opacity-90">or $49.99/year (save 17%)</div>
              </div>
              <button
                onClick={() => window.location.href = '/premium'}
                className="btn-micro w-full py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-100"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PremiumComparisonModal
