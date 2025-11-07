import { useState, useEffect } from 'react'
import { Shield, Palette, TrendingUp, AlertTriangle, Users, Crown, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'
import StreakInsurance from '../components/premium/StreakInsurance'
import CustomThemes from '../components/premium/CustomThemes'
import WellnessBreakdown from '../components/premium/WellnessBreakdown'
import PredictiveAlerts from '../components/premium/PredictiveAlerts'
import PrivateGroups from '../components/premium/PrivateGroups'
import AnalyticsTiles from '../components/premium/AnalyticsTiles'

function PremiumFeaturesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('analytics') // Changed default to analytics
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock user object - in real app this would come from context/auth
  const user = { isPremium }

  useEffect(() => {
    try {
      const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
      setIsPremium(premiumData.isPremium || false)
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

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Crown className="text-yellow-500" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Premium Features</h1>
            <p className="text-text-secondary">Exclusive tools for premium members</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
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

