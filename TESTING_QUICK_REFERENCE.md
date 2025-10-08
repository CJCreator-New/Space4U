# Testing Quick Reference - Space4U

**Quick access guide for developers**

---

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test MoodTracker.test.jsx

# Watch mode (auto-rerun on changes)
npm test -- --watch
```

---

## 📁 Test File Locations

```
src/
├── utils/
│   ├── premiumUtils.test.js ✅
│   ├── helpers.test.js ✅
│   ├── badgeSystem.test.js ✅
│   └── moodAnalysis.test.js ✅
├── components/
│   ├── MoodTracker.test.jsx ✅
│   ├── Layout.test.jsx ✅
│   ├── Navigation.test.jsx ✅
│   ├── CircleCard.test.jsx ⚠️
│   ├── MoodCalendar.test.jsx ⚠️
│   ├── MoodTrends.test.jsx ⚠️
│   └── PostCard.test.jsx ⚠️
└── tests/
    ├── setup.js (test configuration)
    └── testUtils.jsx (helper functions)
```

---

## 📊 Current Status

| Category | Tests | Passing | Coverage |
|----------|-------|---------|----------|
| Utilities | 118 | 118 ✅ | 97%+ |
| Components | 142 | 96 ⚠️ | ~40% |
| **Total** | **260** | **214** | **~15%** |

**Pass Rate**: 82.3%  
**Target**: 100% passing, 75%+ coverage

---

## 🎯 Test Template

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ComponentName from './ComponentName'

describe('ComponentName', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <ComponentName />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

---

## 🔧 Common Patterns

### Test localStorage
```javascript
it('should save to localStorage', () => {
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
  // ... trigger save action
  expect(setItemSpy).toHaveBeenCalledWith('safespace_moods', expect.any(String))
})
```

### Test User Interaction
```javascript
import { fireEvent } from '@testing-library/react'

it('should handle click', () => {
  render(<Component />)
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

### Test Async Operations
```javascript
import { waitFor } from '@testing-library/react'

it('should load data', async () => {
  render(<Component />)
  await waitFor(() => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument()
  })
})
```

### Mock Hook
```javascript
vi.mock('../hooks/useMoods', () => ({
  useMoods: () => ({
    moods: { '2025-01-07': { mood: 4, emoji: '🙂' } },
    loading: false
  })
}))
```

---

## ⚠️ Known Issues

### Issue 1: UserEvent Timeouts
**Problem**: Tests timeout with `user.click()`  
**Fix**: Use `fireEvent.click()` instead
```javascript
// ❌ Don't use (times out)
await user.click(button)

// ✅ Use this
fireEvent.click(button)
```

### Issue 2: Clipboard Mocking
**Problem**: Cannot mock navigator.clipboard  
**Fix**: Use Object.defineProperty
```javascript
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn() },
  writable: true
})
```

---

## 📋 Test Checklist

Every test should:
- [ ] Have descriptive name
- [ ] Be isolated (no shared state)
- [ ] Clean up after itself
- [ ] Test user behavior, not implementation
- [ ] Include accessibility checks
- [ ] Handle edge cases
- [ ] Use empathetic error messages

---

## 🎓 Best Practices

### DO ✅
- Query by role/label: `screen.getByRole('button')`
- Use fireEvent for clicks: `fireEvent.click(button)`
- Test user behavior: "should allow user to submit form"
- Mock external dependencies
- Clean up in afterEach/beforeEach

### DON'T ❌
- Query by testId (use as last resort)
- Use userEvent.click() (causes timeouts)
- Test implementation details
- Share state between tests
- Forget to await async operations

---

## 📚 Documentation

- **MASTER_TEST_PROMPT.md** - Complete testing guide
- **TESTING_STATUS.md** - Current progress
- **PHASE_2_PLAN.md** - Next steps
- **TESTING_COMPLETE_SUMMARY.md** - Full summary

---

## 🆘 Troubleshooting

### Tests timing out?
```javascript
// Increase timeout for specific test
it('slow test', async () => {
  // test code
}, 10000) // 10 second timeout
```

### Mock not working?
```javascript
// Clear mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})
```

### Component not rendering?
```javascript
// Wrap in MemoryRouter for components using routing
render(
  <MemoryRouter>
    <Component />
  </MemoryRouter>
)
```

---

## 🎯 Coverage Goals

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| Utilities | 97%+ | 90%+ | ✅ Exceeds |
| Components | ~40% | 80%+ | ⏳ In Progress |
| Pages | 0% | 70%+ | ⏳ Not Started |
| Overall | ~15% | 75%+ | ⏳ In Progress |

---

## 🚦 CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test -- --coverage
```

---

## 📞 Need Help?

1. Check **MASTER_TEST_PROMPT.md** for detailed examples
2. Review existing test files for patterns
3. Consult Vitest docs: https://vitest.dev
4. React Testing Library: https://testing-library.com/react

---

**Last Updated**: January 7, 2025  
**Version**: 1.0.0  
**Status**: Phase 1 Complete ✅
