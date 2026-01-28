# MilkDrop 3 Mobile - Build & Deployment Guide

## Overview

This guide covers how to build the MilkDrop 3 Mobile app for Android OS 7.0+ and deploy it as an APK.

## Prerequisites

Before building the app, ensure you have:

1. **Expo Account** - Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI** - Install with `npm install -g eas-cli`
3. **Android Device or Emulator** - Running Android OS 7.0+ (API Level 24+)

## Build Methods

### Method 1: EAS Build (Recommended)

EAS (Expo Application Services) builds your app in the cloud without requiring local Android Studio setup.

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo

```bash
eas login
```

#### Step 3: Configure EAS Build

```bash
cd /path/to/milkdrop3-mobile
eas build:configure
```

This creates `eas.json` with build configuration.

#### Step 4: Build APK

```bash
# Build for Android (APK)
eas build --platform android --profile preview

# Or build AAB for Google Play Store
eas build --platform android --profile production
```

The build process takes 10-20 minutes. Once complete, you'll receive a download link for the APK.

#### Step 5: Install APK

1. Download the APK from the provided link
2. Transfer to your Android device
3. Enable "Install from Unknown Sources" in Settings
4. Tap the APK file to install

### Method 2: Local Build with Android Studio

For advanced users who want full control over the build process.

#### Prerequisites

- Android Studio installed
- Android SDK 24+ (Android OS 7.0)
- Java JDK 17+
- Node.js 22+

#### Step 1: Generate Native Project

```bash
cd /path/to/milkdrop3-mobile
npx expo prebuild --platform android
```

This creates the `android/` directory with native Android project files.

#### Step 2: Build with Gradle

```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

#### Step 3: Sign the APK (Optional)

For production release, sign the APK:

```bash
keytool -genkey -v -keystore milkdrop3.keystore -alias milkdrop3 -keyalg RSA -keysize 2048 -validity 10000

jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore milkdrop3.keystore app-release.apk milkdrop3
```

## Testing the App

### On Physical Device

1. Enable **Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect device via USB

3. Run the app:
```bash
npx expo run:android
```

### On Emulator

1. Open Android Studio
2. Go to Tools → AVD Manager
3. Create a new Virtual Device (Android OS 7.0+)
4. Start the emulator
5. Run the app:
```bash
npx expo run:android
```

### Testing with Expo Go

For quick testing during development:

1. Install Expo Go from Google Play Store
2. Run the dev server:
```bash
npm run dev
```
3. Scan the QR code with Expo Go

**Note**: Expo Go has limitations and may not support all native features. Use development builds for full testing.

## App Configuration

### Update App Name and Icon

Edit `app.config.ts`:

```typescript
const env = {
  appName: "MilkDrop 3",  // Change this
  logoUrl: "https://...", // Your app icon URL
  // ...
};
```

### Update Package Name

The package name is auto-generated based on the project name and timestamp:
```
space.manus.milkdrop3.mobile.t20240122103045
```

To customize, edit `app.config.ts`:

```typescript
const env = {
  androidPackage: "com.yourcompany.milkdrop3",
  // ...
};
```

### Configure Permissions

Edit `app.config.ts` to add required permissions:

```typescript
android: {
  permissions: [
    "POST_NOTIFICATIONS",
    "RECORD_AUDIO",        // For audio capture
    "MODIFY_AUDIO_SETTINGS",
    "WAKE_LOCK",           // For keep-awake
  ],
}
```

## Performance Optimization

### Reduce APK Size

1. **Enable ProGuard** (minification):

Edit `android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

2. **Remove unused assets**:

Delete unused preset files from `assets/presets/` to reduce size.

3. **Enable APK splitting**:

```gradle
splits {
    abi {
        enable true
        reset()
        include 'armeabi-v7a', 'arm64-v8a'
        universalApk false
    }
}
```

### Optimize WebGL Performance

In `components/milkdrop-visualizer.tsx`, adjust:

```typescript
// Lower FPS for better battery life
const targetFPS = 30;

// Reduce shader complexity
// Simplify fragment shader calculations
```

## Troubleshooting

### Build Errors

**Error: "SDK location not found"**

Create `android/local.properties`:
```
sdk.dir=/path/to/Android/sdk
```

**Error: "Execution failed for task ':app:mergeReleaseResources'"**

Clean and rebuild:
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

**Error: "Duplicate class found"**

Check for conflicting dependencies in `package.json`. Remove duplicates.

### Runtime Errors

**App crashes on startup**

- Check logcat: `adb logcat | grep MilkDrop`
- Verify all permissions are granted
- Ensure Android OS version is 7.0+ (API 24+)

**WebGL not rendering**

- Check if device supports OpenGL ES 3.0+
- Verify expo-gl is properly installed
- Check console for shader compilation errors

**Gestures not working**

- Ensure `react-native-gesture-handler` is properly linked
- Verify `GestureHandlerRootView` wraps the app in `app/_layout.tsx`

### Performance Issues

**Low FPS**

- Reduce target FPS in settings
- Simplify shader calculations
- Lower audio FFT size

**High battery drain**

- Enable auto-sleep after inactivity
- Reduce screen brightness
- Lower target FPS to 24-30

## Publishing to Google Play Store

### Step 1: Create Google Play Developer Account

Sign up at [play.google.com/console](https://play.google.com/console) ($25 one-time fee)

### Step 2: Build AAB (Android App Bundle)

```bash
eas build --platform android --profile production
```

### Step 3: Upload to Play Console

1. Go to Google Play Console
2. Create new app
3. Fill in app details (name, description, screenshots)
4. Upload AAB file
5. Complete content rating questionnaire
6. Set pricing and distribution
7. Submit for review

### Step 4: App Store Listing

**Title**: MilkDrop 3 - Audio Visualizer

**Short Description**:
Audio-reactive music visualizer with 300+ presets and touch controls

**Full Description**:
MilkDrop 3 brings the legendary Winamp visualization plugin to mobile with a modern touch-friendly interface. Experience mesmerizing audio-reactive visuals with:

• 300+ curated presets from classic MilkDrop collections
• Real-time WebGL rendering with smooth 60fps performance
• Touch gestures: swipe to change presets, pinch to zoom, tap to hide UI
• Comprehensive settings with 70+ customization options
• Save and share your custom presets
• Organize presets with favorites and collections
• No ads, no tracking, fully offline

Perfect for music lovers, VJs, and anyone who appreciates beautiful visualizations.

**Screenshots**: Capture 4-8 screenshots showing:
- Visualizer in action (multiple presets)
- Preset browser
- Settings screen
- Gesture controls

**Feature Graphic**: 1024x500px banner image

**Category**: Music & Audio

**Content Rating**: Everyone

## Distribution Channels

### Google Play Store
- Widest reach
- Automatic updates
- Requires developer account ($25)
- Review process (1-3 days)

### Direct APK Distribution
- No fees or approval process
- Users must enable "Unknown Sources"
- Manual updates
- Good for beta testing

### F-Droid
- Open-source app store
- Free to publish
- Requires open-source license
- Community-driven

### Amazon Appstore
- Alternative to Google Play
- Free developer account
- Reaches Fire tablets and TVs

## Version Management

### Semantic Versioning

Follow semver: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

Update in `app.config.ts`:

```typescript
version: "1.0.0",
```

And `package.json`:

```json
"version": "1.0.0",
```

### Build Numbers

Increment for each build:

```typescript
android: {
  versionCode: 1,  // Increment this
}
```

## Continuous Integration

### GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm install -g eas-cli
      - run: eas build --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Support and Resources

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **React Native**: [reactnative.dev](https://reactnative.dev)
- **MilkDrop Documentation**: See `milkdrop.html` and `milkdrop_preset_authoring.html`
- **Issue Tracker**: Report bugs and feature requests

## License

MilkDrop 3 Mobile is based on MilkDrop by Ryan Geiss. See `LICENSE.txt` for details.

---

**Last Updated**: January 22, 2026  
**Version**: 1.0.0  
**Target**: Android OS 7.0+ (API Level 24+)
