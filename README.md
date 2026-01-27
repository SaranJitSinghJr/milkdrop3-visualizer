# MilkDrop 3 Mobile - Audio Visualizer

MilkDrop 3 Mobile brings the legendary Winamp visualization plugin to mobile devices with a modern touch-friendly interface. Experience mesmerizing audio-reactive visuals on Android.

## Features

- **300+ curated presets** from classic MilkDrop collections (.milk and .milk2 formats)
- **Real-time WebGL rendering** with smooth 60fps performance
- **Touch gestures**: swipe to change presets, pinch to zoom, tap to hide UI
- **Comprehensive settings** with 70+ customization options
- **Preset management**: Save, organize, and share your custom presets
- **No ads, no tracking**, fully offline capable

## Technology Stack

- **React Native + Expo** for mobile framework
- **expo-gl** for OpenGL ES rendering
- **expo-audio** for audio capture and analysis
- **WebGL/GLSL shaders** ported from DirectX 9

## Documentation

- [Build & Deployment Guide](BUILD_GUIDE.md) - How to build APKs and deploy
- [EAS Build Guide](EAS_BUILD_GUIDE.md) - Cloud build instructions
- [GitHub Build Setup](GITHUB_BUILD_SETUP.md) - CI/CD configuration
- [Design Document](design.md) - UI/UX design specifications
- [Technical Analysis](milkdrop3_analysis.md) - Architecture overview
- [Preset Authoring](milkdrop_preset_authoring.html) - Create custom presets
- [Preset Saving Guide](PRESET_SAVING_GUIDE.md) - How to save presets

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build APK (requires [EAS CLI](https://docs.expo.dev/build/introduction/)):
   ```bash
   eas build --platform android --profile preview
   ```

## Requirements

- Android 7.0+ (API Level 24+)
- OpenGL ES 3.0+ support
- Microphone permission for audio input

## License

Based on MilkDrop by Ryan Geiss. See [LICENSE.txt](LICENSE.txt) for details.