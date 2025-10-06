# Troubleshooting Guide

## ✅ Fixed: Homepage Shows All Features After Error

### What Was Fixed:

1. **ErrorBoundary** - Now properly resets state when going home
2. **HomePage** - Added error handling to prevent crashes
3. **SafeComponent** - Individual components can fail without crashing the page
4. **Wellness Tools** - Always visible even if mood components fail

### How It Works Now:

When an error occurs:
- Individual components show a yellow warning box
- The rest of the page continues to work
- All 15 wellness tool cards remain accessible
- "Go to Home" button properly reloads the app

## Common Issues & Solutions

### Issue 1: Error on Homepage
**Symptoms**: Error message appears on homepage
**Solution**: 
- Click "Reload App" button
- Or click "Go to Home" button (will force full reload)
- Wellness tools section will always be visible

### Issue 2: Mood Tracker Not Loading
**Symptoms**: Yellow warning box where mood tracker should be
**Solution**:
- This is expected behavior - the error is isolated
- Scroll down to see all 15 wellness tool cards
- They will work normally
- Refresh page to try loading mood tracker again

### Issue 3: Premium Features Not Showing
**Symptoms**: Upgrade prompt instead of features
**Solution**:
1. Go to `/settings`
2. Toggle "Developer Mode" at the top
3. Visit `/premium/features` again

### Issue 4: Blank Page After Navigation
**Symptoms**: Page is blank or shows only basic content
**Solution**:
1. Check browser console (F12) for errors
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Clear localStorage: `localStorage.clear()` in console
4. Restart dev server

### Issue 5: Features Not Showing After Dev Server Restart
**Symptoms**: Only basic features visible
**Solution**:
1. Stop dev server (Ctrl+C)
2. Clear browser cache
3. Delete `node_modules/.vite` folder
4. Run `npm run dev` again
5. Hard refresh browser

## Error Recovery Flow

```
Error Occurs
    ↓
SafeComponent Catches It
    ↓
Shows Yellow Warning Box
    ↓
Rest of Page Continues Working
    ↓
Wellness Tools Always Visible
    ↓
User Can Navigate to Other Features
```

## Developer Tools

### Check What's in localStorage
```javascript
// In browser console
console.log('User:', localStorage.getItem('safespace_user'))
console.log('Premium:', localStorage.getItem('safespace_premium'))
console.log('Moods:', localStorage.getItem('safespace_moods'))
```

### Enable Premium
```javascript
localStorage.setItem('safespace_premium', JSON.stringify({
  isPremium: true,
  plan: 'annual',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
}))
location.reload()
```

### Clear All Data
```javascript
localStorage.clear()
location.reload()
```

### Check for Errors
```javascript
// In browser console
console.log('Errors:', window.errors)
```

## Component Error Isolation

The app now uses SafeComponent wrapper for critical sections:
- ✅ MoodTracker - Can fail independently
- ✅ MoodCalendar - Can fail independently  
- ✅ MoodTrends - Can fail independently
- ✅ Wellness Tools - Always visible (not wrapped)

This means:
- If mood tracker crashes, you still see wellness tools
- If calendar crashes, you still see wellness tools
- Wellness tools section is guaranteed to render
- All 15 feature cards are always accessible

## Testing Error Recovery

### Test 1: Simulate Component Error
1. Open browser DevTools (F12)
2. Go to Sources tab
3. Find a component file
4. Add a `throw new Error('test')` in the component
5. Reload page
6. You should see yellow warning box
7. Wellness tools should still be visible

### Test 2: Test Error Boundary
1. Cause an error in any component
2. Error boundary should catch it
3. Click "Go to Home"
4. Page should reload completely
5. All 15 wellness tools should be visible

### Test 3: Test Navigation After Error
1. Cause an error on any page
2. Use navigation bar to go to another page
3. Page should load normally
4. Return to homepage
5. All features should be visible

## Prevention Tips

1. **Always wrap risky components** in SafeComponent
2. **Use try-catch** in useEffect hooks
3. **Validate localStorage data** before parsing
4. **Provide fallback values** for all data
5. **Test error scenarios** during development

## Quick Fixes

### Reset Everything
```bash
# Stop dev server
Ctrl+C

# Clear browser
Ctrl+Shift+Delete (clear cache)

# In browser console
localStorage.clear()

# Restart dev server
npm run dev

# Hard refresh
Ctrl+Shift+R
```

### Just Reset Data
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Just Enable Premium
```javascript
// In browser console (or use Settings toggle)
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))
location.reload()
```

## Support

If issues persist:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify all files exist in src/
4. Ensure dev server is running
5. Try a different browser

## Success Indicators

✅ Homepage loads with welcome banner
✅ All 15 wellness tool cards visible
✅ Navigation bar shows 8 items
✅ Can click any wellness tool card
✅ Features load without errors
✅ Premium toggle works in settings

If you see all of these, the app is working correctly!
