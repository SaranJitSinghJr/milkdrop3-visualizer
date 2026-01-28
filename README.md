# MilkDrop 3 Visualizer

A mobile audio visualizer app based on the legendary MilkDrop visualization plugin, built with React Native and Expo.

## Quick Start - Build APK

### Clone and Setup

```bash
git clone https://github.com/SaranJitSinghJr/milkdrop3-visualizer.git
cd milkdrop3-visualizer
npm install -g pnpm eas-cli
pnpm install
```

### Option A: EAS Cloud Build (Recommended)

```bash
eas login
eas build --platform android --profile preview
```

The APK will be available for download from your Expo dashboard after ~10-20 minutes.

### Option B: Local Gradle Build

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Features

- 🎵 WebGL visualization engine
- 🎨 300+ curated presets
- 👆 Touch gesture controls (swipe to change presets, pinch to zoom)
- ⚙️ 70+ customization settings
- 💾 Save and share custom presets

## Documentation

- [BUILD_GUIDE.md](BUILD_GUIDE.md) - Detailed build instructions
- [EAS_BUILD_GUIDE.md](EAS_BUILD_GUIDE.md) - EAS cloud build guide
- [GITHUB_BUILD_SETUP.md](GITHUB_BUILD_SETUP.md) - GitHub Actions setup
- [PRESET_SAVING_GUIDE.md](PRESET_SAVING_GUIDE.md) - How to save presets

## Requirements

- Android 7.0+ (API Level 24+)
- Node.js 22+
- pnpm 9.12.0+

## License

See [LICENSE.txt](LICENSE.txt) for details.