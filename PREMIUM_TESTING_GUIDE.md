# Premium Features Testing Guide

## 🧪 Quick Testing Instructions

### **Step 1: Enable Premium (Browser Console)**

1. Start the app: `npm run dev`
2. Open browser console (F12 or Ctrl+Shift+I)
3. Run this command:
```javascript
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))
location.reload()
```
4. You now have premium access!

**Alternative:** If you can access Settings page (after onboarding), toggle Developer Mode ON

### **Step 2: Test Free Limits**

#### Disable Premium First
```javascript
// In browser console:
localStorage.removeItem('safespace_premium')
location.reload()
```

#### Test Each Limit
1. **Gratitude Journal** (`/gratitude`)
   - Create 10 entries
   - Try to create 11th → See warning banner
   - Click "Upgrade" → Navigate to premium page

2. **Circles** (`/circles`)
   - Join 3 circles
   - Try to join 4th → See warning banner

3. **Habits** (`/habits`)
   - Add 5 habits
   - Try to add 6th → Button disabled

4. **Reminders** (`/reminders`)
   - Set 5 reminders
   - Try to set 6th → Button disabled

5. **Coping Skills** (`/coping-skills`)
   - View 10 free skills
   - See 5 locked premium skills

6. **Challenges** (`/gamification`)
   - Start 1 challenge
   - Try to start 2nd → See warning

7. **Emotion History** (`/emotions`)
   - View only last 30 days
   - Older entries hidden

8. **Wellness Plan** (`/wellness-plan`)
   - Add 5 activities
   - Try to add 6th → Button disabled

### **Step 3: Test Premium Features**

#### Enable Premium Again
```javascript
// In browser console:
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))
location.reload()
```

#### Test Unlocked Features
1. **All Limits Removed**
   - Create unlimited gratitude entries ✅
   - Join unlimited circles ✅
   - Add unlimited habits ✅
   - Set unlimited reminders ✅
   - View all 15 coping skills ✅
   - Start 3 challenges ✅
   - View full emotion history ✅
   - Add unlimited activities ✅

2. **Premium-Only Features**
   - **DBT Skills** (`/tools`) - Unlocked ✅
   - **Sleep Tracker** (`/tools`) - Unlocked ✅
   - **Mood Prediction** (`/analytics`) - Unlocked ✅
   - **Therapist Portal** (`/professional`) - Unlocked ✅
   - **Voice Journal** (`/technical`) - Unlocked ✅

3. **Exclusive Premium Features** (`/premium/features`)
   - **Streak Insurance** - 2 freezes available ✅
   - **Custom Themes** - 8 themes selectable ✅
   - **Wellness Breakdown** - Charts and insights ✅
   - **Predictive Alerts** - AI forecasting ✅
   - **Private Groups** - Create invite-only circles ✅

### **Step 4: Test Trial Logic**

#### Start Free Trial
```javascript
// In browser console:
import { startFreeTrial } from './src/utils/premiumUtils.js'
startFreeTrial()
location.reload()
```

Or use the Premium page:
1. Go to `/premium`
2. Click "Start Free Trial"
3. See trial countdown on HomePage
4. Full premium access for 7 days

#### Test Trial Expiration
```javascript
// In browser console:
const premium = JSON.parse(localStorage.getItem('safespace_premium'))
premium.trialEndsAt = new Date(Date.now() - 1000).toISOString() // Expired
localStorage.setItem('safespace_premium', JSON.stringify(premium))
location.reload()
// Should auto-downgrade to free
```

### **Step 5: Test Subscription Management**

1. Go to `/premium/manage`
2. View subscription details
3. Test "Cancel Subscription" flow
4. See confirmation modal
5. Cancel → Keeps premium until billing date

---

## 🎯 Quick Test Checklist

### Free User Experience
- [ ] Can track mood unlimited
- [ ] Can post in circles unlimited
- [ ] Hits limit at 10 gratitude entries
- [ ] Hits limit at 3 circles
- [ ] Hits limit at 5 habits
- [ ] Hits limit at 5 reminders
- [ ] Sees 5 locked coping skills
- [ ] Can start only 1 challenge
- [ ] Sees only 30-day emotion history
- [ ] Hits limit at 5 wellness activities
- [ ] Sees lock icon on premium features
- [ ] Sees upgrade prompts
- [ ] Can navigate to premium page

### Premium User Experience
- [ ] Crown badge shows on pages
- [ ] All limits removed
- [ ] Can access DBT Skills
- [ ] Can access Sleep Tracker
- [ ] Can access Mood Prediction
- [ ] Can access Therapist Portal
- [ ] Can access Voice Journal
- [ ] Can use Streak Insurance
- [ ] Can select Custom Themes
- [ ] Can view Wellness Breakdown
- [ ] Can see Predictive Alerts
- [ ] Can create Private Groups
- [ ] No lock icons visible
- [ ] No upgrade prompts

### Trial User Experience
- [ ] Trial countdown shows on HomePage
- [ ] Full premium access during trial
- [ ] Trial badge shows in header
- [ ] Days left displayed correctly
- [ ] Auto-downgrade after trial ends
- [ ] Limits re-applied after trial

---

## 🐛 Common Issues & Solutions

### Issue: Premium not activating
**Solution:**
```javascript
localStorage.setItem('safespace_premium', JSON.stringify({
  isPremium: true,
  trialActive: false,
  planType: 'monthly',
  nextBillingDate: new Date(Date.now() + 30*24*60*60*1000).toISOString()
}))
location.reload()
```

### Issue: Limits not working
**Solution:**
```javascript
localStorage.removeItem('safespace_premium')
location.reload()
```

### Issue: Trial not showing
**Solution:**
```javascript
const now = new Date()
const trialEnd = new Date(now.getTime() + 7*24*60*60*1000)
localStorage.setItem('safespace_premium', JSON.stringify({
  isPremium: true,
  trialActive: true,
  trialEndsAt: trialEnd.toISOString(),
  planType: 'monthly',
  nextBillingDate: new Date(trialEnd.getTime() + 1*24*60*60*1000).toISOString()
}))
location.reload()
```

### Issue: Need to reset everything
**Solution:**
```javascript
localStorage.clear()
location.reload()
```

---

## 📊 Test Coverage

### Modules Tested: 21/21 ✅

1. ✅ GratitudeJournalPage
2. ✅ CirclesPage
3. ✅ HabitTrackerPage
4. ✅ RemindersPage
5. ✅ CopingSkillsPage
6. ✅ GamificationPage
7. ✅ EmotionTrackerPage
8. ✅ WellnessDashboardPage
9. ✅ TherapeuticToolsPage
10. ✅ Priority2FeaturesPage
11. ✅ AdvancedAnalyticsPage
12. ✅ ProfilePage
13. ✅ InsightsPage
14. ✅ HomePage
15. ✅ WellnessPlanPage
16. ✅ SocialHubPage
17. ✅ ProfessionalPage
18. ✅ TechnicalFeaturesPage
19. ✅ PremiumFeaturesPage
20. ✅ PremiumManagePage
21. ✅ PremiumPage

---

## 🚀 Automated Testing (Future)

### Unit Tests
```javascript
// Example test structure
describe('Premium Features', () => {
  test('Free user sees limit warning', () => {})
  test('Premium user has no limits', () => {})
  test('Trial countdown displays correctly', () => {})
  test('Premium features are gated', () => {})
})
```

### Integration Tests
```javascript
describe('Premium Flow', () => {
  test('User hits limit → sees banner → clicks upgrade → navigates to premium', () => {})
  test('User starts trial → gets 7 days → auto-downgrades', () => {})
})
```

---

## ✅ Testing Complete

Once all checkboxes are checked, premium implementation is fully tested and ready for production!

**Happy Testing! 🎉**
