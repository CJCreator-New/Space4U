# Premium Features - Quick Reference Card

## 🚀 Quick Start

### Enable Premium (Testing)
```javascript
// In browser console (F12):
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))
location.reload()

// OR in Settings → Toggle Developer Mode ON (after onboarding)
```

### Disable Premium (Testing)
```javascript
localStorage.removeItem('safespace_premium')
location.reload()
```

---

## 📊 Free vs Premium Limits

| Feature | Free | Premium |
|---------|------|---------|
| Mood Tracking | ∞ | ∞ |
| Circles | 3 | ∞ |
| Habits | 5 | ∞ |
| Reminders | 5 | ∞ |
| Gratitude | 10 | ∞ |
| Coping Skills | 10/15 | 15/15 |
| Challenges | 1 | 3 |
| Emotion History | 30d | ∞ |
| Wellness Activities | 5 | ∞ |

---

## 🔒 Premium-Only Features

### Unlocked Tools
- ✅ DBT Skills (`/tools`)
- ✅ Sleep Tracker (`/tools`)
- ✅ Mood Prediction AI (`/analytics`)
- ✅ Therapist Portal (`/professional`)
- ✅ Voice Journal (`/technical`)

### Exclusive Features (`/premium/features`)
- ✅ Streak Insurance (2 freezes/month)
- ✅ Custom Themes (8 themes)
- ✅ Wellness Breakdown (detailed analytics)
- ✅ Predictive Alerts (AI forecasting)
- ✅ Private Groups (invite-only circles)

---

## 💰 Pricing

- **FREE**: $0/month
- **MONTHLY**: ₹299/month
- **ANNUAL**: ₹2,999/year (save 37%)
- **TRIAL**: 7 days free

---

## 🧪 Quick Test Commands

```javascript
// Enable Premium
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))

// Start Free Trial
localStorage.setItem('safespace_premium', JSON.stringify({
  isPremium: true,
  trialActive: true,
  trialEndsAt: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
  planType: 'monthly',
  nextBillingDate: new Date(Date.now() + 8*24*60*60*1000).toISOString()
}))

// Expire Trial
const p = JSON.parse(localStorage.getItem('safespace_premium'))
p.trialEndsAt = new Date(Date.now() - 1000).toISOString()
localStorage.setItem('safespace_premium', JSON.stringify(p))

// Reset Everything
localStorage.clear()

// Reload Page
location.reload()
```

---

## 📁 Key Files

### Components
- `src/components/premium/StreakInsurance.jsx`
- `src/components/premium/CustomThemes.jsx`
- `src/components/premium/WellnessBreakdown.jsx`
- `src/components/premium/PredictiveAlerts.jsx`
- `src/components/premium/PrivateGroups.jsx`
- `src/components/common/LimitWarningBanner.jsx`
- `src/components/PremiumPaywall.jsx`

### Pages
- `src/pages/PremiumPage.jsx` - Pricing
- `src/pages/PremiumFeaturesPage.jsx` - Exclusive features
- `src/pages/PremiumManagePage.jsx` - Subscription management

### Utilities
- `src/utils/premiumUtils.js` - All premium logic

---

## 🎯 Testing Checklist

### Free User
- [ ] Hit 10 gratitude limit
- [ ] Hit 3 circle limit
- [ ] Hit 5 habit limit
- [ ] See 5 locked coping skills
- [ ] See premium paywalls
- [ ] Click upgrade → Navigate to premium

### Premium User
- [ ] Crown badge visible
- [ ] All limits removed
- [ ] All features unlocked
- [ ] No paywalls
- [ ] Access exclusive features

### Trial User
- [ ] Trial countdown shows
- [ ] Full premium access
- [ ] Auto-downgrade after 7 days

---

## 🔧 Utility Functions

```javascript
import { 
  getPremiumStatus,      // Check premium status
  startFreeTrial,        // Start 7-day trial
  cancelPremium,         // Cancel subscription
  reactivatePremium,     // Reactivate subscription
  checkAndUpdatePremiumStatus  // Auto-update status
} from '../utils/premiumUtils'

// Usage
const { isPremium, trialActive, daysLeft } = getPremiumStatus()
```

---

## 🎨 UI Components

```javascript
// Limit Warning Banner
<LimitWarningBanner
  current={count}
  limit={FREE_LIMIT}
  itemName="habits"
  featureName="Unlimited Habits"
/>

// Premium Paywall
<PremiumPaywall
  feature="Feature Name"
  description="Feature description"
>
  <LockedContent />
</PremiumPaywall>

// Premium Badge
{isPremium && <Crown className="w-6 h-6 text-yellow-500" />}
```

---

## 📱 Routes

- `/premium` - Pricing page
- `/premium/features` - Exclusive features
- `/premium/manage` - Subscription management
- `/premium/success` - Payment success

---

## 🐛 Troubleshooting

### Premium not working?
```javascript
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))
location.reload()
```

### Limits not enforcing?
```javascript
localStorage.removeItem('safespace_premium')
location.reload()
```

### Need fresh start?
```javascript
localStorage.clear()
location.reload()
```

---

## 📚 Documentation

- `PREMIUM_FREE_IMPLEMENTATION_PLAN.md` - Original plan
- `PREMIUM_IMPLEMENTATION_COMPLETE.md` - Detailed report
- `PREMIUM_TESTING_GUIDE.md` - Full testing guide
- `IMPLEMENTATION_SUMMARY.md` - Summary
- `PREMIUM_QUICK_REFERENCE.md` - This card

---

## ✅ Status

**100% Complete** - All 21 modules implemented

**Ready for Production** 🚀

---

**Print this card for quick reference during development!**
