import { useState, useEffect } from 'react'
import { Shield, Palette, TrendingUp, AlertTriangle, Users, Crown, BarChart3, Sparkles, Calendar, Award, Zap, Lock, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'
import StreakInsurance from '../components/premium/StreakInsurance'
import CustomThemes from '../components/premium/CustomThemes'
import WellnessBreakdown from '../components/premium/WellnessBreakdown'
import PredictiveAlerts from '../components/premium/PredictiveAlerts'
import PrivateGroups from '../components/premium/PrivateGroups'
import AnalyticsTiles from '../components/premium/AnalyticsTiles'
import { getPremiumStatus } from '../utils/premiumUtils'

function PremiumFeaturesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('analytics') // Changed default to analytics
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock user object - in real app this would come from context/auth
  const user = { isPremium }

  useEffect(() => {
    try {
      const { isPremium: premium, trialActive, trialEndsAt, planType } = getPremiumStatus()
      setIsPremium(premium)
    } catch (err) {
      console.error('Error loading premium status:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="text-center py-12">
          <div className="text-text-secondary">Loading...</div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'streak', label: 'Streak Insurance', icon: Shield },
    { id: 'themes', label: 'Custom Themes', icon: Palette },
    { id: 'wellness', label: 'Wellness Breakdown', icon: TrendingUp },
    { id: 'alerts', label: 'Predictive Alerts', icon: AlertTriangle },
    { id: 'groups', label: 'Private Groups', icon: Users }
  ]

  if (!isPremium) {
    return (
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-8 text-center">
          <Crown size={64} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Premium Features</h1>
          <p className="text-lg opacity-90 mb-6">Unlock exclusive tools to enhance your mental wellness journey</p>
          <button
            onClick={() => navigate('/premium')}
            className="px-8 py-3 bg-white text-orange-500 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {[
            { icon: Shield, title: 'Streak Insurance', desc: '2 free streak freezes per month' },
            { icon: Palette, title: 'Custom Themes', desc: '8 beautiful color themes' },
            { icon: TrendingUp, title: 'Wellness Breakdown', desc: 'Detailed wellness analytics' },
            { icon: AlertTriangle, title: 'Predictive Alerts', desc: 'AI-powered mood forecasting' },
            { icon: Users, title: 'Private Groups', desc: 'Create invite-only circles' }
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="bg-surface rounded-xl p-6">
                <Icon className="text-primary mb-3" size={32} />
                <h3 className="font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
  const trialDaysLeft = premiumData.trialEndsAt 
    ? Math.ceil((new Date(premiumData.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      {/* Premium Status Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Crown size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Premium Member</h1>
              <p className="text-white/90">
                {premiumData.trialActive 
                  ? `${trialDaysLeft} days left in trial • ${premiumData.planType === 'annual' ? 'Annual' : 'Monthly'} plan`
                  : `${premiumData.planType === 'annual' ? 'Annual' : 'Monthly'} plan • Active`
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-colors"
          >
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Sparkles, label: 'Features Unlocked', value: '8', color: 'text-yellow-500' },
          { icon: Calendar, label: 'Days Active', value: Math.ceil((new Date() - new Date(premiumData.subscribedAt || Date.now())) / (1000 * 60 * 60 * 24)), color: 'text-blue-500' },
          { icon: Award, label: 'Premium Badges', value: '3', color: 'text-purple-500' },
          { icon: Zap, label: 'Features Used', value: '5', color: 'text-green-500' }
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="card p-4">
              <Icon className={`${stat.color} mb-2`} size={24} />
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-secondary">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Feature Categories */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Your Premium Features</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg scale-105'
                    : 'bg-surface text-text-secondary hover:text-text-primary hover:shadow-md'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {activeTab === tab.id && <CheckCircle size={16} />}
              </button>
            )
          })}
        </div>
      </div>

      <SafeComponent>
        <div>
          {activeTab === 'analytics' && <AnalyticsTiles user={user} />}
          {activeTab === 'streak' && <StreakInsurance />}
          {activeTab === 'themes' && <CustomThemes />}
          {activeTab === 'wellness' && <WellnessBreakdown />}
          {activeTab === 'alerts' && <PredictiveAlerts />}
          {activeTab === 'groups' && <PrivateGroups />}
        </div>
      </SafeComponent>
    </div>
  )
}

export default PremiumFeaturesPage

