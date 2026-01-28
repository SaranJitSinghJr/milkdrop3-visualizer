# MilkDrop 3 Mobile Visualizer

MilkDrop 3 Mobile brings the legendary Winamp music visualization plugin to mobile devices with a modern touch-friendly interface. Experience mesmerizing audio-reactive visuals with hundreds of presets and customizable effects.

## Features

- **300+ Visual Presets**: Curated collection of classic MilkDrop presets (.milk files)
- **Real-time Audio Visualization**: WebGL-powered rendering with smooth 60fps performance
- **Touch Gestures**: Swipe to change presets, tap to toggle UI, pinch to zoom
- **Audio Processing**: FFT-based audio analysis with bass, mid, and treble detection
- **Beat Detection**: Automatic preset transitions on beat drops
- **Customizable Effects**: 70+ settings to fine-tune your visual experience
- **Preset Management**: Organize presets with favorites and collections
- **Mobile-First Design**: Optimized for portrait orientation (9:16) and one-handed use
- **Privacy-Focused**: No ads, no tracking, fully offline capable

## Technology Stack

- **React Native + Expo**: Cross-platform mobile framework
- **expo-gl**: OpenGL ES rendering for high-performance graphics
- **expo-audio**: Audio capture and real-time analysis
- **TypeScript**: Type-safe codebase
- **GLSL Shaders**: Custom fragment shaders for visual effects

## Getting Started

### Prerequisites

- Node.js 22+
- Expo CLI (`npm install -g expo-cli`)
- Android device or emulator (Android OS 16+/API Level 35+)
- OR iOS device/simulator (iOS 15+)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SaranJitSinghJr/milkdrop3-visualizer.git
cd milkdrop3-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run on your device:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios`
   - **Expo Go**: Scan QR code with Expo Go app

### Building for Production

See [BUILD_GUIDE.md](./BUILD_GUIDE.md) for detailed instructions on:
- Building APK/AAB for Android
- Creating production builds with EAS
- Publishing to Google Play Store
- Performance optimization tips

## Project Structure

```
milkdrop3-visualizer/
├── app.config.ts              # Expo configuration
├── index.tsx                  # Main app entry point
├── _layout.tsx                # App navigation layout
├── milkdrop-visualizer.tsx    # Core visualizer component
├── preset-loader.ts           # Preset parsing and loading
├── preset-storage.ts          # Preset management system
├── import-presets.ts          # Preset import utilities
├── design.md                  # UI/UX design documentation
├── milkdrop3_analysis.md      # Technical architecture overview
├── BUILD_GUIDE.md             # Build and deployment guide
└── assets/                    # Images and resources
```

## Core Components

### Visualizer Engine
The `milkdrop-visualizer.tsx` component handles:
- WebGL context management
- Audio input processing with FFT analysis
- GLSL shader compilation and rendering
- Preset state management
- Touch gesture handling

### Preset System
Supports MilkDrop preset formats:
- **.milk files**: Single presets with per-frame/per-pixel code
- Custom expression evaluation for preset scripting
- Real-time parameter adjustments

### Audio Processing
- FFT-based frequency analysis (512 samples)
- Bass, mid, treble extraction
- Beat detection for auto-transitions
- Microphone input support

## Documentation

- **[design.md](./design.md)**: Complete UI/UX design specification
- **[milkdrop3_analysis.md](./milkdrop3_analysis.md)**: Technical architecture and porting strategy
- **[BUILD_GUIDE.md](./BUILD_GUIDE.md)**: Build, deployment, and publishing guide
- **[EAS_BUILD_GUIDE.md](./EAS_BUILD_GUIDE.md)**: Expo Application Services build guide
- **[PRESET_SAVING_GUIDE.md](./PRESET_SAVING_GUIDE.md)**: Preset management and saving

## Usage

### Basic Controls

- **Single Tap**: Show/hide UI overlay
- **Swipe Left/Right**: Navigate between presets
- **Double Tap**: Randomize colors
- **Long Press**: Quick settings menu
- **Pinch**: Zoom effect (optional)

### Settings

Access the Settings screen to customize:
- Audio source (microphone/system audio)
- Frame rate (30/60/90/120 FPS)
- Texture resolution
- Auto-transition interval
- Effect parameters (waves, shapes, warp, zoom)

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is based on MilkDrop by Ryan Geiss. See [LICENSE.txt](./LICENSE.txt) for details.

MilkDrop was originally created for Winamp and is now part of the music visualization legacy. This mobile port aims to preserve that legacy while bringing it to modern mobile platforms.

## Acknowledgments

- **Ryan Geiss**: Creator of the original MilkDrop plugin
- **Nullsoft/Winamp**: For the original Winamp platform
- **MilkDrop Community**: For thousands of amazing presets over the years
- **Expo Team**: For the excellent React Native framework

## Support

For bug reports and feature requests, please use the [GitHub Issues](https://github.com/SaranJitSinghJr/milkdrop3-visualizer/issues) page.

## Roadmap

### Phase 1 (Current)
- ✅ Basic preset loading and playback
- ✅ Audio visualization with FFT
- ✅ Touch controls
- ✅ Settings panel

### Phase 2 (Planned)
- [ ] Full preset compatibility
- [ ] Advanced transitions and effects
- [ ] Preset editing interface
- [ ] Playlist management

### Phase 3 (Future)
- [ ] Double presets (.milk2 support)
- [ ] Mash-up features
- [ ] Cloud preset sharing
- [ ] Social features

---

**Made with ❤️ for music visualization enthusiasts**