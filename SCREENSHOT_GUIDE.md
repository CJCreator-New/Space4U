→ home...
  ❌ Failed: home - page.waitForTimeout is not a function
  → circles...
  ❌ Failed: circles - page.waitForTimeout is not a function
  → insights...
  ❌ Failed: insights - page.waitForTimeout is not a function
  → profile...
  ❌ Failed: profile - page.waitForTimeout is not a function
  → settings...
  ❌ Failed: settings - page.waitForTimeout is not a function
  → resources...
  ❌ Failed: resources - page.waitForTimeout is not a function
  → premium...
  ❌ Failed: premium - page.waitForTimeout is not a function
  → gratitude...
  ❌ Failed: gratitude - page.waitForTimeout is not a function
  → habits...
  ❌ Failed: habits - page.waitForTimeout is not a function
  → emotions...
  ❌ Failed: emotions - page.waitForTimeout is not a function
  → coping-skills...
  ❌ Failed: coping-skills - page.waitForTimeout is not a function
  → reminders...
  ❌ Failed: reminders - page.waitForTimeout is not a function
  → wellness...
  ❌ Failed: wellness - page.waitForTimeout is not a function# Screenshot Guide for Space4U Pages

## All Application Routes

### Main Pages
1. **Home** - `http://localhost:5174/`
2. **Circles** - `http://localhost:5174/circles`
3. **Insights** - `http://localhost:5174/insights`
4. **Profile** - `http://localhost:5174/profile`
5. **Settings** - `http://localhost:5174/settings`
6. **Resources** - `http://localhost:5174/resources`
7. **Premium** - `http://localhost:5174/premium`

### Gratitude & Wellness
8. **Gratitude Journal** - `http://localhost:5174/gratitude`
9. **Habit Tracker** - `http://localhost:5174/habits`
10. **Emotion Wheel** - `http://localhost:5174/emotions`
11. **Coping Skills** - `http://localhost:5174/coping-skills`
12. **Reminders** - `http://localhost:5174/reminders`
13. **Wellness Score** - `http://localhost:5174/wellness`

### Therapeutic Tools
14. **Tools Hub** - `http://localhost:5174/tools`
15. **Advanced Tools** - `http://localhost:5174/advanced-tools`
16. **CBT Tools** - `http://localhost:5174/tools/cbt`
17. **DBT Tools** - `http://localhost:5174/tools/dbt`
18. **Mindfulness** - `http://localhost:5174/tools/mindfulness`
19. **Sleep Tracker** - `http://localhost:5174/tools/sleep`
20. **Crisis Plan** - `http://localhost:5174/tools/crisis-plan`
21. **Assessments** - `http://localhost:5174/tools/assessments`

### Gamification
22. **Wellness Plan** - `http://localhost:5174/wellness-plan`
23. **Gamification** - `http://localhost:5174/gamification`
24. **Challenges** - `http://localhost:5174/gamification/challenges`
25. **Quests** - `http://localhost:5174/gamification/quests`

### Social & Community
26. **Social Hub** - `http://localhost:5174/social`
27. **Accountability** - `http://localhost:5174/social/accountability`
28. **Peer Support** - `http://localhost:5174/social/peer-support`
29. **Support Requests** - `http://localhost:5174/social/support-requests`

### Analytics
30. **Analytics Dashboard** - `http://localhost:5174/analytics`
31. **Mood Prediction** - `http://localhost:5174/analytics/mood-prediction`
32. **Tag Analytics** - `http://localhost:5174/analytics/tags`
33. **Sleep Analytics** - `http://localhost:5174/analytics/sleep`

### Professional
34. **Professional Hub** - `http://localhost:5174/professional`
35. **Therapist Portal** - `http://localhost:5174/professional/therapist`
36. **Crisis Hotlines** - `http://localhost:5174/professional/crisis`
37. **Data Export** - `http://localhost:5174/professional/export`

### Technical
38. **Technical Hub** - `http://localhost:5174/technical`
39. **Voice Journal** - `http://localhost:5174/technical/voice`
40. **Offline Mode** - `http://localhost:5174/technical/offline`
41. **PWA Settings** - `http://localhost:5174/technical/pwa`

### Premium Features
42. **Premium Features** - `http://localhost:5174/premium/features`
43. **Premium Success** - `http://localhost:5174/premium/success`

### Circle Details
44. **Circle Feed** - `http://localhost:5174/circles/anxiety-support` (example)

## Screenshot Instructions

### Manual Method (Recommended for Quality)

