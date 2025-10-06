import { useState } from 'react'
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle, X } from 'lucide-react'
import { checkPremiumStatus, cancelPremium, getPremiumDaysLeft } from '../utils/premiumManager'
import { useNavigate } from 'react-router-dom'

function PremiumManagePage() {
  const navigate = useNavigate()
  const premium = checkPremiumStatus()
  const [showCancelModal, setShowCancelModal] = useState(false)

  if (!premium.isPremium && !premium.trialActive) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2">No Active Subscription</h1>
        <p className="text-text-secondary mb-6">Upgrade to Premium to access this page</p>
        <button
          onClick={() => navigate('/premium')}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
        >
          View Premium Plans
        </button>
      </div>
    )
  }

  const daysLeft = getPremiumDaysLeft()

  const handleCancel = () => {
    cancelPremium()
    setShowCancelModal(false)
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Manage Subscription</h1>

      {/* Status Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown size={32} />
          <div>
            <h2 className="text-xl font-bold">
              {premium.trialActive ? 'Free Trial Active' : 'Premium Active'}
            </h2>
            <p className="opacity-90">
              {premium.planType === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </p>
          </div>
        </div>
        {premium.trialActive && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="font-medium mb-1">Trial ends in {daysLeft} days</p>
            <p className="text-sm opacity-90">
              You'll be charged on {new Date(premium.nextBillingDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-surface rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-text-primary mb-4">Your Premium Features</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Unlimited mood history',
            'Advanced AI insights',
            'Mood prediction',
            'Group therapy sessions',
            'Priority support',
            'Ad-free experience',
            'Custom mood scales',
            'Detailed data export',
            'Therapist portal access',
            'Voice journaling'
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing */}
      <div className="bg-surface rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="text-primary" size={24} />
          <h3 className="font-semibold text-text-primary">Billing Information</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-secondary">Plan</span>
            <span className="font-medium">
              {premium.planType === 'annual' ? '₹2,999/year' : '₹299/month'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Next billing date</span>
            <span className="font-medium">
              {new Date(premium.nextBillingDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Payment method</span>
            <span className="font-medium">•••• 4242</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/premium')}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
        >
          {premium.planType === 'monthly' ? 'Upgrade to Annual' : 'View Plans'}
        </button>
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full py-3 border border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50"
        >
          Cancel Subscription
        </button>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Cancel Subscription?</h3>
              <button onClick={() => setShowCancelModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl mb-4">
                <AlertCircle className="text-orange-600 flex-shrink-0" size={20} />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">You'll lose access to:</p>
                  <ul className="space-y-1">
                    <li>• Unlimited mood history</li>
                    <li>• AI predictions & insights</li>
                    <li>• Group therapy sessions</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                Your subscription will remain active until {new Date(premium.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
              >
                Keep Premium
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumManagePage
