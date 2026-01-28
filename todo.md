# MilkDrop 3 Mobile - TODO

## Core Visualization Engine
- [ ] Set up expo-gl for OpenGL ES rendering
- [ ] Create WebGL context and shader management system
- [ ] Implement basic vertex and fragment shader pipeline
- [ ] Port MilkDrop warp shader to GLSL
- [ ] Port MilkDrop composite shader to GLSL
- [ ] Implement texture management and framebuffer system
- [ ] Create render loop with configurable FPS
- [ ] Implement double buffering for smooth rendering

## Audio Processing
- [ ] Set up expo-audio for microphone input
- [ ] Implement FFT analysis (512 samples)
- [ ] Create audio buffer management
- [ ] Implement bass/mid/treble frequency detection
- [ ] Add beat detection algorithm
- [ ] Create audio data smoothing and averaging
- [ ] Implement audio-reactive variables for shaders

## Preset System
- [ ] Create preset file parser for .milk files
- [ ] Implement preset state management
- [ ] Create preset loader with async file reading
- [ ] Build expression evaluator for per-frame code
- [ ] Build expression evaluator for per-pixel code
- [ ] Implement q-variables (q1-q64) system
- [ ] Add support for custom waves (up to 16)
- [ ] Add support for custom shapes (up to 16)
- [ ] Implement .milk2 double-preset support
- [ ] Create preset transition system with 27+ effects

## Touch UI - Visualizer Screen
- [ ] Create full-screen OpenGL canvas component
- [ ] Implement tap gesture to show/hide overlay
- [ ] Add swipe left/right for preset navigation
- [ ] Implement double-tap for color randomization
- [ ] Add long-press for quick settings menu
- [ ] Create auto-hiding overlay with preset name
- [ ] Build bottom control bar with navigation buttons
- [ ] Add glassmorphism effect to overlays

## Touch UI - Preset Browser
- [ ] Create preset browser screen with list view
- [ ] Implement search functionality
- [ ] Add category tabs (All/Favorites/Classic/Double)
- [ ] Create preset list items with thumbnails
- [ ] Implement swipe gestures for favorites/options
- [ ] Add pull-to-refresh functionality
- [ ] Create preset detail modal

## Touch UI - Settings Screen
- [ ] Build settings screen with grouped sections
- [ ] Add audio source selector
- [ ] Create FFT sensitivity slider
- [ ] Add bass/mid/treble boost controls
- [ ] Implement FPS selector (30/60/90/120)
- [ ] Add texture resolution selector
- [ ] Create transition duration slider
- [ ] Add auto-transition toggle and interval picker
- [ ] Implement wave count selector (1-16)
- [ ] Add shape count selector (1-16)
- [ ] Create warp amount slider
- [ ] Add zoom amount slider
- [ ] Implement brightness/contrast controls
- [ ] Add hardcut mode selector (1-7)
- [ ] Create transition effect picker
- [ ] Add keep screen awake toggle
- [ ] Implement FPS counter toggle
- [ ] Add theme selector (dark/light)

## Touch UI - Library Screen
- [ ] Create library screen layout
- [ ] Implement preset collection management
- [ ] Add playlist creation functionality
- [ ] Build import preset feature
- [ ] Add export preset feature
- [ ] Create recently used section

## Data Management
- [ ] Set up AsyncStorage for settings persistence
- [ ] Create settings save/load functions
- [ ] Implement preset favorites storage
- [ ] Add preset history tracking
- [ ] Create playlist storage system
- [ ] Implement preset cache management

## Advanced Features
- [ ] Create color randomization algorithm
- [ ] Implement beat-reactive auto-change (hardcut modes)
- [ ] Add sprite system with blending modes
- [ ] Create preset mashup functionality
- [ ] Implement preset editor (basic)
- [ ] Add shader code viewer
- [ ] Create variable inspector (q1-q64)

## Performance Optimization
- [ ] Implement shader compilation caching
- [ ] Add texture pooling system
- [ ] Optimize render loop for mobile GPUs
- [ ] Implement adaptive quality based on device performance
- [ ] Add memory management for preset loading

## Branding and Polish
- [ ] Generate custom app icon
- [ ] Update app.config.ts with branding
- [ ] Add splash screen with logo
- [ ] Implement haptic feedback for key interactions
- [ ] Add smooth animations for screen transitions
- [ ] Create loading states for async operations

## Testing and Bug Fixes
- [ ] Test on Android devices
- [ ] Verify audio input permissions
- [ ] Test preset loading and parsing
- [ ] Verify shader compilation on different GPUs
- [ ] Test gesture recognition accuracy
- [ ] Verify settings persistence
- [ ] Test memory usage with multiple presets

## Documentation
- [ ] Write user guide for app features
- [ ] Create preset authoring guide for mobile
- [ ] Document build process for APK
- [ ] Add troubleshooting section

## Enhanced Preset Saving System (User Request)
- [x] Create quick-save button in visualizer overlay
- [x] Implement save preset dialog with name input
- [x] Add "Save As" functionality for modified presets
- [x] Create preset export to device storage (.milk/.milk2 files)
- [x] Implement preset sharing via system share sheet
- [ ] Add preset backup/restore functionality
- [ ] Create preset versioning system
- [ ] Implement auto-save for modified presets
- [x] Add preset tags and custom metadata
- [x] Create preset collections/folders for organization
- [ ] Implement cloud sync for presets (optional)
- [x] Add preset duplicate detection

## Preset Library Integration (User Request)
- [x] Extract cream-of-the-crop preset collection
- [x] Parse and validate all .milk preset files
- [x] Import presets into app storage
- [ ] Create preset thumbnails/previews
- [x] Organize presets by category
- [x] Add preset metadata (author, description)
- [x] Create default preset collection

## Unified App Integration (User Request)
- [x] Create advanced Settings screen with all MilkDrop customizations
- [x] Add comprehensive visual settings (decay, gamma, video echo, etc.)
- [x] Implement waveform customization controls
- [x] Add color and motion settings
- [x] Create performance optimization settings
- [x] Implement preset transition settings
- [x] Add audio input source selection
- [x] Create UI theme customization
- [ ] Implement gesture controls for visualizer
- [x] Add fullscreen mode toggle
- [x] Create settings persistence
- [x] Design cohesive navigation between all screens
- [ ] Add smooth transitions and animations
- [x] Implement unified color scheme across app
- [ ] Create onboarding/tutorial flow

## Final Enhancements (User Request)
- [x] Generate custom MilkDrop-themed app icon
- [x] Update app branding in app.config.ts
- [x] Copy icon to all required asset locations
- [x] Install expo-gl for WebGL rendering
- [x] Create GLSL shader manager
- [x] Implement basic waveform renderer with WebGL
- [x] Add preset-based shader system
- [ ] Implement FFT audio analysis integration
- [x] Add swipe gesture to change presets
- [x] Implement pinch-to-zoom gesture
- [x] Add tap-to-hide UI gesture
- [ ] Create gesture tutorial overlay
- [ ] Test all gestures on touch screen

## EAS Build Configuration (User Request)
- [x] Create eas.json with optimized build profiles
- [x] Configure preview build for APK distribution
- [x] Configure production build for Play Store
- [x] Add build optimization settings
- [x] Document EAS build process

## GitHub Actions APK Build (User Request)
- [x] Create GitHub Actions workflow file
- [x] Configure EAS build automation
- [x] Set up artifact storage
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Trigger first automated build
- [ ] Provide APK download link to user
