# MilkDrop 3 Mobile - Interface Design

## Design Philosophy

MilkDrop 3 Mobile transforms the desktop music visualizer into a mobile-first experience optimized for **portrait orientation (9:16)** and **one-handed touch interaction**. The design follows Apple Human Interface Guidelines to feel like a native iOS app while maintaining the immersive, audio-reactive visual experience that defines MilkDrop.

## Screen Architecture

### 1. Visualizer Screen (Primary)
**Purpose**: Full-screen audio-reactive visualization display

**Layout**:
- Full-screen OpenGL canvas for visualization rendering
- Minimal overlay UI that auto-hides after 3 seconds of inactivity
- Top overlay: Current preset name (fades in/out)
- Bottom overlay: Playback controls and navigation

**Content**:
- Real-time audio-reactive visualization using WebGL/GLSL shaders
- Smooth transitions between presets
- Beat-reactive effects and color changes
- Support for shapes, waves, and particle effects

**Interactions**:
- Tap screen: Show/hide overlay controls
- Swipe left/right: Navigate between presets
- Double-tap: Randomize colors
- Long-press: Open quick settings menu
- Pinch gesture: Zoom/scale effects (optional)

### 2. Preset Browser Screen
**Purpose**: Browse, search, and select visualization presets

**Layout**:
- Search bar at top with filter button
- Preset list with thumbnail previews (generated from preset metadata)
- Category tabs: All / Favorites / Classic (.milk) / Double (.milk2)
- Pull-to-refresh for preset list updates

**Content**:
- Preset name and author
- Small preview thumbnail (static or animated)
- Favorite star indicator
- Preset type badge (.milk or .milk2)
- Last used timestamp

**Interactions**:
- Tap preset: Load and return to visualizer
- Swipe right on preset: Add to favorites
- Swipe left on preset: Show options (share, delete, edit)
- Search: Filter by name, author, or tags
- Filter: Show only favorites, classic, or double presets

### 3. Settings Screen
**Purpose**: Configure visualization parameters and app preferences

**Layout**:
- Grouped settings sections with iOS-style list design
- Section headers with descriptive text
- Toggle switches, sliders, and selection pickers
- Preview area at top showing current effect

**Content Sections**:

**Audio Settings**:
- Audio source selection (microphone, system audio if available)
- FFT sensitivity slider
- Bass/Mid/Treble boost controls
- Beat detection threshold

**Visualization Settings**:
- Frame rate selector (30/60/90/120 FPS)
- Internal texture resolution (Auto/512/1024/2048)
- Transition duration slider
- Auto-transition toggle and interval (15/30/45/60 seconds)

**Effect Settings**:
- Wave count (1-16)
- Shape count (1-16)
- Warp amount slider (0-100)
- Zoom amount slider (0-100)
- Brightness/Contrast controls

**Preset Behavior**:
- Auto-change on beat (Hardcut modes 1-7)
- Random preset order toggle
- Never repeat presets toggle
- Transition effect selector (27+ types)

**Display Settings**:
- Keep screen awake toggle
- Show FPS counter
- Show preset info overlay
- Dark/Light theme for UI

**Advanced**:
- Shader cache management
- Reset to defaults
- Export/Import settings

**Interactions**:
- Sliders: Smooth drag with haptic feedback at key values
- Toggles: Instant feedback with haptic
- Selectors: Open modal picker with current value highlighted

### 4. Library Screen
**Purpose**: Manage preset collections and playlists

**Layout**:
- Tab selector: Presets / Playlists / Imported
- Action buttons: Import, Export, New Playlist
- List view with sections and counts

**Content**:
- Preset count by category
- Playlist cards with preset count and thumbnail grid
- Recently used presets section
- Import history

**Interactions**:
- Create new playlist
- Add/remove presets from playlists
- Import .milk/.milk2 files from device storage
- Export current preset or playlist
- Share presets with other users

### 5. Preset Editor Screen (Advanced)
**Purpose**: Edit preset parameters and shader code

**Layout**:
- Split view: Live preview on top (1/3), controls below (2/3)
- Tabbed sections: Colors, Waves, Shapes, Code
- Save/Discard buttons in header

**Content**:
- Color picker with randomize button
- Wave/Shape parameter sliders
- Code editor for per-frame and per-pixel shaders (basic)
- Variable inspector (q1-q64 values)

**Interactions**:
- Real-time preview updates as parameters change
- Undo/Redo for changes
- Save as new preset or overwrite
- Copy/Paste shader code

## Key User Flows

### Flow 1: Launch App → Watch Visualization
1. User opens app
2. App loads last used preset or default
3. Requests microphone permission (first time)
4. Visualization starts immediately with audio input
5. Overlay shows preset name, fades after 3 seconds
6. User can tap to show controls or swipe to change presets

### Flow 2: Browse and Select Preset
1. User taps screen to show overlay
2. Taps "Browse" button in bottom bar
3. Preset browser opens with search and categories
4. User scrolls through list or searches
5. Taps desired preset
6. Preset loads with transition effect
7. Returns to visualizer screen

### Flow 3: Adjust Settings
1. User taps screen to show overlay
2. Taps "Settings" icon in bottom bar
3. Settings screen opens
4. User adjusts sliders/toggles in desired section
5. Changes apply immediately (or with preview)
6. User taps back to return to visualizer
7. Settings persist for next launch

### Flow 4: Create Playlist
1. User opens Library screen
2. Taps "New Playlist" button
3. Names the playlist
3. Browses presets and taps "+" to add
4. Reorders presets by drag-and-drop
5. Saves playlist
6. Can load playlist from visualizer screen

### Flow 5: Customize Colors
1. User watching visualization
2. Double-taps screen
3. Colors randomize with smooth transition
4. Preset info shows "Colors modified"
5. User can save as new preset or revert

## Color Palette

The app uses a dark-themed color scheme to complement the vibrant visualizations:

**Primary Colors**:
- Primary Accent: `#00D9FF` (Cyan) - for active controls and highlights
- Background: `#0A0A0F` (Near black) - main app background
- Surface: `#1A1A24` (Dark gray) - cards and panels
- Foreground: `#FFFFFF` (White) - primary text

**Secondary Colors**:
- Muted: `#8A8A9E` (Gray) - secondary text and icons
- Border: `#2A2A3A` (Dark border) - dividers and outlines
- Success: `#00FF88` (Green) - success states
- Warning: `#FFB800` (Amber) - warning states
- Error: `#FF3366` (Red) - error states

**Visualization Overlay**:
- Semi-transparent dark background: `rgba(0, 0, 0, 0.6)`
- Blur effect for glassmorphism on controls

## Typography

Following iOS standards for readability on mobile:

- **Large Title**: 34pt, Bold - Screen headers
- **Title**: 28pt, Bold - Section headers
- **Headline**: 17pt, Semibold - Preset names
- **Body**: 17pt, Regular - Main content
- **Callout**: 16pt, Regular - Secondary content
- **Subhead**: 15pt, Regular - Metadata
- **Footnote**: 13pt, Regular - Captions
- **Caption**: 12pt, Regular - Timestamps

## Touch Targets and Spacing

All interactive elements follow iOS guidelines:

- Minimum touch target: 44x44pt
- Button height: 50pt for primary actions
- List item height: 60pt minimum
- Padding: 16pt standard, 24pt for screen edges
- Card corner radius: 12pt
- Button corner radius: 25pt (pill shape)

## Gestures Summary

| Gesture | Action |
|---------|--------|
| Single tap | Show/hide overlay controls |
| Double tap | Randomize colors |
| Long press | Quick settings menu |
| Swipe left/right | Previous/next preset |
| Swipe up (bottom) | Open preset browser |
| Swipe down | Dismiss modal screens |
| Pinch | Zoom effect (optional) |

## Animation Guidelines

All animations are subtle and purposeful:

- Screen transitions: 300ms ease-in-out
- Overlay fade: 200ms
- Button press: 100ms scale to 0.95
- Preset transition: 1-3 seconds (configurable)
- Color randomization: 500ms smooth blend
- List item animations: 150ms stagger

## Accessibility Considerations

- High contrast mode support
- VoiceOver labels for all controls
- Haptic feedback for important actions
- Adjustable text sizes
- Reduce motion option (disables transitions)
- Color-blind friendly UI colors (not visualization)

## Implementation Notes

The design prioritizes **functionality first**, then **feedback**, then **polish**. The initial implementation focuses on:

1. Core visualization rendering with basic presets
2. Audio input and FFT analysis
3. Preset loading and switching
4. Essential settings (FPS, resolution, audio source)
5. Touch controls for navigation

Advanced features like preset editing, playlists, and complex transitions will be implemented in later phases once the core experience is solid and tested.
