# Phase 4: Native Features Setup Guide

## Overview
Phase 4 implements native mobile features including biometric authentication, status bar theming, native sharing, keyboard avoidance, and haptic feedback.

## Required Capacitor Plugins

### 1. Biometric Authentication
```bash
npm install @capacitor-community/biometric-auth
npx cap sync
```

**iOS Setup** (ios/App/App/Info.plist):
```xml
<key>NSFaceIDUsageDescription</key>
<string>We use Face ID to securely authenticate you</string>
```

**Android Setup** (android/app/src/main/AndroidManifest.xml):
```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

### 2. Status Bar (Already Installed)
```bash
# Already in package.json
@capacitor/status-bar
```

### 3. Keyboard (Already Installed)
```bash
# Already in package.json
@capacitor/keyboard
```

### 4. Haptics (Already Installed)
```bash
# Already in package.json
@capacitor/haptics
```

### 5. Share
```bash
npm install @capacitor/share
npx cap sync
```

## Features Implemented

### ✅ Biometric Authentication
- **Hook**: `useBiometric.js`
- **Component**: `BiometricPrompt.jsx`
- **Features**:
  - Face ID support (iOS)
  - Fingerprint support (Android)
  - Availability detection
  - Fallback to password
  - Error handling

**Usage**:
```jsx
import { useBiometric } from '../hooks/useBiometric'

const { isAvailable, biometricType, authenticate } = useBiometric()

const handleLogin = async () => {
  const result = await authenticate('Login to Space4U')
  if (result.success) {
    // User authenticated
  }
}
```

### ✅ Status Bar Theming
- **Hook**: `useStatusBar.js`
- **Integration**: `ThemeContext.jsx`
- **Features**:
  - Auto-updates with theme changes
  - Dark/light mode support
  - Background color customization
  - Show/hide controls

**Usage**:
```jsx
import { useStatusBar } from '../hooks/useStatusBar'

useStatusBar({
  backgroundColor: '#6366F1',
  style: 'light',
  overlay: false
})
```

### ✅ Native Share
- **Hook**: `useShare.js`
- **Features**:
  - Native share sheet (iOS/Android)
  - Web Share API fallback
  - Clipboard fallback
  - Loading states
  - Error handling

**Usage**:
```jsx
import { useShare } from '../hooks/useShare'

const { share, isSharing, canShare } = useShare()

const handleShare = async () => {
  const result = await share({
    title: 'Check this out!',
    text: 'Amazing app',
    url: 'https://example.com'
  })
}
```

### ✅ Keyboard Avoidance
- **Hook**: `useKeyboardAvoidance.js`
- **Component**: `KeyboardAvoidingView.jsx`
- **Features**:
  - Detects keyboard show/hide
  - Calculates keyboard height
  - Auto-adjusts padding
  - Smooth transitions

**Usage**:
```jsx
import KeyboardAvoidingView from '../components/common/KeyboardAvoidingView'

<KeyboardAvoidingView>
  <input type="text" />
</KeyboardAvoidingView>
```

### ✅ Haptic Feedback (Already Implemented)
- **Hook**: `useHaptic.js`
- **Types**: light, medium, heavy, success, warning, error
- **Integration**: All interactive components

## Demo Page

**Route**: `/demo/native`

**Features Demonstrated**:
- Biometric authentication test
- Native share functionality
- Theme toggle with status bar update
- Haptic feedback samples (4 types)
- Keyboard avoidance test

## Testing Checklist

### iOS Testing
- [ ] Face ID authentication works
- [ ] Status bar updates with theme
- [ ] Native share sheet appears
- [ ] Keyboard pushes content up
- [ ] Haptic feedback works
- [ ] Safe area respected

### Android Testing
- [ ] Fingerprint authentication works
- [ ] Status bar color changes
- [ ] Native share sheet appears
- [ ] Keyboard avoidance works
- [ ] Haptic feedback works
- [ ] Navigation bar handled

### Web Testing (Fallbacks)
- [ ] Biometric shows "not available"
- [ ] Share falls back to clipboard
- [ ] Theme toggle works
- [ ] Keyboard events handled
- [ ] No console errors

## Integration Examples

### Login Page with Biometric
```jsx
import BiometricPrompt from '../components/BiometricPrompt'

const [showBiometric, setShowBiometric] = useState(false)

<BiometricPrompt
  title="Login to Space4U"
  onSuccess={handleLogin}
  onCancel={() => setShowBiometric(false)}
/>
```

### Share Achievement
```jsx
const { share } = useShare()

const shareAchievement = async () => {
  await share({
    title: 'Achievement Unlocked!',
    text: 'I just earned the 7-day streak badge on Space4U!',
    url: 'https://space4u.app'
  })
}
```

### Form with Keyboard Avoidance
```jsx
<KeyboardAvoidingView className="p-6">
  <form>
    <input type="email" className="input" />
    <input type="password" className="input" />
    <button type="submit">Login</button>
  </form>
</KeyboardAvoidingView>
```

## Performance Notes

- All hooks use dynamic imports for Capacitor plugins
- Graceful fallbacks for web platform
- No performance impact on web builds
- Minimal bundle size increase (~50KB)

## Security Considerations

- Biometric data never leaves device
- No biometric data stored in app
- Fallback authentication required
- Secure credential storage recommended

## Next Steps

1. Install required plugins: `npm install @capacitor-community/biometric-auth @capacitor/share`
2. Run `npx cap sync`
3. Test on iOS simulator/device
4. Test on Android emulator/device
5. Integrate into production pages
6. Add biometric to login flow
7. Add share to achievements
8. Apply keyboard avoidance to forms

## Troubleshooting

**Biometric not working**:
- Check iOS Info.plist has NSFaceIDUsageDescription
- Check Android permissions in manifest
- Ensure device has biometric enrolled
- Test on real device (not simulator)

**Status bar not updating**:
- Check Capacitor is initialized
- Verify StatusBar plugin installed
- Check platform is iOS/Android
- Test on real device

**Share not working**:
- Check Share plugin installed
- Verify npx cap sync ran
- Test on real device
- Check fallback to clipboard

## Resources

- [Capacitor Biometric Auth](https://github.com/capacitor-community/biometric-auth)
- [Capacitor Status Bar](https://capacitorjs.com/docs/apis/status-bar)
- [Capacitor Share](https://capacitorjs.com/docs/apis/share)
- [Capacitor Keyboard](https://capacitorjs.com/docs/apis/keyboard)
- [Capacitor Haptics](https://capacitorjs.com/docs/apis/haptics)

</text>
