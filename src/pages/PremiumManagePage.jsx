import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle, X } from 'lucide-react'
import { checkPremiumStatus, cancelPremium, getPremiumDaysLeft } from '../utils/premiumManager'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'

function PremiumManagePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const premium = checkPremiumStatus()
  const [showCancelModal, setShowCancelModal] = useState(false)

  if (!premium.isPremium && !premium.trialActive) {
    return (
    <SafeComponent>
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2">{t('premium.noActiveSubscription')}</h1>
        <p className="text-text-secondary mb-6">{t('premium.upgradeToPremium')}</p>
        <button
          onClick={() => navigate('/premium')}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
        >
          {t('premium.viewPlans')}
        </button>
      </div>
    
    </SafeComponent>
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
      <h1 className="text-2xl font-bold text-text-primary mb-6">{t('premium.manageSubscription')}</h1>

      {/* Status Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown size={32} />
          <div>
            <h2 className="text-xl font-bold">
              {premium.trialActive ? t('premium.freeTrialActive') : t('premium.premiumActive')}
            </h2>
            <p className="opacity-90">
              {premium.planType === 'annual' ? t('premium.annualPlan') : t('premium.monthlyPlan')}
            </p>
          </div>
        </div>
        {premium.trialActive && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="font-medium mb-1">{t('premium.trialEndsIn', { days: daysLeft })}</p>
            <p className="text-sm opacity-90">
              {t('premium.chargedOn', { date: new Date(premium.nextBillingDate).toLocaleDateString() })}
            </p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-surface rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-text-primary mb-4">{t('premium.yourPremiumFeatures')}</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            t('premium.unlimitedHistory'),
            t('premium.advancedAIInsights'),
            t('premium.moodPrediction'),
            t('premium.groupTherapySessions'),
            t('premium.prioritySupportShort'),
            t('premium.adFree'),
            t('premium.customMoodScales'),
            t('premium.detailedExport'),
            t('premium.therapistPortalAccess'),
            t('premium.voiceJournaling')
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
          <h3 className="font-semibold text-text-primary">{t('premium.billingInformation')}</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('premium.plan')}</span>
            <span className="font-medium">
              {premium.planType === 'annual' ? '₹2,999/year' : '₹299/month'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('premium.nextBillingDate')}</span>
            <span className="font-medium">
              {new Date(premium.nextBillingDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('premium.paymentMethod')}</span>
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
          {premium.planType === 'monthly' ? t('premium.upgradeToAnnual') : t('premium.viewPlans')}
        </button>
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full py-3 border border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50"
        >
          {t('premium.cancelSubscription')}
        </button>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{t('premium.cancelSubscriptionTitle')}</h3>
              <button onClick={() => setShowCancelModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl mb-4">
                <AlertCircle className="text-orange-600 flex-shrink-0" size={20} />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">{t('premium.loseAccessTo')}</p>
                  <ul className="space-y-1">
                    <li>• {t('premium.unlimitedHistory')}</li>
                    <li>• {t('premium.aiPredictions')}</li>
                    <li>• {t('premium.groupTherapySessions')}</li>
                    <li>• {t('premium.prioritySupportShort')}</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                {t('premium.remainActiveUntil', { date: new Date(premium.nextBillingDate).toLocaleDateString() })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
              >
                {t('premium.keepPremium')}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumManagePage
