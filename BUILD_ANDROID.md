# Android Build Guide

## Prerequisites

### Required Software
- ✅ Node.js 16+ and npm
- ✅ Android Studio with Android SDK
- ✅ Java JDK 11+
- ✅ Capacitor CLI (installed via npm)

### Environment Variables
Check these are set:
```powershell
echo $Env:ANDROID_SDK_ROOT
echo $Env:JAVA_HOME
```

If not set, add to Windows Environment Variables:
- `ANDROID_SDK_ROOT`: `C:\Users\HP\AppData\Local\Android\Sdk`
- `JAVA_HOME`: `C:\Program Files\Java\jdk-11` (or your JDK path)

---

## Quick Start: Debug Build

### Option 1: Using npm scripts (Recommended)
```powershell
# Build and create debug APK
npm run android:debug

# Install to connected device/emulator
npm run android:install
```

### Option 2: Manual steps
```powershell
# 1. Build web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build debug APK
cd android
.\gradlew assembleDebug

# 4. Install to device
.\gradlew installDebug
# OR manually:
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

**Output**: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## Release Build (Signed)

### Step 1: Create Keystore (One-time)

```powershell
# Create keystores directory
mkdir C:\Users\HP\keystores

# Generate keystore
keytool -genkey -v -keystore C:\Users\HP\keystores\space4u-release.jks -alias space4u -keyalg RSA -keysize 2048 -validity 10000
```

**Important**: Save your passwords securely!

### Step 2: Configure Signing

1. Copy example file:
```powershell
cd android
copy keystore.properties.example keystore.properties
```

2. Edit `keystore.properties` with your actual values:
```properties
storeFile=C:/Users/HP/keystores/space4u-release.jks
storePassword=YOUR_ACTUAL_STORE_PASSWORD
keyAlias=space4u
keyPassword=YOUR_ACTUAL_KEY_PASSWORD
```

3. Add to `android/app/build.gradle` (before `android {` block):
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release

#### For Google Play (AAB - Recommended)
```powershell
npm run android:release
```
**Output**: `android\app\build\outputs\bundle\release\app-release.aab`

#### For Direct Install (APK)
```powershell
npm run android:apk
```
**Output**: `android\app\build\outputs\apk\release\app-release.apk`

---

## Using Android Studio

```powershell
# Open project in Android Studio
npm run mobile:open:android
```

Then use: **Build > Generate Signed Bundle / APK**

---

## Emulator Setup

### List available emulators
```powershell
& "$Env:ANDROID_SDK_ROOT\emulator\emulator.exe" -list-avds
```

### Start emulator
```powershell
Start-Process -FilePath "$Env:ANDROID_SDK_ROOT\emulator\emulator.exe" -ArgumentList "-avd Pixel_4_API_30"
```

### Install APK to emulator
```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

---

## Troubleshooting

### Gradle fails
```powershell
cd android
.\gradlew --stacktrace
```
- Ensure JAVA_HOME points to JDK 11+
- Check Android SDK is installed

### ADB not found
Add to PATH or use full path:
```powershell
& "$Env:ANDROID_SDK_ROOT\platform-tools\adb.exe" devices
```

### Build fails after code changes
```powershell
# Clean and rebuild
cd android
.\gradlew clean
.\gradlew assembleDebug
```

### Keystore issues
- Verify keystore.properties paths use forward slashes: `C:/Users/...`
- Ensure keystore file exists at specified path
- Check passwords are correct

---

## Build Scripts Reference

```json
{
  "android:debug": "Build debug APK",
  "android:install": "Install debug APK to device",
  "android:release": "Build release AAB for Play Store",
  "android:apk": "Build release APK for direct install"
}
```

---

## File Locations

### Debug APK
`android\app\build\outputs\apk\debug\app-debug.apk`

### Release AAB (Play Store)
`android\app\build\outputs\bundle\release\app-release.aab`

### Release APK (Direct Install)
`android\app\build\outputs\apk\release\app-release.apk`

---

## Security Notes

⚠️ **NEVER commit these files:**
- `keystore.properties`
- `*.jks` or `*.keystore` files
- Passwords in any file

✅ **Safe to commit:**
- `keystore.properties.example`
- `build.gradle` (with properties file reference)

---

## Quick Commands Summary

```powershell
# Debug build and install
npm run android:debug
npm run android:install

# Release build
npm run android:release  # AAB for Play Store
npm run android:apk      # APK for direct install

# Open in Android Studio
npm run mobile:open:android

# Sync after code changes
npm run mobile:sync
```

---

## Next Steps

1. ✅ Create keystore (one-time)
2. ✅ Configure keystore.properties
3. ✅ Update build.gradle with signing config
4. ✅ Build debug APK for testing
5. ✅ Build release AAB for Play Store
6. ✅ Test on real device
7. ✅ Submit to Google Play Console

---

**Need Help?**
- Check Android Studio logs
- Run `.\gradlew --stacktrace` for detailed errors
- Verify environment variables are set
- Ensure all prerequisites are installed

