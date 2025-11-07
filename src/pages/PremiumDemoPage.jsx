import { useState } from 'react'
import { PremiumGate } from '../components/premium/PremiumGate'
import AnalyticsTiles from '../components/premium/AnalyticsTiles'
import { usePremium } from '../hooks/usePremium'

function PremiumDemoPage() {
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const user = { isPremium: isPremiumUser }
  const { isPremium, requestUpgrade } = usePremium(user)

  const togglePremium = () => {
    setIsPremiumUser(!isPremiumUser)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Premium Features Demo
        </h1>

        {/* User toggle */}
        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPremiumUser}
              onChange={togglePremium}
              className="w-4 h-4 text-primary"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Simulate Premium User
            </span>
          </label>
          <div className="text-sm text-gray-500">
            Current status: {isPremium ? 'Premium' : 'Free'}
          </div>
        </div>
      </div>

      {/* Analytics Tiles Demo */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h2>
        <AnalyticsTiles user={user} />
      </div>

      {/* Individual Premium Gate Examples */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Premium Gate Examples
          </h3>

          {/* Example 1: Simple text content */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Advanced Analytics Report
            </h4>
            <PremiumGate
              user={user}
              featureKey="advanced-analytics"
              benefitText="Unlock detailed mood analytics and personalized insights"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  Your mood patterns show a 15% improvement trend over the last 30 days.
                  Peak happiness occurs on Wednesdays, and stress levels are lowest in the mornings.
                </p>
              </div>
            </PremiumGate>
          </div>

          {/* Example 2: Interactive component */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Predictive Mood Forecasting
            </h4>
            <PremiumGate
              user={user}
              featureKey="predictive-alerts"
              benefitText="Get AI-powered notifications about your mental wellness"
            >
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    Prediction: High energy day tomorrow
                  </span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Based on your sleep patterns and recent activity, expect improved focus and motivation.
                </p>
              </div>
            </PremiumGate>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Feature Registry Info
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              This demo uses a centralized feature registry that defines all premium features,
              their categories, and benefit descriptions.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Dynamic UI rendering based on user.isPremium</li>
              <li>• Consistent upgrade flow with return-to context</li>
              <li>• Backend-ready feature keys for API enforcement</li>
              <li>• Analytics-ready event tracking</li>
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Try the Upgrade Flow
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Click any premium feature above while not being a premium user to see the upgrade flow.
            </p>
            <button
              onClick={() => requestUpgrade('demo-feature')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Test Upgrade Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumDemoPage