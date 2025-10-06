# Quick Start Guide - Space4U

## 🚀 Getting Started

### 1. Start the Dev Server
```bash
npm run dev
```

### 2. Enable Premium Features (For Testing)

**Option A: Via Settings (Easiest)**
1. Go to `http://localhost:5173/settings`
2. At the top, you'll see a yellow "Developer Mode" section
3. Toggle the switch to enable Premium
4. Now visit `/premium/features` to see all premium features!

**Option B: Via Browser Console**
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Paste this code:
```javascript
localStorage.setItem('safespace_premium', JSON.stringify({
  isPremium: true,
  plan: 'annual',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
}))
```
4. Refresh the page (F5)

## 📍 All Feature Routes

### Core Features
- `/` - Homepage with 15 wellness tool cards
- `/circles` - Support circles
- `/insights` - Mood insights
- `/profile` - User profile & badges
- `/settings` - Settings (with premium toggle!)

### Priority 1 Features
- `/gratitude` - Gratitude Journal
- `/habits` - Habit Tracker
- `/emotions` - Emotion Wheel
- `/coping-skills` - Coping Skills Library
- `/reminders` - Smart Reminders

### Priority 2 Features
- `/wellness` - Wellness Score Dashboard
- `/advanced-tools` - 6 advanced tools (Journaling, Triggers, Medication, Therapy Prep, Self-Compassion, Worry Scheduler)

### Priority 3 Features
- `/gamification` - Challenges, Streaks, Quests
- `/wellness-plan` - Wellness Plan Builder

### Priority 4 Features (Social & Community)
- `/social` - Social Hub with 4 tabs:
  - Accountability Partner System
  - Peer Support Matching
  - Support Request System
  - Mood-Based Suggestions

### Priority 5 Features (Advanced Analytics)
- `/analytics` - Advanced Analytics with 3 tabs:
  - Tag Analytics Dashboard
  - Sleep Pattern Analytics
  - Mood Prediction AI

### Priority 6 Features (Professional Integration)
- `/professional` - Professional Hub with 3 tabs:
  - Therapist Portal
  - Crisis Hotline Integration
  - Data Export & Portability

### Priority 7 Features (Technical Enhancements)
- `/technical` - Technical Features with 3 tabs:
  - Voice Journaling
  - Offline Mode Enhancement
  - PWA Settings

### Premium Features
- `/premium` - Premium pricing page
- `/premium/features` - Premium Features Hub with 5 tabs:
  - Streak Insurance
  - Custom Themes
  - Wellness Breakdown
  - Predictive Alerts
  - Private Groups
- `/premium/manage` - Subscription management

## 🎯 Testing Checklist

### Basic Flow
- [ ] Complete onboarding
- [ ] Log a mood on homepage
- [ ] View mood calendar
- [ ] Check mood trends chart

### Feature Testing
- [ ] Click each of the 15 wellness tool cards on homepage
- [ ] Navigate using the navigation bar (8 items)
- [ ] Test each priority feature page
- [ ] Enable premium in settings
- [ ] Access all 5 premium features

### Premium Features Testing
1. **Enable Premium** (via settings or console)
2. **Visit `/premium/features`**
3. **Test Each Tab:**
   - Streak Insurance: View current streak, see freeze history
   - Custom Themes: Apply different color themes
   - Wellness Breakdown: View detailed wellness scores
   - Predictive Alerts: See mood predictions
   - Private Groups: Create invite-only circles

## 🐛 Troubleshooting

### Issue: Premium features page shows upgrade prompt
**Solution**: Enable premium status via settings or console (see above)

### Issue: Features not showing on homepage
**Solution**: 
1. Stop dev server (Ctrl+C)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart: `npm run dev`
4. Hard refresh: Ctrl+Shift+R

### Issue: Blank/faded page
**Solution**:
1. Check browser console (F12) for errors
2. Ensure premium is enabled if accessing premium features
3. Clear localStorage: `localStorage.clear()` in console
4. Restart app and go through onboarding again

### Issue: Routes not working
**Solution**:
1. Ensure dev server is running
2. Check URL is correct (e.g., `/social` not `/social-hub`)
3. Hard refresh the page

## 📊 Feature Count

- **Total Features**: 46
- **Total Pages**: 26
- **Total Routes**: 20+
- **Wellness Tool Cards**: 15
- **Navigation Items**: 8
- **Premium Features**: 15 (10 original + 5 new)

## 🎨 Key Features by Category

### Mood & Tracking (7)
- Daily mood logging, calendar, trends, analytics, tags, sleep, prediction

### Community & Social (5)
- Circles, posts, accountability partners, peer support, support requests

### Wellness Tools (12)
- Gratitude, habits, emotions, coping skills, reminders, therapy tools, wellness score, triggers, medication, therapy prep, self-compassion, worry scheduler

### Gamification (3)
- Challenges, streaks, quests

### Professional (3)
- Therapist portal, crisis hotlines, data export

### Premium (5)
- Streak insurance, custom themes, wellness breakdown, predictive alerts, private groups

### Technical (3)
- Voice journaling, offline mode, PWA enhancements

## 💡 Pro Tips

1. **Use the Developer Toggle**: Always enable premium in settings for full access
2. **Test All Tabs**: Each hub page has multiple tabs - test them all
3. **Check localStorage**: Use browser DevTools to inspect stored data
4. **Mobile Testing**: Resize browser to test responsive design
5. **Navigation**: Use both homepage cards and navigation bar to access features

## 🎉 You're All Set!

All 46 features are implemented and ready to test. Just enable premium in settings and explore!
