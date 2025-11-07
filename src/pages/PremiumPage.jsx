import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'
import { getPremiumStatus } from '../utils/premiumUtils'
import { 
  Crown, Check, X, Brain, Users, Download, Star, Lock, 
  CreditCard, Smartphone, ChevronDown, Shield, Sparkles
} from 'lucide-react'

const FEATURES = {
  free: ['7-day mood history', 'All circles access', 'Basic AI insights', '1 free therapy session', 'Community support', 'With ads', 'Basic export'],
  premium: ['Unlimited history', 'All circles access', 'Advanced AI + predictive', '4 sessions/month', 'Priority 1:1 support', 'Ad-free', 'Detailed reports', 'Custom metrics']
}

const TESTIMONIALS = [
  { avatar: '', name: 'Anonymous Bear', quote: 'Premium insights helped me identify my anxiety triggers', rating: 5 },
  { avatar: '', name: 'Anonymous Butterfly', quote: 'The group therapy sessions changed my life', rating: 5 },
  { avatar: '', name: 'Anonymous Blossom', quote: 'Best investment in my mental health journey', rating: 5 }
]

const FAQS = [
  { q: 'What happens after my trial?', a: 'After 7 days, you\'ll be charged based on your selected plan. We\'ll send a reminder 2 days before.' },
  { q: 'Can I cancel anytime?', a: 'Yes! Cancel anytime from Settings. You\'ll keep Premium until your billing period ends.' },
  { q: 'How do group therapy sessions work?', a: 'Book sessions through the app. Join small groups (4-6 people) with licensed therapists via video call.' },
  { q: 'Is my payment information secure?', a: 'Absolutely. We use Razorpay with bank-level encryption. We never store your card details.' },
  { q: 'Can I switch between plans?', a: 'Yes! Switch anytime. We\'ll prorate the difference for you.' },
  { q: 'What if I\'m not satisfied?', a: 'Cancel during trial for no charge. After that, we offer a 30-day money-back guarantee.' }
]

function PremiumPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)
  const { isPremium } = getPremiumStatus()

  useEffect(() => {
    if (isPremium) {
      navigate('/premium/features')
    }
  }, [isPremium, navigate])

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  if (isPremium) {
    return null
  }

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full mb-4">
          <Sparkles size={16} />
          <span className="font-medium">7-day free trial</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Unlock Your Full Wellness Journey
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          Get advanced insights, priority support, and ad-free experience
        </p>
        <div className="text-6xl mb-4">
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Monthly Plan */}
        <div className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-primary mb-2">Most Flexible</div>
          <div className="mb-4">
            <span className="text-4xl font-bold">₹299</span>
            <span className="text-text-secondary">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {['Unlimited mood history', 'Advanced AI insights', '4 live group therapy sessions', 'Priority support', 'Ad-free experience', 'Custom mood metrics', 'Export detailed reports'].map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="text-primary flex-shrink-0 mt-1" size={16} />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade('monthly')}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors mb-2"
          >
            Start Free Trial
          </button>
          <p className="text-xs text-center text-text-secondary">Cancel anytime</p>
        </div>

        {/* Annual Plan */}
        <div className="card p-6 border-2 border-primary relative hover:shadow-xl transition-shadow">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-medium">
            Best Value
          </div>
          <div className="text-sm font-medium text-primary mb-2">Save ₹600 per year</div>
          <div className="mb-4">
            <span className="text-4xl font-bold">₹2,999</span>
            <span className="text-text-secondary">/year</span>
            <div className="text-sm text-text-secondary">₹250/month</div>
          </div>
          <ul className="space-y-3 mb-6">
            {['Unlimited mood history', 'Advanced AI insights', '4 live group therapy sessions', 'Priority support', 'Ad-free experience', 'Custom mood metrics', 'Export detailed reports'].map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="text-primary flex-shrink-0 mt-1" size={16} />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade('annual')}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium hover:opacity-90 transition-opacity mb-2"
          >
            Start Free Trial
          </button>
          <p className="text-xs text-center text-text-secondary">Cancel anytime</p>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="card p-6 mb-12">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h2 className="text-2xl font-bold">Compare Plans</h2>
          <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={24} />
        </button>
        
        {showComparison && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4 bg-primary/5">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Mood tracking', '7-day history', 'Unlimited history'],
                  ['Circles access', 'All circles', 'All circles'],
                  ['AI insights', 'Basic patterns', 'Advanced + predictive'],
                  ['Group therapy', '1 free session', '4 sessions/month'],
                  ['Support', 'Community', 'Priority 1:1'],
                  ['Ads', 'Yes', 'No'],
                  ['Data export', 'Basic', 'Detailed reports'],
                  ['Custom metrics', 'No', 'Yes']
                ].map(([feature, free, premium], i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4 font-medium">{feature}</td>
                    <td className="py-3 px-4 text-center text-text-secondary">{free}</td>
                    <td className="py-3 px-4 text-center bg-primary/5 font-medium">{premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Benefits Showcase */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Go Premium?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <Brain className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Deep Insights</h3>
            <p className="text-text-secondary">
              AI-powered pattern detection. Understand your triggers, predict mood changes, get personalized suggestions.
            </p>
          </div>
          
          <div className="card p-6">
            <Users className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Real Support</h3>
            <p className="text-text-secondary">
              Affordable group therapy. Connect with licensed therapists in small groups for just ₹199/session.
            </p>
          </div>
          
          <div className="card p-6">
            <Download className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Your Data, Your Way</h3>
            <p className="text-text-secondary">
              Complete data ownership. Export detailed reports, track custom metrics, full history forever.
            </p>
          </div>
          
          <div className="card p-6">
            <Star className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Priority Care</h3>
            <p className="text-text-secondary">
              We're here for you. 1:1 support within 24 hours, skip the wait, you matter most.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Join 10,000+ Premium members</h2>
          <div className="flex items-center justify-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            <span className="ml-2 text-text-secondary">4.8/5 average rating</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <p className="text-text-secondary italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="card">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold">{faq.q}</span>
                <ChevronDown className={`transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} size={20} />
              </button>
              {expandedFaq === i && (
                <div className="px-6 pb-6 text-text-secondary">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false)
            navigate('/premium/success')
          }}
        />
      )}
    </div>
  
    </SafeComponent>
  )
}

function PaymentModal({ plan, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [agreed, setAgreed] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    upiId: ''
  })

  const price = plan === 'annual' ? '₹2,999' : '₹299'
  const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreed) return
    
    // Mock payment success
    const premiumData = {
      isPremium: true,
      trialActive: true,
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      planType: plan,
      subscribedAt: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    localStorage.setItem('space4u_premium', JSON.stringify(premiumData))
    
    // Dispatch global event to update premium status across all components
    window.dispatchEvent(new CustomEvent('premiumStatusUpdated', { detail: premiumData }))
    
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* TEST MODE Banner */}
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg mb-4 text-center font-medium">
             TEST MODE - No actual charges
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Start Your 7-Day Free Trial</h2>
            <button onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Plan Recap */}
          <div className="bg-primary/5 p-4 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{plan === 'annual' ? 'Annual' : 'Monthly'} Plan</span>
              <span className="text-2xl font-bold">{price}</span>
            </div>
            <p className="text-sm text-text-secondary">
              You won't be charged until {trialEndDate}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Payment Method</label>
              <div className="space-y-2">
                {[
                  { value: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
                  { value: 'upi', icon: Smartphone, label: 'UPI' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPaymentMethod(value)}
                    className={`w-full flex items-center gap-3 p-3 border rounded-xl transition-colors ${
                      paymentMethod === value ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Card number"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    className="p-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    className="p-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                  required
                />
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="UPI ID (e.g., name@upi)"
                  value={formData.upiId}
                  onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                  required
                />
              </div>
            )}

            {/* Security */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <Shield size={16} />
              <span> Secured by Razorpay - Your payment info is encrypted</span>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
                required
              />
              <span className="text-sm text-text-secondary">
                I agree to Terms and auto-renewal policy
              </span>
            </label>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!agreed}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Trial
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PremiumPage

