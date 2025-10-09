# Premium Features Implementation Plan

## Overview
This document outlines the strategic implementation of premium features across all modules and tabs in Space4U.

---

## Premium Feature Categories

### 🎯 Core Premium Features
1. **Streak Insurance** - 2 free streak freezes per month
2. **Custom Themes** - 8 beautiful color themes
3. **Wellness Breakdown** - Detailed analytics dashboard
4. **Predictive Alerts** - AI mood forecasting
5. **Private Groups** - Invite-only circles

### 📊 Free vs Premium Limits
| Feature | Free | Premium |
|---------|------|---------|
| Gratitude Entries | 10 | Unlimited |
| Support Circles | 3 | Unlimited + Private |
| Habit Trackers | 5 | Unlimited |
| Mood Export | Last 30 days | All time |
| Coping Skills | 50 | 100+ |
| Wellness Challenges | 1 active | 3 active |
| Therapy Session Notes | 5 | Unlimited |
| Medication Reminders | 3 | Unlimited |
| Custom Mood Scales | 1 | Unlimited |
| Data Export | JSON only | JSON + PDF + CSV |

---

## Module-by-Module Implementation

### 1. **HomePage** ✅ (Partially Done)
**Current Status:** Basic structure exists
**Premium Features to Add:**
- [ ] Premium badge on user avatar
- [ ] Quick access to premium features card
- [ ] Streak insurance indicator
- [ ] Premium-only wellness score widget
- [ ] Custom theme preview

**Implementation:**
```jsx
// Add premium banner at top
{isPremium && <PremiumWelcomeBanner />}

// Show streak insurance status
{isPremium && streak > 0 && <StreakInsuranceWidget />}

// Premium wellness card
{isPremium ? <WellnessScoreCard /> : <WellnessScorePaywall />}
```

---

### 2. **InsightsPage** ✅ (Done)
**Current Status:** Wellness Breakdown added
**Implemented:**
- ✅ Premium Wellness Breakdown component
- ✅ Premium badge in header
- ✅ Enhanced analytics for premium users

---

### 3. **GratitudeJournalPage** ✅ (Done)
**Current Status:** Entry limit implemented
**Implemented:**
- ✅ 10 entry limit for free users
- ✅ Warning banner when limit reached
- ✅ Upgrade prompt on add button

---

### 4. **HabitsPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 5 habits max
- [ ] Premium: Unlimited habits
- [ ] Premium: Advanced habit analytics
- [ ] Premium: Habit templates library
- [ ] Premium: Streak insurance for habits

**Implementation:**
```jsx
const FREE_HABIT_LIMIT = 5

const handleAddHabit = () => {
  if (!isPremium && habits.length >= FREE_HABIT_LIMIT) {
    navigate('/premium')
    return
  }
  setShowModal(true)
}

// Add limit warning banner
{!isPremium && habits.length >= FREE_HABIT_LIMIT && <LimitWarning />}
```

---

### 5. **CirclesPage** ✅ (Done)
**Current Status:** Circle limit implemented
**Implemented:**
- ✅ 3 circle limit for free users
- ✅ Warning banner when limit reached
- ✅ Premium: Unlimited circles
- ✅ Premium: Private groups access

---

### 6. **EmotionWheelPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: Basic emotion wheel
- [ ] Premium: Detailed emotion history
- [ ] Premium: Emotion pattern analysis
- [ ] Premium: Export emotion data

**Implementation:**
```jsx
// Wrap detailed analytics in paywall
<PremiumPaywall feature="Emotion Analytics">
  <EmotionPatternAnalysis />
</PremiumPaywall>

// Limit emotion log history
const emotionLogs = isPremium 
  ? allLogs 
  : allLogs.slice(0, 30) // Last 30 days only
```

---

### 7. **CopingSkillsPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 50 coping skills
- [ ] Premium: 100+ coping skills
- [ ] Premium: Personalized recommendations
- [ ] Premium: Save favorites (unlimited)
- [ ] Premium: Custom coping skills

