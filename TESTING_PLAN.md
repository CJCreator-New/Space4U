# Unit Testing Plan - Space4U

## Testing Framework Setup

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Test Structure

```
tests/
├── unit/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── hooks/
├── integration/
└── e2e/
```

---

## 1. Utility Functions Tests

### `src/utils/moodAnalysis.js`

**Test Suite: moodAnalysis.test.js**

```javascript
describe('calculateAverageMood', () => {
  test('calculates correct average for valid moods')
  test('returns 0 for empty array')
  test('handles single mood entry')
})

describe('detectWeekdayPatterns', () => {
  test('identifies weekday patterns correctly')
  test('handles insufficient data')
  test('returns empty for no patterns')
})

describe('calculateStreak', () => {
  test('calculates current streak correctly')
  test('finds longest streak')
  test('handles broken streaks')
  test('returns 0 for no data')
})

describe('getMoodBreakdown', () => {
  test('counts mood distribution correctly')
  test('handles all mood levels')
  test('returns zeros for missing moods')
})
```

### `src/utils/badgeSystem.js`

**Test Suite: badgeSystem.test.js**

```javascript
describe('checkBadgeUnlocks', () => {
  test('unlocks first mood badge')
  test('unlocks streak badges at milestones')
  test('unlocks circle participation badges')
  test('does not unlock already earned badges')
})

describe('calculateProgress', () => {
  test('calculates percentage correctly')
  test('handles edge cases (0, 100)')
})
```

### `src/utils/premiumUtils.js`

**Test Suite: premiumUtils.test.js**

```javascript
describe('isPremiumActive', () => {
  test('returns true for active subscription')
  test('returns false for expired subscription')
  test('returns false for no subscription')
})

describe('isTrialActive', () => {
  test('returns true during trial period')
  test('returns false after trial expires')
})
```

### `src/utils/helpers.js`

**Test Suite: helpers.test.js**

```javascript
describe('formatNumber', () => {
  test('formats thousands with K')
  test('formats millions with M')
  test('handles small numbers')
})

describe('formatDate', () => {
  test('formats date correctly')
  test('handles invalid dates')
})
```

---

## 2. Component Tests

### Core Components

**Test Suite: MoodTracker.test.jsx**

```javascript
describe('MoodTracker', () => {
  test('renders all mood options')
  test('selects mood on click')
  test('saves mood to localStorage')
  test('calls onMoodLogged callback')
  test('shows note input when mood selected')
  test('validates required fields')
})
```

**Test Suite: MoodCalendar.test.jsx**

```javascript
describe('MoodCalendar', () => {
  test('renders current month')
  test('displays mood data correctly')
  test('navigates between months')
  test('shows empty state for no data')
  test('highlights today')
})
```

**Test Suite: MoodTrends.test.jsx**

```javascript
describe('MoodTrends', () => {
  test('renders chart with data')
  test('shows empty state for insufficient data')
  test('switches between time periods')
  test('displays correct statistics')
})
```

**Test Suite: Navigation.test.jsx**

```javascript
describe('Navigation', () => {
  test('renders all navigation items')
  test('highlights active route')
  test('navigates on click')
  test('shows mobile menu')
  test('displays user avatar')
})
```

**Test Suite: PostCard.test.jsx**

```javascript
describe('PostCard', () => {
  test('renders post content')
  test('displays author info')
  test('shows heart count')
  test('handles heart action')
  test('handles share action')
  test('shows comment count')
})
```

**Test Suite: CreatePostModal.test.jsx**

```javascript
describe('CreatePostModal', () => {
  test('opens and closes modal')
  test('validates post content')
  test('submits post successfully')
  test('handles anonymous toggle')
  test('clears form on close')
})
```

### Error Handling Components

**Test Suite: ErrorBoundary.test.jsx**

```javascript
describe('ErrorBoundary', () => {
  test('renders children when no error')
  test('catches and displays errors')
  test('shows reload button')
  test('shows go home button')
  test('logs errors in production')
})
```

**Test Suite: SafeComponent.test.jsx**

```javascript
describe('SafeComponent', () => {
  test('renders children normally')
  test('catches component errors')
  test('shows error message')
  test('isolates errors from parent')
})
```

### Onboarding Components

**Test Suite: OnboardingFlow.test.jsx**

```javascript
describe('OnboardingFlow', () => {
  test('shows welcome screen first')
  test('progresses through steps')
  test('validates username input')
  test('validates age confirmation')
  test('saves user data on completion')
  test('calls onComplete callback')
})
```

---

## 3. Page Tests

### HomePage.test.jsx

```javascript
describe('HomePage', () => {
  test('renders welcome message')
  test('displays user avatar')
  test('shows mood tracker')
  test('renders all 15 wellness tool cards')
  test('handles mood logging')
  test('shows error state gracefully')
})
```

### CirclesPage.test.jsx

