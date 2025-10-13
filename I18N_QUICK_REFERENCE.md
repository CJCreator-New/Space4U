# i18n Quick Reference Guide

## 🚀 Quick Start: Translating a Page

### Step 1: Import useTranslation Hook
```javascript
import { useTranslation } from 'react-i18next'

function YourPage() {
  const { t } = useTranslation()
  // ... rest of component
}
```

### Step 2: Add Keys to en.json
```json
{
  "yourSection": {
    "title": "Your Title",
    "description": "Your description",
    "button": "Click Me"
  }
}
```

### Step 3: Replace Hardcoded Strings
```javascript
// Before
<h1>Your Title</h1>
<p>Your description</p>
<button>Click Me</button>

// After
<h1>{t('yourSection.title')}</h1>
<p>{t('yourSection.description')}</p>
<button>{t('yourSection.button')}</button>
```

### Step 4: Test in Browser
1. Run `npm run dev`
2. Open app in browser
3. Use LanguageSwitcher to test different languages
4. Verify all strings translate correctly

## 📋 Common Translation Patterns

### Simple String
```javascript
{t('common.save')}
```

### String with Variable
```javascript
// en.json: "welcome": "Welcome, {{name}}!"
{t('welcome', { name: user.username })}
```

### Pluralization
```javascript
// en.json: 
// "item_one": "{{count}} item"
// "item_other": "{{count}} items"
{t('item', { count: items.length })}
```

### Conditional Translation
```javascript
{isPremium ? t('premium.active') : t('premium.upgrade')}
```

### Array of Translations
```javascript
const options = [
  t('filter.all'),
  t('filter.active'),
  t('filter.completed')
]
```

## 🎯 HomePage Example (Reference)

### Before Translation
```javascript
<h1>Welcome back{user?.username ? `, ${user.username}` : ''}! 👋</h1>
<p>Your mental health support companion</p>
<h2>Wellness Tools</h2>
```

### After Translation
```javascript
const { t } = useTranslation()

<h1>{t('welcome.back')}{user?.username ? `, ${user.username}` : ''}! 👋</h1>
<p>{t('welcome.companion')}</p>
<h2>{t('wellnessTools.title')}</h2>
```

### Translation Keys Added
```json
{
  "welcome": {
    "back": "Welcome back",
    "companion": "Your mental health support companion"
  },
  "wellnessTools": {
    "title": "Wellness Tools"
  }
}
```

## 🔍 Finding Hardcoded Strings

### Manual Search
1. Open page file (e.g., `CirclesPage.jsx`)
2. Search for strings in JSX: `"text"` or `'text'`
3. Look for button labels, titles, descriptions
4. Check error messages and placeholders

### Automated Script
```bash
npm run i18n:missing
```
This generates a report of hardcoded strings.

## 📝 Key Naming Conventions

### Structure
```
section.subsection.key
```

### Examples
```json
{
  "home": {
    "title": "Home",
    "subtitle": "Welcome"
  },
  "mood": {
    "logMood": "Log Mood",
    "addNote": "Add a note"
  },
  "errors": {
    "failedToLoad": "Failed to load",
    "tryAgain": "Try Again"
  }
}
```

### Best Practices
- ✅ Use camelCase for keys: `logMood`, `addNote`
- ✅ Group related keys: `mood.logMood`, `mood.addNote`
- ✅ Reuse common keys: `common.save`, `common.cancel`
- ❌ Avoid deep nesting (max 3 levels)
- ❌ Don't duplicate keys across sections

## 🌍 Multi-Language Workflow

### 1. Complete English First
Add all keys to `en.json` before translating to other languages.

### 2. Copy Structure to Other Languages
```bash
# Copy en.json structure to hi.json
# Then translate values
```

### 3. Use Translation Services
- Google Translate API
- DeepL API
- Manual translation by native speakers

### 4. Validate Completeness
```bash
npm run i18n:validate
```

## 🛠️ Useful Commands

### Development
```bash
npm run dev                 # Start dev server
npm run build              # Build for production
```

### Translation Scripts
```bash
npm run i18n:test          # Run translation tests
npm run i18n:validate      # Validate completeness
npm run i18n:missing       # Find hardcoded strings
npm run i18n:report        # Generate full report
```

### Testing Languages
1. Open app in browser
2. Click language switcher (top-right)
3. Select language to test
4. Navigate through pages
5. Verify all text translates

## 🐛 Common Issues & Solutions

### Issue: Translation Not Showing
**Solution**: Check if key exists in language file
```javascript
// Add fallback
{t('key', 'Fallback text')}
```

### Issue: Variable Not Interpolating
**Solution**: Check syntax
```javascript
// Correct
{t('welcome', { name: 'John' })}

// Wrong
{t('welcome', name)}
```

### Issue: Pluralization Not Working
**Solution**: Use correct key format
```json
{
  "item_one": "{{count}} item",
  "item_other": "{{count}} items"
}
```

### Issue: RTL Layout Broken (Arabic)
**Solution**: Check if RTL classes applied
```javascript
// In config.js, RTL is auto-detected
// Verify dir="rtl" on <html> tag
```

## 📊 Progress Tracking

### Check Current Status
```bash
# Count translated pages
grep -r "useTranslation" src/pages/*.jsx | wc -l

# Count total keys
cat src/i18n/locales/en.json | grep ":" | wc -l
```

### Estimate Remaining Work
- **1 page** = ~30-50 keys = ~30-45 minutes
- **5 pages** = ~200 keys = ~3 hours
- **All 26 pages** = ~1000 keys = ~15-20 hours

## 🎯 Priority Order

### High Priority (Do First)
1. ✅ HomePage - DONE
2. CirclesPage - Most used
3. InsightsPage - Core feature
4. ProfilePage - User engagement
5. ResourceLibraryPage - Content heavy

### Medium Priority
6. SettingsPage - Complete remaining
7. GratitudeJournalPage
8. HabitTrackerPage
9. EmotionTrackerPage
10. CopingSkillsPage

### Low Priority (Do Last)
- Demo pages
- Admin pages
- Rarely used features

## 📚 Resources

### Documentation
- [react-i18next docs](https://react.i18next.com/)
- [i18next docs](https://www.i18next.com/)
- Project: `I18N_IMPLEMENTATION_PLAN.md`
- Project: `TRANSLATION_GUIDE.md`

### Translation Files Location
```
src/i18n/locales/
├── en.json    # English (master)
├── hi.json    # Hindi
├── ta.json    # Tamil
├── te.json    # Telugu
├── bn.json    # Bengali
├── mr.json    # Marathi
├── kn.json    # Kannada
├── ml.json    # Malayalam
├── gu.json    # Gujarati
├── es.json    # Spanish
├── fr.json    # French
├── de.json    # German
└── ar.json    # Arabic (RTL)
```

### Helper Functions
```javascript
import { safeTranslate, formatDate, formatNumber } from '../utils/i18nHelpers'

// Safe translation with fallback
safeTranslate(t, 'key', 'Fallback')

// Format date
formatDate(new Date(), 'en')

// Format number
formatNumber(1234.56, 'en')
```

## ✅ Checklist for Each Page

- [ ] Import useTranslation hook
- [ ] Add const { t } = useTranslation()
- [ ] Identify all hardcoded strings
- [ ] Add keys to en.json
- [ ] Replace strings with t() calls
- [ ] Test in browser (English)
- [ ] Add translations to hi.json (or other languages)
- [ ] Test language switching
- [ ] Run validation script
- [ ] Commit changes

## 🎉 Success Indicators

### Page is Fully Translated When:
- ✅ No hardcoded strings remain
- ✅ All text changes when switching languages
- ✅ Variables interpolate correctly
- ✅ Pluralization works
- ✅ No console errors
- ✅ Build succeeds
- ✅ Validation script passes

---

**Quick Tip**: Start with one page, complete it fully (including testing), then move to the next. This ensures quality over quantity.

**Need Help?**: Check `I18N_IMPLEMENTATION_PLAN.md` for detailed strategy or `TRANSLATION_GUIDE.md` for contributor guidelines.
