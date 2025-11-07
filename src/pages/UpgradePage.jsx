import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Crown, ArrowLeft, Check, Sparkles, Star, Shield, RefreshCw } from '../config/icons'
import { usePremium } from '../hooks/usePremium'
import { createCheckoutSession } from '../services/payments'
import { trackUpgradeStart, trackUpgradeComplete, trackUpgradeCancel } from '../services/premiumAnalytics'

function UpgradePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  // Parse URL parameters
  const params = new URLSearchParams(location.search)
  const returnTo = params.get('returnTo') || '/'
  const triggerFeature = params.get('triggerFeature')

  // Mock user - in real app this would come from auth context
  const user = { id: 'user123', email: 'user@example.com', isPremium: false }

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      period: 'month',
      popular: false,
      features: [
        'Advanced mood analytics',
        'Predictive alerts',
        'Custom themes',
        'Private groups',
        'Streak insurance'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 79.99,
      period: 'year',
      originalPrice: 119.88,
      popular: true,
      savings: '33%',
      features: [
        'All monthly features',
        'Priority support',
        'Early access to new features',
        'Export all data',
        'Advanced wellness insights'
      ]
    }
  ]

  const handleUpgrade = async (planId) => {
    setLoading(true)

    // Track upgrade start
    trackUpgradeStart(triggerFeature || 'general', planId, {
      triggerLocation: 'upgrade_page',
      returnTo: decodeURIComponent(returnTo)
    })

    try {
      // Create checkout session
      const sessionData = await createCheckoutSession({
        planId,
        userId: user.id,
        returnTo: decodeURIComponent(returnTo),
        triggerFeature
      })

      // Track upgrade completion (for demo, we'll track it here)
      const plan = plans.find(p => p.id === planId)
      trackUpgradeComplete(triggerFeature || 'general', planId, plan.price, {
        triggerLocation: 'upgrade_page',
        paymentMethod: 'demo_stripe'
      })

      // In production, redirect to payment processor
      // window.location.href = sessionData.url

      // For demo, simulate success and redirect to post-upgrade
      setTimeout(() => {
        navigate(`/post-upgrade?returnTo=${encodeURIComponent(returnTo)}&sessionId=${sessionData.sessionId}`)
      }, 2000)

    } catch (error) {
      console.error('Upgrade failed:', error)
      setLoading(false)
      // Track upgrade cancellation due to error
      trackUpgradeCancel(triggerFeature || 'general', 'payment_error', {
        error: error.message
      })
      // In real app, show error toast
      alert('Upgrade failed. Please try again.')
    }
  }

  const currentPlan = plans.find(p => p.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(decodeURIComponent(returnTo))}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown size={16} />
            Premium Upgrade
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Unlock Your Full Potential
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {triggerFeature
              ? `Get access to ${triggerFeature.replace('-', ' ')} and all premium features`
              : 'Transform your mental wellness journey with advanced analytics and insights'
            }
          </p>

          {/* Trigger Feature Highlight */}
          {triggerFeature && (
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-3 shadow-lg border border-purple-200 dark:border-purple-800">
              <Sparkles className="text-purple-500" size={20} />
              <span className="text-gray-900 dark:text-white font-medium">
                You're trying to access: <span className="text-purple-600">{triggerFeature.replace('-', ' ')}</span>
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-purple-500 shadow-purple-200 dark:shadow-purple-900/50'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <div className="text-gray-600 dark:text-gray-400">
                    <div className="text-sm">per</div>
                    <div className="text-sm">{plan.period}</div>
                  </div>
                </div>

                {plan.originalPrice && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="line-through">${plan.originalPrice}</span>
                    <span className="text-green-600 dark:text-green-400 ml-2 font-medium">
                      Save {plan.savings}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="text-green-500 flex-shrink-0" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleUpgrade(plan.id)
                }}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Processing...' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-8 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="text-green-500" size={16} />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="text-blue-500" size={16} />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={16} />
              <span>Money Back Guarantee</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500">
            By upgrading, you agree to our Terms of Service and Privacy Policy.
            Your payment information is processed securely.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UpgradePage