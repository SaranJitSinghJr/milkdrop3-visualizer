# MilkDrop 3 Mobile - EAS Build Guide

## What is EAS Build?

EAS (Expo Application Services) Build is a cloud-based build service that compiles your React Native app into native binaries (APK/AAB for Android, IPA for iOS) without requiring local Android Studio or Xcode setup.

**Benefits:**
- ✅ No need to install Android Studio, SDKs, or Java
- ✅ Builds in the cloud on Expo's servers
- ✅ Consistent build environment (no "works on my machine" issues)
- ✅ Free tier available (30 builds/month for personal accounts)
- ✅ Automatic signing and configuration

## Prerequisites

1. **Node.js 22+** installed on your local machine
2. **Expo account** (free) - Sign up at [expo.dev](https://expo.dev)
3. **Project files** downloaded from Manus

## Step-by-Step Build Process

### Step 1: Download Project Files

1. In Manus Management UI, click **"Code"** button (right panel)
2. Click **"Download All Files"**
3. Extract the ZIP file to your local machine
4. Open terminal/command prompt in the extracted folder

### Step 2: Install EAS CLI

```bash
npm install -g eas-cli
```

Verify installation:
```bash
eas --version
```

### Step 3: Login to Expo

```bash
eas login
```

Enter your Expo credentials. If you don't have an account:
```bash
eas register
```

### Step 4: Configure Your Project

The project already includes `eas.json` configuration. Verify it exists:

```bash
cat eas.json
```

If missing, run:
```bash
eas build:configure
```

### Step 5: Build APK for Testing

```bash
eas build --platform android --profile preview
```

**What happens:**
1. EAS uploads your project to the cloud
2. Installs dependencies (pnpm install)
3. Runs prebuild to generate native Android project
4. Compiles with Gradle
5. Generates APK file
6. Provides download link

**Build time:** 10-20 minutes

**Output:** You'll receive a URL like:
```
✔ Build finished
https://expo.dev/artifacts/eas/abc123xyz.apk
```

### Step 6: Download and Install APK

1. **Download APK** from the provided link
2. **Transfer to Android device** via USB, email, or cloud storage
3. **Enable "Install from Unknown Sources"**:
   - Go to Settings → Security
   - Enable "Unknown Sources" or "Install Unknown Apps"
4. **Tap APK file** to install
5. **Open MilkDrop 3** from app drawer

## Build Profiles Explained

The `eas.json` file defines three build profiles:

### 1. Development Build

```bash
eas build --platform android --profile development
```

- **Purpose:** Testing during development
- **Output:** Debug APK with development client
- **Size:** Larger (~100MB)
- **Features:** Hot reload, debugging tools
- **Use case:** Active development and testing

### 2. Preview Build (Recommended)

```bash
eas build --platform android --profile preview
```

- **Purpose:** Beta testing and distribution
- **Output:** Release APK (optimized)
- **Size:** Smaller (~30-50MB)
- **Features:** Production-ready, no debugging
- **Use case:** Sharing with testers, personal use

### 3. Production Build

```bash
eas build --platform android --profile production
```

- **Purpose:** Google Play Store submission
- **Output:** AAB (Android App Bundle)
- **Size:** Smallest (Google optimizes per device)
- **Features:** Fully optimized, signed for Play Store
- **Use case:** Official release on Play Store

## Advanced Configuration

### Customize App Version

Edit `app.config.ts`:

```typescript
version: "1.0.0",
android: {
  versionCode: 1,  // Increment for each release
}
```

### Add Environment Variables

Create `.env` file:

```bash
API_URL=https://api.example.com
FEATURE_FLAG_AUDIO=true
```

Then in `eas.json`:

```json
{
  "build": {
    "preview": {
      "env": {
        "API_URL": "https://api.example.com"
      }
    }
  }
}
```

### Optimize Build Size

Add to `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease",
        "withoutCredentials": false
      },
      "cache": {
        "key": "milkdrop3-cache"
      }
    }
  }
}
```

### Enable ProGuard (Minification)

Create `android/app/proguard-rules.pro`:

```
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class expo.modules.** { *; }
```

Update `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "gradleCommand": ":app:bundleRelease"
      }
    }
  }
}
```

## Troubleshooting

### Build Failed: "ENOSPC: System limit for number of file watchers reached"

**Solution:** Increase file watcher limit (Linux/Mac):

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Build Failed: "Gradle build failed"

**Check logs:**

```bash
eas build:view
```

**Common fixes:**

1. **Clear cache:**
   ```bash
   eas build --platform android --profile preview --clear-cache
   ```

2. **Update dependencies:**
   ```bash
   npm update
   ```

3. **Check `package.json` for conflicts:**
   - Remove duplicate dependencies
   - Ensure all versions are compatible

### Build Failed: "Out of memory"

**Solution:** Add to `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "gradleCommand": ":app:assembleRelease",
        "buildType": "apk",
        "resourceClass": "large"
      }
    }
  }
}
```

**Note:** `large` resource class requires paid Expo plan.

### APK Won't Install: "App not installed"

**Possible causes:**

1. **Signature mismatch:** Uninstall old version first
2. **Corrupted download:** Re-download APK
3. **Insufficient storage:** Free up space on device
4. **Android version too old:** Requires Android OS 7.0+ (API 24+)

### App Crashes on Launch

**Debug steps:**

1. **Check logcat:**
   ```bash
   adb logcat | grep MilkDrop
   ```

2. **Verify permissions:** Ensure all required permissions are granted

3. **Test on different device:** May be device-specific issue

4. **Build development version:**
   ```bash
   eas build --platform android --profile development
   ```
   Then connect debugger to see detailed errors

## Monitoring Builds

### View Build Status

```bash
eas build:list
```

### View Specific Build

```bash
eas build:view [BUILD_ID]
```

### Cancel Running Build

```bash
eas build:cancel
```

## Signing and Credentials

### Automatic Signing (Recommended)

EAS automatically generates and manages signing credentials:

```bash
eas build --platform android --profile preview
```

When prompted:
```
? Would you like to automatically create credentials? (Y/n)
```

Choose **Yes**. EAS will:
1. Generate keystore
2. Store securely in Expo's vault
3. Use for all future builds

### Manual Signing

If you have existing credentials:

```bash
eas credentials
```

Select:
- Platform: Android
- Action: Add new keystore
- Upload your `.jks` file

## Publishing to Google Play Store

### Step 1: Build AAB

```bash
eas build --platform android --profile production
```

### Step 2: Download AAB

Download from the provided link (`.aab` file)

### Step 3: Create Play Console Listing

1. Go to [play.google.com/console](https://play.google.com/console)
2. Create new app
3. Fill in app details:
   - **Title:** MilkDrop 3
   - **Short description:** Audio-reactive music visualizer
   - **Category:** Music & Audio
   - **Content rating:** Everyone

### Step 4: Upload AAB

1. Go to **Production** → **Create new release**
2. Upload AAB file
3. Add release notes
4. Submit for review

### Step 5: Automated Submission (Optional)

Configure `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

Then run:

```bash
eas submit --platform android --profile production
```

## Cost and Limits

### Free Tier

- **30 builds/month** for personal accounts
- **Unlimited builds** for open-source projects
- **Standard build resources** (may be slower)

### Paid Plans

**Production Plan** ($29/month):
- **Unlimited builds**
- **Priority queue** (faster builds)
- **Large resource class** (more memory)
- **Team collaboration**

**Enterprise Plan** ($999/month):
- Everything in Production
- **Dedicated build servers**
- **SLA guarantees**
- **Custom support**

## Best Practices

### 1. Use Git Tags for Releases

```bash
git tag v1.0.0
git push origin v1.0.0
eas build --platform android --profile production
```

### 2. Test Before Production

Always build and test with `preview` profile before `production`:

```bash
# Test build
eas build --platform android --profile preview

# After testing, production build
eas build --platform android --profile production
```

### 3. Automate with GitHub Actions

Create `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm install -g eas-cli
      - run: eas build --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### 4. Version Management

Increment versions systematically:

- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features
- **Major** (2.0.0): Breaking changes

Update both:
- `app.config.ts` → `version: "1.0.1"`
- `app.config.ts` → `android.versionCode: 2`

### 5. Keep Dependencies Updated

```bash
npx expo install --fix
npm update
```

## Quick Reference

### Common Commands

```bash
# Login
eas login

# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production

# View builds
eas build:list

# View credentials
eas credentials

# Submit to Play Store
eas submit --platform android

# Update app
eas update

# Clear cache
eas build --clear-cache
```

### File Locations

- **Configuration:** `eas.json`
- **App config:** `app.config.ts`
- **Dependencies:** `package.json`
- **Android manifest:** Generated during build
- **Gradle config:** Generated during build

## Support Resources

- **EAS Documentation:** [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- **Expo Forums:** [forums.expo.dev](https://forums.expo.dev)
- **Discord:** [expo.dev/discord](https://expo.dev/discord)
- **GitHub Issues:** Report bugs at expo/expo

## Next Steps

After building your APK:

1. **Test thoroughly** on multiple Android devices
2. **Gather feedback** from beta testers
3. **Iterate and improve** based on feedback
4. **Prepare Play Store assets** (screenshots, description)
5. **Submit to Google Play** when ready

---

**Last Updated:** January 22, 2026  
**EAS CLI Version:** 13.2.0+  
**Target:** Android OS 7.0+ (API Level 24+)
