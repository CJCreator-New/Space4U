import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ComparisonTable() {
  const features = [
    { name: 'Mood Tracking', free: true, premium: true },
    { name: 'Daily Check-ins', free: true, premium: true },
    { name: 'Basic Analytics', free: true, premium: true },
    { name: 'Join Circles', free: '3 circles', premium: 'Unlimited' },
    { name: 'Gratitude Journal', free: '10 entries', premium: 'Unlimited' },
    { name: 'Advanced Analytics', free: false, premium: true },
    { name: 'Mood Predictions', free: false, premium: true },
    { name: 'Custom Themes', free: false, premium: true },
    { name: 'Priority Support', free: false, premium: true },
    { name: 'Data Export', free: 'JSON', premium: 'JSON, PDF, CSV' },
    { name: 'Offline Mode', free: false, premium: true },
    { name: 'Private Groups', free: false, premium: true }
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
        <div className="p-4" />
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-900">Free</h3>
          <p className="text-sm text-gray-600">$0/month</p>
        </div>
        <div className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="font-semibold text-purple-900">Premium</h3>
          <p className="text-sm text-purple-700">$9.99/month</p>
        </div>
      </div>

      {features.map((feature, index) => (
        <motion.div
          key={feature.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="grid grid-cols-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="p-4 font-medium text-gray-900">{feature.name}</div>
          <div className="p-4 text-center">
            {renderFeatureValue(feature.free)}
          </div>
          <div className="p-4 text-center bg-purple-50/30">
            {renderFeatureValue(feature.premium)}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const renderFeatureValue = (value) => {
  if (value === true) {
    return <Check className="inline text-green-600" size={20} />
  }
  if (value === false) {
    return <X className="inline text-gray-300" size={20} />
  }
  return <span className="text-sm text-gray-700">{value}</span>
}
