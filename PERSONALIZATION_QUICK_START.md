# Personalization Engine - Quick Start Guide

## 🚀 See It In Action (2 Minutes)

### Step 1: View Adaptive Dashboard
1. Start app: `npm run dev`
2. Go to HomePage
3. Scroll down to see **"Personalized for you"** section
4. See your top 6 tools (default on first use)

### Step 2: Simulate Usage
Open browser console (F12) and run:
```javascript
// Simulate using gratitude journal
localStorage.setItem('safespace_personalization', JSON.stringify({
  enabled: true,
  lastUpdated: new Date().toISOString(),
  usage: {
    features: {
      'gratitude': { count: 10, lastUsed: new Date().toISOString(), avgDuration: 120, totalDuration: 1200 },
      'habits': { count: 5, lastUsed: new Date().toISOString(), avgDuration: 60, totalDuration: 300 },
      'mood-tracker': { count: 15, lastUsed: new Date().toISOString(), avgDuration: 30, totalDuration: 450 }
    },
    timePatterns: {
      [new Date().getHours()]: ['gratitude', 'mood-tracker']
    },
    sessionPreference: 'quick',
    inputPreference: 'text',
    contentPreference: 'balanced'
  },
  recommendations: { current: [], dismissed: [], feedback: {} },
  insights: { moodPatterns: { triggers: [], positiveInfluences: [] }, effectiveStrategies: [], seasonalPatterns: [] },
  preferences: { dashboardLayout: 'adaptive', recommendationFrequency: 'medium', helpLevel: 'full' }
}))
location.reload()
```

### Step 3: See Recommendations
```javascript
// Add goals to trigger recommendations
const profile = JSON.parse(localStorage.getItem('safespace_user_profile') || '{}')
profile.goals = ['anxiety', 'stress']
localStorage.setItem('safespace_user_profile', JSON.stringify(profile))
location.reload()
```

### Step 4: Test Inactive Prompt
```javascript
// Simulate 3+ days of inactivity
const moods = {}
const oldDate = new Date()
oldDate.setDate(oldDate.getDate() - 4)
moods[oldDate.toISOString()] = { rating: 3, date: oldDate.toISOString() }
localStorage.setItem('safespace_moods', JSON.stringify(moods))
location.reload()
// See "We miss you!" prompt
```

### Step 5: Access Settings
1. Go to `/personalization`
2. Toggle personalization ON/OFF
3. Change preferences
4. See privacy guarantees
5. Reset if needed

---

## 🎯 Key Features

### Adaptive Dashboard
- **Location**: HomePage (below mood trends)
- **Shows**: Top 6 most relevant tools
- **Adapts**: Based on usage, time, mood

### Recommendations
- **Goal-based**: From onboarding
- **Mood-based**: Anxiety → breathing exercises
- **Engagement-based**: Similar features

### Settings
- **Route**: `/personalization`
- **Controls**: Enable/disable, preferences, reset
- **Privacy**: 100% local, no tracking

---

## 🧪 Quick Tests

### Test 1: Usage Tracking
```javascript
// Track feature usage
import { trackFeatureUsage } from './src/utils/usageTracker.js'
trackFeatureUsage('gratitude', 120)
```

### Test 2: Get Top Features
```javascript
// Get most used features
import { getMostUsedFeatures } from './src/utils/usageTracker.js'
console.log(getMostUsedFeatures(6))
```

### Test 3: Generate Recommendations
```javascript
// Get recommendations
import { generateRecommendations } from './src/utils/recommendationEngine.js'
console.log(generateRecommendations())
```

### Test 4: Check Status
```javascript
// Check if enabled
import { isPersonalizationEnabled } from './src/utils/personalizationEngine.js'
console.log(isPersonalizationEnabled())
```

---

## 🔧 Common Commands

```javascript
// Enable personalization
localStorage.setItem('safespace_personalization', JSON.stringify({enabled: true}))

// Disable personalization
const p = JSON.parse(localStorage.getItem('safespace_personalization'))
p.enabled = false
localStorage.setItem('safespace_personalization', JSON.stringify(p))

// Reset personalization
localStorage.removeItem('safespace_personalization')

// View current state
console.log(JSON.parse(localStorage.getItem('safespace_personalization')))

// Reload page
location.reload()
```

---

## 📊 What Gets Tracked

### Feature Usage
- Count (how many times)
- Last used (timestamp)
- Average duration (seconds)
- Total duration (seconds)

### Time Patterns
- Hour of day → features used
- Example: 9am → gratitude, mood-tracker

### Preferences
- Session: quick, deep, balanced
- Input: voice, text
- Content: visual, text, balanced

### Recommendations
- Current suggestions
- Dismissed features
- Feedback (helpful/not-helpful)

---

## 🔒 Privacy

✅ **All local** - No server transmission
✅ **User control** - Enable/disable anytime
✅ **Transparent** - See what's tracked
✅ **Deletable** - Reset clears everything
✅ **Exportable** - Included in data export

---

## 🎉 That's It!

You now have an intelligent personalization engine that:
- Learns your patterns
- Adapts your dashboard
- Recommends relevant features
- Respects your privacy

**Start using the app and watch it adapt to you!** 🚀
