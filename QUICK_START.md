# APK Build Setup - Quick Start Guide

## ✅ Setup Complete!

Your repository is now fully configured to automatically build Android APKs for the MilkDrop 3 Mobile app.

## 🎯 Next Steps (Required)

To build your first APK, follow these 3 simple steps:

### Step 1: Create Expo Account (2 minutes)

1. Go to [expo.dev](https://expo.dev)
2. Sign up for a free account
3. Verify your email

### Step 2: Add Expo Token to GitHub (3 minutes)

1. Go to [expo.dev/settings/tokens](https://expo.dev/settings/tokens)
2. Click **"Create Token"**
3. Name it: `GitHub Actions`
4. Copy the token

Then add it to GitHub:
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `EXPO_TOKEN`
5. Value: Paste your token
6. Click **"Add secret"**

### Step 3: Trigger the Build (1 minute)

#### Option A: Using Git Tag (Recommended)

```bash
git tag v1.0.1 -m "First APK build"
git push origin v1.0.1
```

#### Option B: Using GitHub UI

1. Go to **Actions** tab in your repository
2. Click **"Build APK with EAS"**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

## 📥 Download Your APK (after 15-20 minutes)

Once the build completes:

1. Go to **Releases** page in your repository
2. Download `milkdrop3.apk`
3. Transfer to Android device
4. Install and enjoy!

## 📱 Installing on Android

1. Enable **"Install from Unknown Sources"** in device settings
2. Open the APK file
3. Tap **Install**
4. Launch **MilkDrop 3**

## 📚 More Information

- **[APK_BUILD_INSTRUCTIONS.md](APK_BUILD_INSTRUCTIONS.md)** - Detailed setup guide
- **[BUILD_GUIDE.md](BUILD_GUIDE.md)** - Build system documentation
- **[EAS_BUILD_GUIDE.md](EAS_BUILD_GUIDE.md)** - EAS platform guide
- **[README.md](README.md)** - Project overview

## ❓ Troubleshooting

**Build fails with "EXPO_TOKEN not found"**
→ Make sure you completed Step 2 above

**Build takes longer than expected**
→ EAS builds can take 15-20 minutes. Check progress at [expo.dev/builds](https://expo.dev/builds)

**APK won't install**
→ Make sure your device runs Android 7.0+ and "Unknown Sources" is enabled

## 🎉 Success!

After completing these steps, you'll have:
- ✅ Automated APK builds on every version tag
- ✅ APKs automatically attached to GitHub Releases
- ✅ Professional build system using industry-standard tools
- ✅ No need to install Android Studio or SDKs locally

Happy building! 🚀
