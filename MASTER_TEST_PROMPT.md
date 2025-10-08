# Master Test Generation Prompt - Space4U Mental Health Platform

## Application Overview

**Project:** Space4U (Safespace) - Mental Health Support Platform  
**Type:** Privacy-first mental health web application  
**Architecture:** Local-first React SPA with optional backend  
**Total Features:** 46 (100% complete)  
**Total Pages:** 26  
**Total Components:** 60+  
**Privacy Model:** 100% local storage, HIPAA-compliant design

---

## Quick Reference

**Use this prompt with Amazon Q or any AI assistant to generate comprehensive tests for any component.**

### Basic Usage

```
Generate tests for [ComponentName] using the Master Test Prompt guidelines.
Focus on: [specific concerns like accessibility, localStorage, charts, etc.]
```

### Coverage Requirements
- Utilities: 90%+
- Components: 80%+
- Pages: 70%+
- Overall: 75%+
- Critical paths: 100%

---

## Testing Framework Setup

### Installation
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom
```

### Vitest Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      thresholds: { lines: 75, functions: 75, branches: 75, statements: 75 }
    }
  }
})
```

---

## 12 Required Test Scenarios

1. **Rendering Tests** - Component mounts, UI elements present
2. **User Interaction Tests** - Clicks, typing, navigation
3. **Data Persistence Tests** - localStorage operations
4. **Routing & Navigation Tests** - React Router v6
5. **Chart & Analytics Tests** - Recharts visualization
6. **Form Validation Tests** - Input validation
7. **Async Operations Tests** - Loading/error states
8. **Error Handling Tests** - Graceful failures
9. **Accessibility Tests** - WCAG AA compliance
10. **Edge Cases Tests** - Boundary conditions
11. **Premium Feature Gating Tests** - Access control
12. **Mental Health-Specific Tests** - Clinical accuracy, crisis access

---

## Mental Health Testing Principles

### Critical Requirements
- ✅ Crisis features NEVER fail silently
- ✅ Error messages are empathetic, not technical
- ✅ No network requests (100% local storage)
- ✅ PHQ-9/GAD-7 scoring 100% accurate
- ✅ Data export includes ALL user data
- ✅ Complete data deletion with no traces

### Trauma-Informed Testing
- Test stress scenarios (rapid clicks, interrupted flows)
- Validate autosave prevents data loss
- Ensure "Back" buttons never disappear
- Test that errors don't block crisis resources

---

## Component Testing Template

```javascript
// ComponentName.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ComponentName from './ComponentName'

describe('ComponentName', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    localStorage.clear()
    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <ComponentName {...props} />
      </MemoryRouter>
    )
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderComponent()
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should handle button click', async () => {
      renderComponent()
      await user.click(screen.getByRole('button'))
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })

  describe('Data Persistence', () => {
    it('should save to localStorage', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      renderComponent()
      await user.click(screen.getByRole('button', { name: /save/i }))
      expect(setItemSpy).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      renderComponent()
      await user.keyboard('{Tab}')
      expect(screen.getByRole('button')).toHaveFocus()
    })
  })

  describe('Mental Health Context', () => {
    it('should never hide crisis button', () => {
      renderComponent()
      expect(screen.getByRole('link', { name: /crisis/i })).toBeInTheDocument()
    })
  })
})
```

---

## Testing Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test MoodLogger.test.jsx

# Watch mode
npm test -- --watch

# UI mode
npm test -- --ui
```

---

## Priority Testing Order

### Week 1: Critical Path (100% coverage required)
- MoodTracker, MoodCalendar, MoodTrends
- CirclesPage, PostCard, CreatePostModal
- Navigation, HomePage
- moodAnalysis.js, badgeSystem.js

### Week 2: Priority 1 Features
- GratitudeJournal, HabitTracker
- EmotionWheel, CopingSkills
- SmartReminders

### Week 3: Priority 2-3 Features
- WellnessScore, JournalingPrompts
- TriggerTracker, MedicationTracker
- Gamification features

### Week 4: Priority 4-7 & Premium
- Social features, Advanced analytics
- Professional integration, Technical features
- Premium features

---

## Common Test Patterns

### localStorage Testing
```javascript
it('should persist data to localStorage', async () => {
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
  renderComponent()
  await user.click(screen.getByRole('button', { name: /save/i }))
  expect(setItemSpy).toHaveBeenCalledWith(
    'safespace_moods',
    expect.stringContaining('"mood":"happy"')
  )
})
```

### Recharts Testing
```javascript
it('should render chart with data', () => {
  localStorage.setItem('safespace_moods', JSON.stringify([{ mood: 'happy' }]))
  renderComponent()
  expect(screen.getByTestId('line-chart')).toBeInTheDocument()
})
```

### Error Handling Testing
```javascript
it('should show empathetic error message', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Save failed')
  })
  renderComponent()
  await user.click(screen.getByRole('button', { name: /save/i }))
  expect(screen.getByText(/couldn't save/i)).toBeInTheDocument()
  expect(screen.queryByText(/error:/i)).not.toBeInTheDocument()
})
```

### Accessibility Testing
```javascript
it('should be keyboard navigable', async () => {
  renderComponent()
  await user.keyboard('{Tab}')
  expect(screen.getByRole('button')).toHaveFocus()
  await user.keyboard('{Enter}')
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

---

## Test Quality Checklist

Every test must:
- [ ] Be isolated (no shared state)
- [ ] Be deterministic (same input = same output)
- [ ] Have descriptive name
- [ ] Use `userEvent` not `fireEvent`
- [ ] Query by role/label, not testId
- [ ] Properly await async operations
- [ ] Mock external dependencies
- [ ] Clean up after itself
- [ ] Test user behavior, not implementation
- [ ] Include empathetic error messages

---

## Mock Setup

### Test Setup File
```javascript
// src/tests/setup.js
import { expect, afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.clearAllMocks()
})

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}))

// Mock Date
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-01-07T12:00:00'))
})

afterEach(() => {
  vi.useRealTimers()
})
```

---

## Documentation References

- **Full Testing Plan**: See `TESTING_PLAN.md`
- **Feature Roadmap**: See `FEATURE_ROADMAP.md`
- **Quick Start**: See `QUICK_START.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`

---

## Support

For questions about testing:
1. Check `TESTING_PLAN.md` for detailed strategies
2. Review example tests in `tests/` directory
3. Consult Vitest docs: https://vitest.dev
4. React Testing Library: https://testing-library.com/react

---

**This prompt ensures comprehensive, trauma-informed, privacy-focused test coverage for all Space4U features.**

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready ✅