```javascript
describe('CirclesPage', () => {
  test('renders circle categories')
  test('displays circle cards')
  test('filters circles by category')
  test('searches circles')
  test('joins circle')
  test('shows joined circles')
})
```

### CircleFeedPage.test.jsx

```javascript
describe('CircleFeedPage', () => {
  test('loads circle data')
  test('displays posts')
  test('sorts posts correctly')
  test('filters posts')
  test('loads more posts on scroll')
  test('opens create post modal')
  test('leaves circle')
})
```

### InsightsPage.test.jsx

```javascript
describe('InsightsPage', () => {
  test('shows insufficient data message')
  test('displays mood analytics')
  test('switches time periods')
  test('shows patterns and insights')
  test('displays suggestions')
  test('handles empty state')
})
```

### ProfilePage.test.jsx

```javascript
describe('ProfilePage', () => {
  test('displays user info')
  test('shows badge collection')
  test('displays statistics')
  test('shows activity history')
  test('edits profile')
})
```

### SettingsPage.test.jsx

```javascript
describe('SettingsPage', () => {
  test('loads saved settings')
  test('updates notification settings')
  test('changes theme')
  test('exports data')
  test('deletes account with confirmation')
  test('toggles premium (dev mode)')
})
```

### PremiumPage.test.jsx

```javascript
describe('PremiumPage', () => {
  test('displays pricing plans')
  test('shows feature comparison')
  test('starts trial')
  test('handles subscription')
  test('redirects if already premium')
})
```

---

## 4. Hook Tests

### usePWA.test.js

```javascript
describe('usePWA', () => {
  test('detects if app is installable')
  test('detects if app is installed')
  test('tracks online/offline status')
  test('handles install prompt')
})
```

### useTheme.test.js

```javascript
describe('useTheme', () => {
  test('loads saved theme')
  test('switches to light theme')
  test('switches to dark theme')
  test('respects system preference')
})
```

---

## 5. Integration Tests

### Mood Tracking Flow

```javascript
describe('Mood Tracking Integration', () => {
  test('logs mood and updates calendar')
  test('logs mood and updates trends')
  test('logs mood and updates insights')
  test('maintains streak on consecutive days')
})
```

### Circle Interaction Flow

```javascript
describe('Circle Interaction', () => {
  test('joins circle and sees feed')
  test('creates post in circle')
  test('hearts post and sees in profile')
  test('leaves circle and removes from list')
})
```

### Premium Flow

```javascript
describe('Premium Subscription', () => {
  test('starts trial and unlocks features')
  test('trial expires and locks features')
  test('subscribes and maintains access')
  test('cancels and loses access')
})
```

---

## 6. localStorage Tests

### Data Persistence

```javascript
describe('localStorage Integration', () => {
  test('saves mood data correctly')
  test('loads mood data on mount')
  test('updates existing data')
  test('handles corrupted data')
  test('clears data on logout')
})
```

---

## 7. Accessibility Tests

```javascript
describe('Accessibility', () => {
  test('all buttons have aria-labels')
  test('forms have proper labels')
  test('keyboard navigation works')
  test('screen reader announcements')
  test('color contrast meets WCAG')
})
```

---

## 8. Performance Tests

```javascript
describe('Performance', () => {
  test('renders large mood dataset efficiently')
  test('infinite scroll performs well')
  test('chart rendering is optimized')
  test('image loading is lazy')
})
```

---

## Test Coverage Goals

- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage
- **Pages**: 70%+ coverage
- **Overall**: 75%+ coverage

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test MoodTracker.test.jsx

# Run in watch mode
npm test -- --watch

# Run integration tests only
npm test -- integration/
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

---

## Priority Testing Order

1. **Critical Path** (Week 1)
   - MoodTracker
   - MoodCalendar
   - HomePage
   - Navigation
   - moodAnalysis utils

2. **Core Features** (Week 2)
   - CirclesPage
   - PostCard
   - CreatePostModal
   - InsightsPage
   - badgeSystem utils

3. **Secondary Features** (Week 3)
   - ProfilePage
   - SettingsPage
   - PremiumPage
   - OnboardingFlow

4. **Advanced Features** (Week 4)
   - All Priority 4-7 pages
   - Integration tests
   - E2E tests

---

## Mock Data Strategy

```javascript
// tests/mocks/mockData.js
export const mockUser = { /* ... */ }
export const mockMoods = { /* ... */ }
export const mockCircles = { /* ... */ }
export const mockPosts = { /* ... */ }

// tests/mocks/localStorage.js
export const mockLocalStorage = () => {
  let store = {}
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => { store[key] = value },
    clear: () => { store = {} }
  }
}
```

---

## Test Utilities

```javascript
// tests/utils/testUtils.jsx
export const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

export const renderWithProviders = (component) => {
  return render(
    <ErrorBoundary>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ErrorBoundary>
  )
}
```

---

**Total Test Files**: ~60
**Estimated Test Cases**: ~400+
**Implementation Time**: 4 weeks
**Maintenance**: Ongoing with new features
