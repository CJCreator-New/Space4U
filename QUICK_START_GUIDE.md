# Quick Start Guide - Space4U

## 🚀 Getting Started

### Step 1: Restart Development Server

```bash
# Stop current server (if running)
Press Ctrl+C in terminal

# Start fresh
npm run dev
```

### Step 2: Clear Browser Cache

**Option A: Hard Reload**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Option B: DevTools**
1. Press `F12` to open DevTools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Step 3: Open Application

Navigate to: `http://localhost:5173`

---

## 📍 Feature Access Map

### From Homepage (/)

You should see **10 feature cards** in the "Wellness Tools" section:

1. **❤️ Gratitude** → `/gratitude`
2. **🎯 Habits** → `/habits`
3. **💭 Emotions** → `/emotions`
4. **🛠️ Coping Skills** → `/coping-skills`
5. **⏰ Reminders** → `/reminders`
6. **🧰 Therapy Tools** → `/tools`
7. **📊 Wellness Score** → `/wellness`
8. **🚀 Advanced Tools** → `/advanced-tools`
9. **🏆 Gamification** → `/gamification`
10. **📅 Wellness Plan** → `/wellness-plan`

### From Navigation Bar

**Mobile (Bottom):**
- 🏠 Home
- 👥 Circles
- 🧠 Insights
- ❤️ Gratitude
- 🎯 Tools
- 👤 Profile

**Desktop (Sidebar):**
- Same as mobile

---

## ✅ Quick Feature Test

### Test Priority 1 Features (5 features)

1. **Gratitude Journal** (`/gratitude`)
   - Click "Add Entry"
   - Add 3 gratitude items
   - Select mood
   - Save
   - ✅ Should see entry in list

2. **Habit Tracker** (`/habits`)
   - Click "Add Habit"
   - Enter name (e.g., "Exercise")
   - Select icon
   - Create
   - Click circle to mark complete
   - ✅ Should see checkmark and streak

3. **Emotion Tracker** (`/emotions`)
   - Click "Log Emotion"
   - Select primary emotion (e.g., "joy")
   - Select secondary emotions
   - Set intensity
   - Save
   - ✅ Should see log in list

4. **Coping Skills** (`/coping-skills`)
   - Browse 10 skills
   - Click star to favorite
   - Use search bar
   - Click filter buttons
   - ✅ Should filter correctly

5. **Reminders** (`/reminders`)
   - Click "Add Reminder"
   - Select type
   - Set time
   - Choose days
   - Create
   - ✅ Should see reminder in list

### Test Priority 2 Features (7 features)

6. **Wellness Dashboard** (`/wellness`)
   - ✅ Should see wellness score (0-100)
   - ✅ Should see 4 metric cards
   - ✅ Should see recommendations

7. **Advanced Tools** (`/advanced-tools`)
   - Click each tool card:
     - Trigger Tracker
     - Journaling Prompts (10 prompts)
     - Worry Time
     - Self-Compassion (4 prompts)
     - Therapy Prep
     - Medications
   - ✅ Each should open correctly

### Test Priority 3 Features (5 features)

8. **Gamification** (`/gamification`)
   - ✅ Should see Level 1 with XP bar
   - ✅ Should see 3 streak cards
   - Click "Challenges" tab
   - ✅ Should see 4 challenges
   - Click "Quests" tab
   - ✅ Should see 3 quests

9. **Wellness Plan** (`/wellness-plan`)
   - Click "Create Plan"
   - Click "Add Activity"
   - Enter activity details
   - Save
   - ✅ Should see activity in list
   - Click circle to mark complete
   - ✅ Should see checkmark

---

## 🐛 Troubleshooting

### Problem: Features not showing on homepage

**Solution:**
```bash
# 1. Stop server
Ctrl+C

# 2. Clear Vite cache
rm -rf node_modules/.vite
# Or on Windows:
rmdir /s /q node_modules\.vite

# 3. Restart
npm run dev

# 4. Hard reload browser
Ctrl+Shift+R
```

### Problem: "Module not found" error

**Check these files exist:**
```
src/pages/GratitudeJournalPage.jsx
src/pages/HabitTrackerPage.jsx
src/pages/EmotionTrackerPage.jsx
src/pages/CopingSkillsPage.jsx
src/pages/RemindersPage.jsx
src/pages/WellnessDashboardPage.jsx
src/pages/Priority2FeaturesPage.jsx
src/pages/GamificationPage.jsx
src/pages/WellnessPlanPage.jsx

src/components/priority2/TriggerTracker.jsx
src/components/priority2/JournalingPrompts.jsx
src/components/priority2/WorryScheduler.jsx
src/components/priority2/SelfCompassion.jsx
src/components/priority2/TherapyPrep.jsx
src/components/priority2/MedicationTracker.jsx
```

### Problem: Blank page or white screen

**Solution:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Look for red error messages
4. Fix the error shown
5. Refresh page

### Problem: 404 Not Found

**Check:**
1. URL is correct
2. Route exists in `src/App.jsx`
3. Component is imported
4. Server is running

---

## 📊 Expected Results

### Homepage
- ✅ Mood tracker visible
- ✅ Mood calendar visible
- ✅ Mood trends chart visible
- ✅ 10 wellness tool cards visible

### All Feature Pages
- ✅ Load without errors
- ✅ Show proper UI
- ✅ Can create new entries
- ✅ Data persists in localStorage
- ✅ Empty states show when no data

---

## 🎯 Feature Count

### Total: 33 Features

**Phase 1 (16):**
- Mood tracking, circles, therapeutic tools, etc.

**Priority 1 (5):**
- Gratitude, Habits, Emotions, Coping Skills, Reminders

**Priority 2 (7):**
- Triggers, Wellness Score, Journal, Worry, Compassion, Therapy, Meds

**Priority 3 (5):**
- Challenges, Streaks, Quests, Mood Scales, Wellness Plan

---

## 🔍 Verification Commands

### Check if files exist:
```bash
# Windows
dir src\pages\*Page.jsx
dir src\components\priority2\*.jsx

# Unix/Mac
ls src/pages/*Page.jsx
ls src/components/priority2/*.jsx
```

### Check for errors:
```bash
# Look at terminal output when running npm run dev
# Should see:
# ✓ built in XXXms
# No red errors
```

---

## ✨ Success Indicators

### You'll know it's working when:

1. **Homepage loads** with all 10 feature cards
2. **Navigation** shows 6 items
3. **All routes work** (no 404 errors)
4. **Can create data** in each feature
5. **Data persists** after refresh
6. **No console errors** (F12 → Console)

---

## 📞 Still Having Issues?

### Check:
1. ✅ Node.js version (16+)
2. ✅ npm install completed
3. ✅ No errors in terminal
4. ✅ Port 5173 is available
5. ✅ Browser cache cleared

### Debug Steps:
1. Check browser console (F12)
2. Check terminal output
3. Verify file paths
4. Restart everything
5. Try different browser

---

## 🎉 You're Ready!

Once you see all features working:
1. Test each feature thoroughly
2. Create sample data
3. Verify data persistence
4. Check responsive design
5. Test dark mode
6. Ready for deployment!

---

**Happy Testing! 🚀**
