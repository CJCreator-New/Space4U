# Enable Premium for Testing

## Quick Fix: Enable Premium Status

The premium features page is showing a paywall because you don't have premium status enabled. Here's how to fix it:

### Option 1: Browser Console (Fastest)

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Paste this code and press Enter:

```javascript
localStorage.setItem('safespace_premium', JSON.stringify({
  isPremium: true,
  plan: 'annual',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  trialUsed: false
}))
```

4. Refresh the page (F5)
5. Now visit `/premium/features` - you should see all features!

### Option 2: Through the App

1. Go to `/premium` page
2. Click "Start 7-Day Free Trial"
3. Complete the mock payment flow
4. You'll be redirected to success page
5. Now you can access `/premium/features`

### Option 3: Settings Page

1. Go to `/settings`
2. Look for "Premium Status" section
3. There should be a toggle or button to enable premium

### Verify Premium Status

After enabling, check if it worked:

```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem('safespace_premium')))
// Should show: { isPremium: true, ... }
```

### What You Should See

Once premium is enabled, the `/premium/features` page will show:

1. **Streak Insurance** - Protect your streak with 2 freezes/month
2. **Custom Themes** - 8 beautiful color themes
3. **Wellness Breakdown** - Detailed wellness score analysis
4. **Predictive Alerts** - AI-powered mood forecasting
5. **Private Groups** - Create invite-only support circles

All features will be fully functional without any blur or paywall overlay!

### Troubleshooting

If you still see a blank/faded page:

1. **Clear localStorage completely**:
   ```javascript
   localStorage.clear()
   ```

2. **Restart the app** (go through onboarding again)

3. **Enable premium** using Option 1 above

4. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### For Development

To always have premium enabled during development, add this to your browser console:

```javascript
// Auto-enable premium on every page load
if (!JSON.parse(localStorage.getItem('safespace_premium') || '{}').isPremium) {
  localStorage.setItem('safespace_premium', JSON.stringify({
    isPremium: true,
    plan: 'annual',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  }))
  location.reload()
}
```