**Implementation:**
```jsx
const copingSkills = isPremium 
  ? allCopingSkills 
  : allCopingSkills.slice(0, 50)

// Add premium badge on locked skills
{!isPremium && index >= 50 && <PremiumBadge />}

// Limit favorites
const MAX_FREE_FAVORITES = 10
```

---

### 8. **RemindersPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 5 reminders
- [ ] Premium: Unlimited reminders
- [ ] Premium: Smart reminder suggestions
- [ ] Premium: Custom reminder sounds

**Implementation:**
```jsx
const FREE_REMINDER_LIMIT = 5

const handleAddReminder = () => {
  if (!isPremium && reminders.length >= FREE_REMINDER_LIMIT) {
    navigate('/premium')
    return
  }
  setShowModal(true)
}
```

---

### 9. **TherapeuticToolsPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: Basic CBT tools
- [ ] Premium: All therapeutic tools
- [ ] Premium: Session history (unlimited)
- [ ] Premium: Export therapy notes

**Implementation:**
```jsx
// Gate advanced tools
const tools = [
  { id: 'cbt', premium: false },
  { id: 'dbt', premium: true },
  { id: 'act', premium: true },
  { id: 'mindfulness', premium: false }
]

// Wrap premium tools
{tool.premium && !isPremium ? (
  <PremiumPaywall feature={tool.name}>
    <ToolComponent />
  </PremiumPaywall>
) : (
  <ToolComponent />
)}
```

---

### 10. **WellnessScorePage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: Basic wellness score
- [ ] Premium: Detailed breakdown (already created)
- [ ] Premium: Historical trends
- [ ] Premium: Predictive insights

**Implementation:**
```jsx
// Show basic score to all
<BasicWellnessScore score={overall} />

// Premium detailed breakdown
{isPremium ? (
  <WellnessBreakdown />
) : (
  <PremiumPaywall feature="Detailed Wellness Breakdown">
    <WellnessBreakdown />
  </PremiumPaywall>
)}
```

---

### 11. **JournalingPromptsPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 100 prompts
- [ ] Premium: 500+ prompts
- [ ] Premium: AI-generated prompts
- [ ] Premium: Save journal entries (unlimited)

**Implementation:**
```jsx
const prompts = isPremium 
  ? allPrompts 
  : allPrompts.slice(0, 100)

const FREE_JOURNAL_LIMIT = 20

// Limit saved entries
{!isPremium && entries.length >= FREE_JOURNAL_LIMIT && <LimitWarning />}
```

---

### 12. **TriggerTrackerPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: Track triggers
- [ ] Premium: Advanced trigger analytics
- [ ] Premium: Trigger prediction
- [ ] Premium: Coping strategy suggestions

**Implementation:**
```jsx
// Basic tracking for all
<TriggerTracker />

// Premium analytics
<PremiumPaywall feature="Trigger Analytics">
  <TriggerAnalytics />
</PremiumPaywall>
```

---

### 13. **MedicationTrackerPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 3 medications
- [ ] Premium: Unlimited medications
- [ ] Premium: Side effect tracking
- [ ] Premium: Effectiveness analytics

**Implementation:**
```jsx
const FREE_MEDICATION_LIMIT = 3

const handleAddMedication = () => {
  if (!isPremium && medications.length >= FREE_MEDICATION_LIMIT) {
    navigate('/premium')
    return
  }
  setShowModal(true)
}
```

---

### 14. **TherapySessionPrepPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 5 session notes
- [ ] Premium: Unlimited session notes
- [ ] Premium: Session templates
- [ ] Premium: Export to PDF

**Implementation:**
```jsx
const FREE_SESSION_LIMIT = 5

// Limit session notes
const sessions = isPremium 
  ? allSessions 
  : allSessions.slice(0, FREE_SESSION_LIMIT)

// Export feature
{isPremium && <ExportButton />}
```

---

### 15. **WellnessChallengesPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 1 active challenge
- [ ] Premium: 3 active challenges
- [ ] Premium: Custom challenges
- [ ] Premium: Challenge history

**Implementation:**
```jsx
const FREE_CHALLENGE_LIMIT = 1

const handleJoinChallenge = (challengeId) => {
  if (!isPremium && activeChallenges.length >= FREE_CHALLENGE_LIMIT) {
    navigate('/premium')
    return
  }
  joinChallenge(challengeId)
}
```

---

### 16. **CustomMoodScalesPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: 1 custom scale
- [ ] Premium: Unlimited custom scales
- [ ] Premium: Scale templates
- [ ] Premium: Share scales

**Implementation:**
```jsx
const FREE_SCALE_LIMIT = 1

const handleCreateScale = () => {
  if (!isPremium && customScales.length >= FREE_SCALE_LIMIT) {
    navigate('/premium')
    return
  }
  setShowModal(true)
}
```

---

### 17. **AdvancedAnalyticsPage** ✅ (Done)
**Current Status:** Mood Prediction gated
**Implemented:**
- ✅ Mood Prediction behind paywall
- ✅ Educational content for all tabs
- ✅ Research citations

---

### 18. **TherapistPortalPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: View only
- [ ] Premium: Share data with therapist
- [ ] Premium: Generate reports
- [ ] Premium: Secure messaging

**Implementation:**
```jsx
// Basic view for all
<TherapistPortalView />

// Premium sharing features
<PremiumPaywall feature="Therapist Data Sharing">
  <DataSharingControls />
</PremiumPaywall>
```

---

### 19. **DataExportPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Free: JSON export (last 30 days)
- [ ] Premium: JSON + PDF + CSV (all time)
- [ ] Premium: Scheduled exports
- [ ] Premium: Custom export filters

**Implementation:**
```jsx
const exportFormats = isPremium 
  ? ['json', 'pdf', 'csv'] 
  : ['json']

const exportData = isPremium 
  ? allData 
  : last30DaysData

// Premium export options
{isPremium && <AdvancedExportOptions />}
```

---

### 20. **SettingsPage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Premium status display
- [ ] Custom themes selector (premium)
- [ ] Advanced privacy settings (premium)
- [ ] Data sync settings (premium)

**Implementation:**
```jsx
// Premium status card
<PremiumStatusCard status={premiumStatus} />

// Theme selector
{isPremium ? (
  <ThemeSelector themes={allThemes} />
) : (
  <ThemePaywall />
)}
```

---

### 21. **ProfilePage** 🔄 (Needs Implementation)
**Premium Features:**
- [ ] Premium badge on profile
- [ ] Advanced stats (premium)
- [ ] Custom profile themes (premium)
- [ ] Achievement showcase (premium)

**Implementation:**
```jsx
// Premium badge
{isPremium && <PremiumBadge />}

// Advanced stats
{isPremium ? (
  <AdvancedProfileStats />
) : (
  <BasicProfileStats />
)}
```

---

## Implementation Priority

### Phase 1: High Impact (Week 1)
1. ✅ InsightsPage - Wellness Breakdown
2. ✅ GratitudeJournalPage - Entry limits
3. ✅ CirclesPage - Circle limits
4. ✅ AdvancedAnalyticsPage - Mood Prediction
5. 🔄 HomePage - Premium widgets
6. 🔄 SettingsPage - Theme selector

### Phase 2: Core Features (Week 2)
7. 🔄 HabitsPage - Habit limits
8. 🔄 RemindersPage - Reminder limits
9. 🔄 CopingSkillsPage - Skill limits
10. 🔄 MedicationTrackerPage - Medication limits
11. 🔄 WellnessChallengesPage - Challenge limits
12. 🔄 DataExportPage - Export formats

