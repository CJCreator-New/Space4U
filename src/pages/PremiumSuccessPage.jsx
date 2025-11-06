import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Crown, Sparkles, Check } from 'lucide-react'
import SafeComponent from '../components/SafeComponent'

function PremiumSuccessPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const premiumData = JSON.parse(localStorage.getItem('space4u_premium') || '{}')
  const trialEndDate = premiumData.trialEndsAt 
    ? new Date(premiumData.trialEndsAt).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : ''

  return (
    <SafeComponent>
    <div className="max-w-2xl mx-auto text-center py-12">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['', '✨', '', '', '✅'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Check className="text-white" size={48} />
        </div>
        
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          {t('premium.welcomeToPremium')}
        </h1>
        
        <p className="text-xl text-text-secondary mb-2">
          {t('premium.trialEndsOn', { date: trialEndDate })}
        </p>
        
        <p className="text-text-secondary">
          {t('premium.reminderBeforeCharge')}
        </p>
      </div>

      <div className="card p-8 mb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Crown className="text-yellow-500" size={32} />
          <h2 className="text-2xl font-bold">{t('premium.accessTo')}</h2>
        </div>
        
        <div className="grid gap-4 text-left">
          {[
            t('premium.unlimitedHistory'),
            t('premium.advancedAI'),
            t('premium.groupTherapy'),
            t('premium.prioritySupport'),
            t('premium.adFree'),
            t('premium.customMetrics'),
            t('premium.detailedExport')
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="text-primary" size={16} />
              </div>
              <span className="text-text-primary">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/insights')}
        className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
      >
        <Sparkles size={20} />
        {t('premium.startExploring')}
      </button>
    </div>
  
    </SafeComponent>
  )
}

export default PremiumSuccessPage

