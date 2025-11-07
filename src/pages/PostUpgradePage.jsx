import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Sparkles, Star, ArrowRight, Heart, X } from '../config/icons'
import { validatePaymentSession } from '../services/payments'
import { CelebrationBanner, CelebrationAnimation } from '../components/premium/FeedbackComponents'

function PostUpgradePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Parse URL parameters
  const params = new URLSearchParams(location.search)
  const returnTo = params.get('returnTo') || '/'
  const sessionId = params.get('sessionId')

  useEffect(() => {
    const validateAndCompleteUpgrade = async () => {
      try {
        // In a real app, validate the payment session with your backend
        // For demo purposes, we'll simulate the validation

        if (sessionId) {
          // Validate payment session
          const result = await validatePaymentSession(sessionId)

          // Update local user state (in real app, this would be handled by auth context)
          localStorage.setItem('space4u_premium', JSON.stringify({
            isPremium: true,
            upgradedAt: result.upgradedAt,
            planId: result.planId
          }))

          // Show celebration animation first
          setShowCelebration(true)

          // Then show success animation
          setTimeout(() => setShowAnimation(true), 500)

          // Redirect after celebration
          setTimeout(() => {
            navigate(decodeURIComponent(returnTo))
          }, 4000)
        } else {
          // Demo mode - simulate success
          setTimeout(() => {
            setShowCelebration(true)
            setTimeout(() => setShowAnimation(true), 500)
            setTimeout(() => {
              navigate(decodeURIComponent(returnTo))
            }, 4000)
          }, 1000)
        }
      } catch (err) {
        console.error('Upgrade validation failed:', err)
        setError('Failed to validate upgrade. Please contact support.')
      } finally {
        setLoading(false)
      }
    }

    validateAndCompleteUpgrade()
  }, [sessionId, returnTo, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Processing Your Upgrade
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we activate your premium features...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Upgrade Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/upgrade')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
      {/* Full-screen celebration animation */}
      {showCelebration && (
        <CelebrationAnimation onComplete={() => setShowCelebration(false)} />
      )}

      {/* Celebration Banner */}
      {showAnimation && (
        <CelebrationBanner
          onClose={() => {}}
          autoClose={false}
        />
      )}

      <div className="max-w-2xl mx-auto text-center">
        {/* Success Animation */}
        <div className={`transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Animated background elements */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-20"></div>
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main success icon */}
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Success message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome to Premium! 🎉
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your upgrade was successful! You now have access to all premium features.
            </p>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Sparkles, title: 'Advanced Analytics', desc: 'Deep insights into your wellness' },
                { icon: Star, title: 'Premium Features', desc: 'All tools unlocked' },
                { icon: Heart, title: 'Priority Support', desc: 'Get help when you need it' }
              ].map((item, index) => (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
                  <item.icon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Return to app */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Taking you back to your content...
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <span>Auto-redirecting in a few seconds</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <button
              onClick={() => navigate(decodeURIComponent(returnTo))}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Continue to Your Content
            </button>
          </div>
        </div>

        {/* Floating celebration elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-purple-400 opacity-60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostUpgradePage