# Phase 2: Core Pages Translation - CHECKLIST

**Goal**: Translate 5 core pages to reach 40% total coverage  
**Estimated Time**: 6-8 hours  
**Status**: Ready to start

---

## 📋 Pages to Translate

### 1. CirclesPage ⏳
**Priority**: High (most used feature)  
**Estimated Keys**: ~30  
**Estimated Time**: 1-1.5 hours

**Checklist**:
- [ ] Import `useTranslation` hook
- [ ] Add `const { t } = useTranslation()`
- [ ] Replace page title and subtitle
- [ ] Replace filter buttons (All, Joined, Popular)
- [ ] Replace search placeholder
- [ ] Replace category names (8 categories)
- [ ] Replace "Join Circle" / "Leave Circle" buttons
- [ ] Replace member/post counts
- [ ] Replace "No circles found" message
- [ ] Test in browser (English)
- [ ] Test language switching
- [ ] Commit changes

**Key Sections Used**:
- `circles.title`
- `circles.subtitle`
- `circles.categories.*`
- `circles.joinCircle`
- `circles.leaveCircle`
- `circles.search`
- `common.all`

---

### 2. InsightsPage ⏳
**Priority**: High (core feature)  
**Estimated Keys**: ~40  
**Estimated Time**: 1.5-2 hours

**Checklist**:
- [ ] Import `useTranslation` hook
- [ ] Add `const { t } = useTranslation()`
- [ ] Replace page title and subtitle
- [ ] Replace section titles (Mood Trends, Achievements, Statistics)
- [ ] Replace stat labels (Average Mood, Consistency, Best Day)
- [ ] Replace badge names and descriptions
- [ ] Replace "View All" / "Unlocked" / "Locked" labels
- [ ] Replace "No badges yet" message
- [ ] Replace progress indicators
- [ ] Replace mood breakdown labels
- [ ] Test in browser (English)
- [ ] Test language switching
- [ ] Commit changes

**Key Sections Used**:
- `insights.title`
- `insights.subtitle`
- `insights.moodTrends`
- `insights.achievements`
- `insights.statistics`
- `insights.averageMood`
- `insights.badgesEarned`

---

### 3. ProfilePage ⏳
**Priority**: High (user engagement)  
**Estimated Keys**: ~35  
**Estimated Time**: 1-1.5 hours

**Checklist**:
- [ ] Import `useTranslation` hook
- [ ] Add `const { t } = useTranslation()`
- [ ] Replace page title and subtitle
- [ ] Replace "Edit Profile" button
- [ ] Replace "Change Avatar" button
- [ ] Replace section titles (Stats, Badges, Circles)
- [ ] Replace stat labels (Total Posts, Comments, etc.)
- [ ] Replace "Member Since" label
- [ ] Replace "Logout" button
- [ ] Replace "Delete Account" button
- [ ] Replace confirmation messages
- [ ] Replace "Export My Data" button
- [ ] Test in browser (English)
- [ ] Test language switching
- [ ] Commit changes

**Key Sections Used**:
- `profile.title`
- `profile.subtitle`
- `profile.editProfile`
- `profile.badges`
- `profile.stats`
- `profile.logout`
- `profile.deleteAccount`

---

### 4. ResourceLibraryPage ⏳
**Priority**: Medium (content heavy)  
**Estimated Keys**: ~50  
**Estimated Time**: 2-2.5 hours

**Checklist**:
- [ ] Import `useTranslation` hook
- [ ] Add `const { t } = useTranslation()`
- [ ] Replace page title and subtitle
- [ ] Replace category tabs (Articles, Exercises, Crisis, etc.)
- [ ] Replace search placeholder
- [ ] Replace filter labels
- [ ] Replace "Read More" / "Watch Now" / "Listen Now" buttons
- [ ] Replace "Bookmark" / "Bookmarked" labels
- [ ] Replace "Share" button
- [ ] Replace read time labels (e.g., "5 min read")
- [ ] Replace author labels
- [ ] Replace "Related Resources" section
- [ ] Replace crisis hotline information
- [ ] Replace "Call Now" / "Text Support" buttons
- [ ] Test in browser (English)
- [ ] Test language switching
- [ ] Commit changes

**Key Sections Used**:
- `resources.title`
- `resources.subtitle`
- `resources.articles`
- `resources.exercises`
- `resources.crisis`
- `resources.searchResources`
- `resources.readTime`
- `resources.crisisHotline`

---

### 5. SettingsPage (Complete Remaining) ⏳
**Priority**: High (20% done, need to finish)  
**Estimated Keys**: ~80  
**Estimated Time**: 2-3 hours

**Checklist**:
- [x] Title and subtitle (already done)
- [ ] General section (language, notifications)
- [ ] Privacy section (anonymous mode, data sharing)
- [ ] Theme section (light/dark/auto)
- [ ] Account section (password, email)
- [ ] Sound section (sound effects, haptics)
- [ ] Security section (biometric, PIN, auto-lock)
- [ ] Storage section (cache, data usage)
- [ ] Backup section (auto backup, restore)
- [ ] Social section (share progress, friend requests)
- [ ] Wellness section (goal setting, tracking)
- [ ] Localization section (date/time format)
- [ ] Behavior section (animations, auto-save)
- [ ] Advanced section (developer mode, debug)
- [ ] All toggle labels and descriptions
- [ ] All button labels
- [ ] Test in browser (English)
- [ ] Test language switching
- [ ] Commit changes

**Key Sections Used**:
- `settings.general`
- `settings.privacy`
- `settings.theme`
- `settings.account`
- `settings.sound`
- `settings.security`
- `settings.storage`
- `settings.backup`
- `settings.social`
- `settings.wellness`
- `settings.localization`
- `settings.behavior`
- `settings.advanced`

---

## 🎯 Success Criteria

### For Each Page
- ✅ No hardcoded strings remain
- ✅ All text changes when switching languages
- ✅ Variables interpolate correctly
- ✅ No console errors
- ✅ Build succeeds
- ✅ Language switcher works

### Overall Phase 2
- ✅ 5 pages fully translated
- ✅ ~235 hardcoded strings replaced
- ✅ 40% total coverage achieved
- ✅ All validation scripts pass
- ✅ Build time remains <30 seconds
- ✅ Bundle size increase <10%

---

## 🛠️ Translation Workflow

### Step-by-Step Process

#### 1. Open Page File
```bash
# Example for CirclesPage
code src/pages/CirclesPage.jsx
```

#### 2. Add Translation Hook
```javascript
import { useTranslation } from 'react-i18next'

function CirclesPage() {
  const { t } = useTranslation()
  // ... rest of component
}
```

#### 3. Find Hardcoded Strings
Search for patterns:
- `"text"` or `'text'` in JSX
- Button labels
- Titles and headings
- Placeholders
- Error messages

#### 4. Replace with Translation Keys
```javascript
// Before
<h1>Support Circles</h1>

// After
<h1>{t('circles.title')}</h1>
```

#### 5. Test in Browser
```bash
npm run dev
# Open http://localhost:5173
# Test language switching
```

#### 6. Verify Build
```bash
npm run build
# Should succeed with no errors
```

#### 7. Commit Changes
```bash
git add src/pages/CirclesPage.jsx
git commit -m "feat(i18n): translate CirclesPage"
```

---

## 📊 Progress Tracking

### Completion Status
- [ ] CirclesPage (0%)
- [ ] InsightsPage (0%)
- [ ] ProfilePage (0%)
- [ ] ResourceLibraryPage (0%)
- [ ] SettingsPage (20% → 100%)

### Time Tracking
| Page | Estimated | Actual | Status |
|------|-----------|--------|--------|
| CirclesPage | 1-1.5h | - | ⏳ |
| InsightsPage | 1.5-2h | - | ⏳ |
| ProfilePage | 1-1.5h | - | ⏳ |
| ResourceLibraryPage | 2-2.5h | - | ⏳ |
| SettingsPage | 2-3h | - | ⏳ |
| **Total** | **6-8h** | **-** | **⏳** |

---

## 🐛 Common Issues & Solutions

### Issue: Translation key not found
**Solution**: Check if key exists in `en.json`
```javascript
// Add fallback
{t('key', 'Fallback text')}
```

### Issue: Variable not interpolating
**Solution**: Check syntax
```javascript
// Correct
{t('welcome', { name: user.username })}

// Wrong
{t('welcome', user.username)}
```

### Issue: Build fails after changes
**Solution**: Check for syntax errors
```bash
# Validate JSON
npm run i18n:validate

# Check for missing imports
# Ensure useTranslation is imported
```

---

## 📚 Reference

### Quick Links
- **Implementation Plan**: `I18N_IMPLEMENTATION_PLAN.md`
- **Quick Reference**: `I18N_QUICK_REFERENCE.md`
- **Phase 1 Report**: `PHASE1_COMPLETION_REPORT.md`
- **Translation Keys**: `src/i18n/locales/en.json`

### Useful Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Validate translations
npm run i18n:validate

# Find missing translations
npm run i18n:missing

# Run tests
npm run i18n:test
```

---

## 🎉 Completion Checklist

### When All Pages Are Done
- [ ] All 5 pages translated
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Language switching works on all pages
- [ ] No console errors
- [ ] Documentation updated
- [ ] Commit all changes
- [ ] Create Phase 2 completion report
- [ ] Start Phase 3 (feature pages)

---

**Phase 2 Start Date**: [To be filled]  
**Phase 2 End Date**: [To be filled]  
**Total Time**: [To be filled]  
**Status**: Ready to start ⏳
