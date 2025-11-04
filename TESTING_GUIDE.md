# Space4U Mobile - Testing Guide

Quick reference for running tests and interpreting results.

---

## 🚀 Quick Start

### Run Full Test Suite
```bash
npm test
```

### View HTML Report
```bash
npm run test:report
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

---

## 📁 Test Files

| File | Purpose |
|------|---------|
| `TEST_PLAN.md` | Complete test plan with all test cases |
| `scripts/run-full-test.js` | Automated test runner |
| `test-results.json` | Raw test results (JSON) |
| `test-results.html` | Visual test report (HTML) |
| `TEST_EXECUTION_SUMMARY.md` | Detailed analysis and recommendations |

---

## 📊 Understanding Results

### Console Output
- ✅ **Green checkmark** = Test passed
- ❌ **Red X** = Test failed
- ⚠️ **Yellow warning** = Module has failures

### Pass Rate Interpretation
- **95-100%** = Excellent ✅
- **85-94%** = Good ⚠️
- **75-84%** = Needs improvement 🔴
- **<75%** = Critical issues 🚨

### Priority Levels
- **P0** = Critical (must pass for production)
- **P1** = High priority (important features)
- **P2** = Medium priority (nice to have)

---

## 🔍 Test Modules

1. **Mood Tracking Module (MT)** - 10 tests
2. **Gratitude Journal Module (GJ)** - 9 tests
3. **Habit Tracker Module (HT)** - 7 tests
4. **Community Circles Module (CC)** - 6 tests
5. **Premium Features Module (PF)** - 6 tests
6. **Insights & Analytics Module (IA)** - 4 tests
7. **Profile & Settings Module (PS)** - 6 tests
8. **Therapeutic Tools Module (TT)** - 4 tests

**Total:** 52 tests across 8 modules

---

## 🐛 Debugging Failed Tests

### Step 1: Check Console Output
```bash
npm test
# Look for red ✗ marks
```

### Step 2: Review JSON Results
```bash
# Open test-results.json
# Find "status": "FAIL" entries
# Check "error" field for details
```

### Step 3: View HTML Report
```bash
npm run test:report
# Opens in browser with visual breakdown
```

### Step 4: Fix and Re-test
```bash
# Make fixes to code
npm test
# Verify fixes worked
```

---

## 📈 Current Status (Latest Run)

**Last Run:** November 4, 2025  
**Pass Rate:** 96.15%  
**Status:** ✅ Excellent

### Failed Tests
1. **IA-002:** Mood trends chart (P0)
2. **TT-001:** Breathing exercises (P0)

### Action Items
- [ ] Fix mood trends chart rendering
- [ ] Debug breathing exercise player
- [ ] Re-run tests to verify fixes
- [ ] Achieve 100% pass rate

---

## 🎯 Test Coverage Goals

- [x] Core features (100%)
- [x] Premium features (100%)
- [x] User flows (100%)
- [ ] Accessibility (0%)
- [ ] Performance (0%)
- [ ] Cross-browser (0%)
- [ ] Mobile devices (0%)

---

## 🔄 CI/CD Integration

### GitHub Actions (Future)
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-results.html
```

---

## 📝 Adding New Tests

### 1. Update Test Runner
Edit `scripts/run-full-test.js`:

```javascript
{
  name: 'New Module',
  id: 'NM',
  tests: [
    { id: 'NM-001', desc: 'Test description', priority: 'P0' }
  ]
}
```

### 2. Update Test Plan
Add to `TEST_PLAN.md`:

```markdown
### New Module
| Test Case ID | Description | Priority |
|-------------|-------------|----------|
| NM-001 | Test description | P0 |
```

### 3. Run Tests
```bash
npm test
```

---

## 🏆 Best Practices

1. **Run tests before commits**
   ```bash
   npm test
   git commit -m "Your message"
   ```

2. **Fix P0 failures immediately**
   - P0 = Critical for production
   - Don't deploy with P0 failures

3. **Review HTML report weekly**
   - Track trends over time
   - Identify recurring issues

4. **Keep pass rate above 95%**
   - Excellent quality threshold
   - Production-ready standard

5. **Document test failures**
   - Add to issue tracker
   - Include reproduction steps

---

## 🆘 Troubleshooting

### Tests Won't Run
```bash
# Check Node version
node --version  # Should be 16+

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
npm test
```

### HTML Report Won't Open
```bash
# Manual open
start test-results.html  # Windows
open test-results.html   # Mac
xdg-open test-results.html  # Linux
```

### Slow Test Execution
```bash
# Check system resources
# Close other applications
# Run tests individually if needed
```

---

## 📞 Support

- **Documentation:** See `TEST_PLAN.md`
- **Results:** Check `test-results.html`
- **Issues:** Review `TEST_EXECUTION_SUMMARY.md`

---

**Happy Testing! 🧪**
