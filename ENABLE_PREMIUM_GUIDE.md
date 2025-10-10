# How to Enable Premium for Testing

## 🚀 Quick Method (Browser Console)

### Step 1: Open Browser Console
- **Windows/Linux**: Press `F12` or `Ctrl + Shift + I`
- **Mac**: Press `Cmd + Option + I`

### Step 2: Copy & Paste This Command
```javascript
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))
location.reload()
```

### Step 3: Press Enter
The page will reload and you'll have premium access! ✅

---

## 🎯 Alternative Method (Settings Page)

### If you can access Settings:
1. Complete onboarding flow
2. Navigate to **Settings** page
3. Scroll to "Developer Options"
4. Toggle **"Developer Mode"** to ON
5. Premium is now active! ✅

---

## ✅ Verify Premium is Active

After enabling, you should see:
- 👑 **Crown badge** on profile and pages
- ✨ **No limits** on features
- 🔓 **All premium features unlocked**
- 💎 **Premium badge** in navigation

---

## 🔄 Disable Premium (Test Free Tier)

```javascript
localStorage.removeItem('safespace_premium')
location.reload()
```

---

## 🎁 Start Free Trial (7 Days)

```javascript
const now = new Date()
const trialEnd = new Date(now.getTime() + 7*24*60*60*1000)
localStorage.setItem('safespace_premium', JSON.stringify({
  isPremium: true,
  trialActive: true,
  trialEndsAt: trialEnd.toISOString(),
  planType: 'monthly',
  nextBillingDate: new Date(trialEnd.getTime() + 1*24*60*60*1000).toISOString()
}))
location.reload()
```

---

## 🐛 Troubleshooting

### Premium not working?
```javascript
// Clear and re-enable
localStorage.removeItem('safespace_premium')
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))
location.reload()
```

### Reset everything?
```javascript
localStorage.clear()
location.reload()
```

---

## 📝 Quick Commands Reference

```javascript
// Enable Premium
localStorage.setItem('safespace_premium', JSON.stringify({isPremium: true}))

// Disable Premium
localStorage.removeItem('safespace_premium')

// Check Premium Status
JSON.parse(localStorage.getItem('safespace_premium') || '{}')

// Reload Page
location.reload()
```

---

**That's it! You're ready to test premium features! 🎉**
