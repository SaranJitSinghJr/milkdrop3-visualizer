# MilkDrop 3 Analysis for Mobile Port

## Overview
MilkDrop 3 is a music visualization software originally built for Windows desktop using DirectX 9. It's a complex C++ application with the following key components:

## Core Architecture

### 1. **Rendering Engine**
- DirectX 9 based (dxcontext.cpp/h)
- HLSL pixel shaders for visual effects
- FFT audio analysis (fft.cpp/h)
- Texture management (texmgr.cpp/h)
- Text rendering (textmgr.cpp/h)

### 2. **Audio Processing**
- Audio buffer management (audiobuf.cpp/h)
- Loopback audio capture (loopback-capture.cpp/h)
- FFT with 512 samples for frequency analysis
- Bass, mids, treble detection
- Beat detection for auto-transitions

### 3. **Preset System**
- .milk files (single presets)
- .milk2 files (double presets - mixing 2 presets)
- State management (state.cpp/h)
- Custom expression compiler (ns-eel - "Nullsoft Expression Evaluation Library")
- Per-frame and per-pixel scripting

### 4. **Key Features**
- 16 shapes and 16 waves (vs 4 in MilkDrop 2)
- 64 q-variables (q1-q64) for preset scripting
- Multiple transition effects (27+ types)
- Sprite system with blending modes
- Playlist support
- Color randomization
- Mash-up capabilities
- Beat-reactive hardcut modes

### 5. **UI Components**
- Menu system (menu.cpp/h)
- Keyboard shortcuts (extensive)
- Mouse controls for sprites
- MilkPanel editor
- Preset browser

## Challenges for Mobile Port

### Technical Challenges:
1. **DirectX to WebGL/OpenGL ES**: Need to convert DX9 shaders to GLSL
2. **Expression Compiler**: The ns-eel system needs JavaScript/WASM port
3. **Audio Capture**: Mobile audio routing is different from Windows loopback
4. **Performance**: Complex shaders may need optimization for mobile GPUs
5. **File System**: Preset loading/saving needs mobile-friendly approach

### UI Challenges:
1. Replace keyboard shortcuts with touch gestures
2. Redesign menu system for touch screens
3. Create touch-friendly preset browser
4. Implement touch controls for sprite manipulation
5. Settings panel needs mobile-optimized layout

## Mobile App Strategy

### Technology Stack:
- **React Native + Expo** for mobile framework
- **expo-gl** for OpenGL ES rendering
- **expo-audio** for audio capture and analysis
- **expo-file-system** for preset management
- **React Native Gesture Handler** for touch controls

### Architecture Plan:
1. **Core Visualization Engine**: Port to WebGL/GLSL
2. **Audio Engine**: Use Web Audio API / Native modules
3. **Preset Parser**: JavaScript implementation
4. **Expression Evaluator**: Port ns-eel to JavaScript or use WASM
5. **Touch UI**: Modern React Native components

### Feature Prioritization:
**Phase 1 (MVP)**:
- Basic preset loading and playback
- Audio visualization with FFT
- Touch controls for preset switching
- Settings panel

**Phase 2**:
- Full preset compatibility
- Advanced effects and transitions
- Sprite system
- Preset editing

**Phase 3**:
- Double presets (.milk2)
- Mash-up features
- Advanced customization
- Playlist management