### Phase 3: Advanced Features (Week 3)
13. 🔄 TherapeuticToolsPage - Tool gating
14. 🔄 JournalingPromptsPage - Prompt limits
15. 🔄 TriggerTrackerPage - Analytics
16. 🔄 TherapySessionPrepPage - Session limits
17. 🔄 CustomMoodScalesPage - Scale limits
18. 🔄 EmotionWheelPage - History limits

### Phase 4: Professional Features (Week 4)
19. 🔄 TherapistPortalPage - Data sharing
20. 🔄 ProfilePage - Advanced stats
21. 🔄 All pages - Custom themes integration

---

## Technical Implementation Guidelines

### 1. **Consistent Premium Check**
```jsx
import { getPremiumStatus } from '../utils/premiumUtils'

const { isPremium, trialActive, daysLeft } = getPremiumStatus()
```

### 2. **Standard Limit Pattern**
```jsx
const FREE_LIMIT = 10

const handleAdd = () => {
  if (!isPremium && items.length >= FREE_LIMIT) {
    navigate('/premium')
    return
  }
  // Add logic
}
```

### 3. **Warning Banner Component**
```jsx
{!isPremium && items.length >= FREE_LIMIT && (
  <LimitWarningBanner 
    limit={FREE_LIMIT}
    feature="Feature Name"
    onUpgrade={() => navigate('/premium')}
  />
)}
```

### 4. **Paywall Wrapper**
```jsx
<PremiumPaywall 
  feature="Feature Name"
  description="Unlock this feature with Premium"
>
  <FeatureComponent />
</PremiumPaywall>
```

### 5. **Premium Badge**
```jsx
{isPremium && (
  <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-medium">
    <Crown size={16} />
    Premium
  </div>
)}
```

---

## Reusable Components to Create

### 1. **LimitWarningBanner.jsx**
```jsx
function LimitWarningBanner({ limit, feature, current, onUpgrade }) {
  return (
    <div className="card p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-orange-600" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Free Limit Reached</p>
            <p className="text-gray-700">
              You've reached {current || limit} {feature}. Upgrade to Premium for unlimited access.
            </p>
          </div>
        </div>
        <button onClick={onUpgrade} className="btn-premium">
          <Crown size={16} />
          Upgrade
        </button>
      </div>
    </div>
  )
}
```

### 2. **PremiumBadge.jsx** (Already exists)
Enhance with more variants

### 3. **PremiumFeatureCard.jsx**
```jsx
function PremiumFeatureCard({ title, description, icon: Icon, locked }) {
  return (
    <div className={`card p-6 ${locked ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-primary" />
        {locked && <Crown className="w-5 h-5 text-yellow-500" />}
      </div>
      <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  )
}
```

---

## Testing Checklist

### For Each Module:
- [ ] Free user sees limit warning at appropriate threshold
- [ ] Free user redirected to premium page when limit reached
- [ ] Premium user has unlimited access
- [ ] Premium badge displays correctly
- [ ] Paywall blur effect works properly
- [ ] Upgrade button navigates to premium page
- [ ] Data persists correctly for both user types
- [ ] No console errors
- [ ] Responsive design maintained

---

## Success Metrics

### User Experience:
- Clear value proposition for premium
- Non-intrusive upgrade prompts
- Smooth transition between free and premium
- Consistent premium branding

### Technical:
- No performance degradation
- Proper error handling
- Consistent premium checks
- Clean code architecture

---

## Next Steps

1. **Create reusable components** (LimitWarningBanner, etc.)
2. **Implement Phase 1** (High Impact features)
3. **Test thoroughly** with both free and premium accounts
4. **Gather feedback** and iterate
5. **Implement remaining phases** progressively

---

**Status Legend:**
- ✅ Done
- 🔄 In Progress
- ⏳ Planned
- ❌ Blocked

**Last Updated:** January 2025