1. **Browser Setup**
   - Use Chrome/Edge DevTools (F12)
   - Set viewport to 1920x1080 (Desktop) or 375x812 (Mobile)
   - Disable browser extensions that might interfere

2. **Taking Screenshots**
   - Press `Ctrl + Shift + P` (Windows) or `Cmd + Shift + P` (Mac)
   - Type "Capture full size screenshot"
   - Save with naming convention: `page-name-desktop.png` or `page-name-mobile.png`

3. **Mobile Screenshots**
   - Toggle device toolbar (Ctrl + Shift + M)
   - Select iPhone 12 Pro or similar
   - Capture full page screenshot

### Automated Method (Using Browser Console)

Run this script in browser console on each page:

```javascript
// Copy and paste this into browser console
const pageName = window.location.pathname.replace(/\//g, '-') || 'home';
const timestamp = new Date().toISOString().slice(0, 10);
const filename = `space4u-${pageName}-${timestamp}.png`;

// Trigger screenshot (works in Chrome DevTools)
console.log(`📸 Screenshot for: ${filename}`);
console.log('Use: Ctrl+Shift+P > "Capture full size screenshot"');
```

### Batch Screenshot Script

Create a file `screenshot-all.js` and run with Node.js + Puppeteer:

```javascript
// Install: npm install puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');

const routes = [
  '/',
  '/circles',
  '/insights',
  '/profile',
  '/settings',
  '/gratitude',
  '/habits',
  '/emotions',
  '/tools',
  '/wellness',
  '/gamification',
  '/social',
  '/analytics',
  '/professional',
  '/technical',
  '/premium'
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Desktop screenshots
  await page.setViewport({ width: 1920, height: 1080 });
  
  for (const route of routes) {
    const url = `http://localhost:5174${route}`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000); // Wait for animations
    
    const filename = `screenshots/desktop${route.replace(/\//g, '-') || '-home'}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`✅ Captured: ${filename}`);
  }
  
  // Mobile screenshots
  await page.setViewport({ width: 375, height: 812 });
  
  for (const route of routes) {
    const url = `http://localhost:5174${route}`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000);
    
    const filename = `screenshots/mobile${route.replace(/\//g, '-') || '-home'}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`✅ Captured: ${filename}`);
  }
  
  await browser.close();
  console.log('🎉 All screenshots captured!');
})();
```

## Screenshot Checklist

### For Each Page:
- [ ] Desktop view (1920x1080)
- [ ] Mobile view (375x812)
- [ ] Tablet view (768x1024) - optional
- [ ] Light mode
- [ ] Dark mode (if applicable)
- [ ] With data populated
- [ ] Empty state (if applicable)
- [ ] Loading state (if applicable)
- [ ] Error state (if applicable)

### Special States to Capture:
- [ ] Modals open
- [ ] Dropdowns expanded
- [ ] Tooltips visible
- [ ] Forms filled
- [ ] Hover states (use :hover in DevTools)
- [ ] Active/selected states

## Naming Convention

```
space4u-[page-name]-[viewport]-[state]-[date].png

Examples:
- space4u-home-desktop-default-2025-01-04.png
- space4u-circles-mobile-empty-2025-01-04.png
- space4u-insights-desktop-loaded-2025-01-04.png
- space4u-gratitude-mobile-modal-2025-01-04.png
```

## Organization Structure

```
screenshots/
├── desktop/
│   ├── home.png
│   ├── circles.png
│   ├── insights.png
│   └── ...
├── mobile/
│   ├── home.png
│   ├── circles.png
│   └── ...
├── tablet/
│   └── ...
├── states/
│   ├── modals/
│   ├── empty/
│   ├── loading/
│   └── errors/
└── README.md
```

## Quick Tips

1. **Clear localStorage** before screenshots for clean state:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **Populate with test data**:
   ```javascript
   // Add test moods
   localStorage.setItem('space4u_moods', JSON.stringify({
     '2025-01-04': { mood: 5, emoji: '😊', label: 'Amazing' }
   }))
   ```

3. **Hide scrollbars** for cleaner screenshots:
   ```css
   * { scrollbar-width: none; }
   *::-webkit-scrollbar { display: none; }
   ```

4. **Use browser extensions**:
   - Awesome Screenshot
   - Full Page Screen Capture
   - GoFullPage

## After Screenshots

1. Review all images for quality
2. Compress images (use TinyPNG or similar)
3. Organize in folders by category
4. Create comparison document
5. Note design improvements needed
6. Share with team/stakeholders

---

**Total Pages to Screenshot**: ~44 pages
**Estimated Time**: 2-3 hours (manual) or 15 minutes (automated)
**Recommended**: Use automated script for consistency
