# MilkDrop 3 Visualizer

This repository contains the MilkDrop 3 music visualization software, including both the original Windows desktop C++ source code and documentation for a mobile port.

## About MilkDrop

MilkDrop is the legendary music visualization plugin originally created by Ryan Geiss for Winamp. It renders mesmerizing audio-reactive visuals using shader-based effects and supports hundreds of community-created presets.

## Repository Contents

This repository includes:

### Desktop Source Code (C++)
- **Original MilkDrop 3 Windows desktop implementation** using DirectX 9
- Core visualization engine with HLSL shaders
- FFT-based audio analysis system
- Preset parser and expression compiler (ns-eel)
- Plugin interface for Winamp

### Mobile App Design & Documentation
- **Design specifications** for a mobile port (see [design.md](./design.md))
- **Technical architecture** documentation (see [milkdrop3_analysis.md](./milkdrop3_analysis.md))
- **Build guides** for mobile deployment (see [BUILD_GUIDE.md](./BUILD_GUIDE.md))
- Sample TypeScript/React Native component files for mobile implementation

### Key Files

**Desktop C++ Source:**
- `plugin.cpp` / `plugin.h` - Main plugin implementation
- `Milkdrop2PcmVisualizer.cpp` - Audio visualization core
- `dxcontext.cpp` / `dxcontext.h` - DirectX 9 rendering context
- `fft.cpp` / `fft.h` - Fast Fourier Transform audio analysis
- `nseel-*.c` - Nullsoft Expression Evaluation Library (preset scripting)

**Mobile Design Files:**
- `app.config.ts` - Expo/React Native configuration template
- `milkdrop-visualizer.tsx` - Sample visualizer component
- `preset-loader.ts` - Preset parsing utilities
- `preset-storage.ts` - Preset management system

## Features

- **300+ Visual Presets**: Support for .milk preset format
- **Real-time Audio Visualization**: FFT-based frequency analysis
- **Beat Detection**: Automatic transitions on beat drops
- **Expression Scripting**: Per-frame and per-pixel custom code
- **16 Shapes & 16 Waves**: Enhanced from MilkDrop 2's 4 each
- **64 Q-Variables**: Advanced preset scripting capabilities
- **27+ Transition Effects**: Smooth preset transitions
- **Sprite System**: Layered visual elements

## Desktop Build (Windows)

The C++ desktop version requires:
- Visual Studio 2019 or later
- DirectX 9 SDK
- Windows 7 or later

Build instructions for the desktop version are not included in this repository. The source is provided for reference and as a basis for the mobile port.

## Mobile Port Development

The mobile port is designed for React Native + Expo with the following stack:

**Planned Technology:**
- React Native + Expo - Cross-platform framework
- expo-gl - OpenGL ES rendering
- expo-audio - Audio capture and analysis
- TypeScript - Type-safe development
- GLSL Shaders - Visual effects (ported from HLSL)

**Note:** The mobile app is currently in the design/planning phase. The TypeScript files in this repository are reference implementations. A complete mobile project setup with `package.json` and dependencies is not yet included.

### Setting Up Mobile Development

To begin mobile development:

1. Initialize an Expo project:
```bash
npx create-expo-app@latest milkdrop3-mobile
cd milkdrop3-mobile
```

2. Copy the design files and components from this repository

3. Install required dependencies:
```bash
npx expo install expo-gl expo-audio expo-video
```

4. See [BUILD_GUIDE.md](./BUILD_GUIDE.md) for detailed mobile setup instructions


## Documentation

- **[design.md](./design.md)**: Complete UI/UX design specification for mobile
- **[milkdrop3_analysis.md](./milkdrop3_analysis.md)**: Technical architecture and porting strategy
- **[BUILD_GUIDE.md](./BUILD_GUIDE.md)**: Mobile build, deployment, and publishing guide
- **[EAS_BUILD_GUIDE.md](./EAS_BUILD_GUIDE.md)**: Expo Application Services build guide
- **[PRESET_SAVING_GUIDE.md](./PRESET_SAVING_GUIDE.md)**: Preset management and saving

## Mobile UI Design

The mobile port is designed for portrait orientation (9:16) with touch-first controls:

### Planned Touch Controls
- **Single Tap**: Show/hide UI overlay
- **Swipe Left/Right**: Navigate between presets
- **Double Tap**: Randomize colors
- **Long Press**: Quick settings menu
- **Pinch**: Zoom effect

See [design.md](./design.md) for complete UI/UX specifications including screen layouts, color palette, typography, and animation guidelines.

## Architecture Overview

### Desktop (C++) Components
- **Rendering Engine**: DirectX 9 with HLSL shaders
- **Audio Processing**: FFT analysis, beat detection
- **Preset System**: .milk/.milk2 file parsing
- **Expression Compiler**: ns-eel (Nullsoft Expression Evaluation Library)

### Mobile (Planned) Components
- **Rendering**: WebGL/OpenGL ES with GLSL shaders (ported from HLSL)
- **Audio**: Web Audio API / Native modules for FFT
- **Preset Parser**: JavaScript/TypeScript implementation
- **Expression Evaluator**: JavaScript port of ns-eel or WASM

See [milkdrop3_analysis.md](./milkdrop3_analysis.md) for detailed technical analysis.


## Contributing

Contributions are welcome! This project is in active development with both desktop source code and mobile port planning.

**Areas for Contribution:**
- Mobile app implementation
- HLSL to GLSL shader conversion
- Expression compiler JavaScript/WASM port
- Preset testing and compatibility
- Documentation improvements

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is based on MilkDrop by Ryan Geiss. See [LICENSE.txt](./LICENSE.txt) for details.

MilkDrop was originally created for Winamp and is now part of the music visualization legacy. This repository aims to preserve that legacy and facilitate porting to modern mobile platforms.

## Acknowledgments

- **Ryan Geiss**: Creator of the original MilkDrop plugin
- **Nullsoft/Winamp**: For the original Winamp platform and hosting MilkDrop
- **MilkDrop Community**: For thousands of amazing presets created over the years
- **Contributors**: Everyone helping to bring MilkDrop to mobile devices

## Project Status

**Desktop (C++):** Source code available for reference  
**Mobile (React Native):** Design and planning phase - implementation in progress

## Support

For questions, bug reports, and feature requests, please use the [GitHub Issues](https://github.com/SaranJitSinghJr/milkdrop3-visualizer/issues) page.

---

**Preserving the legacy of music visualization** 🎵✨