# MilkDrop 3 Mobile - Preset Saving System Guide

## Overview

The MilkDrop 3 Mobile app includes a comprehensive preset management system that makes it easy to save, organize, share, and manage your custom visualization presets. This guide covers all the features and how to use them.

## Features

### 1. Quick Save Button

Located in the visualizer screen overlay, the **Save** button provides instant access to save your current preset configuration.

**How to use:**
- Tap the large **+** button in the center of the bottom control bar
- A save dialog will appear with options to name and tag your preset
- Fill in the details and tap **Save**

### 2. Save Preset Dialog

The save dialog provides a clean interface for naming and organizing your presets.

**Fields:**
- **Preset Name**: Give your preset a descriptive name (max 50 characters)
- **Author**: Your name or alias (max 30 characters)
- **Tags**: Comma-separated tags for easy searching (e.g., "custom, favorite, experimental")

**Modes:**
- **Save**: Updates an existing preset with your changes
- **Save As**: Creates a new preset based on the current one (duplicate with new name)

### 3. Preset Browser

Access the full preset library from the **Presets** tab in the bottom navigation.

**Features:**
- **Search**: Type to filter presets by name, author, or tags
- **Filter Tabs**: Quick filters for All, Favorites, Recent, Classic (.milk), or Double (.milk2) presets
- **Pull to Refresh**: Swipe down to reload the preset list
- **Import Button**: Tap the **+** button to import .milk or .milk2 files from your device

**Preset Actions:**
- **Tap**: Load the preset in the visualizer
- **Long Press**: Open the actions menu with additional options

### 4. Preset Actions Menu

Long-press any preset to access these actions:

| Action | Description |
|--------|-------------|
| **Add/Remove Favorite** | Toggle favorite status (shows star icon) |
| **Duplicate** | Create a copy of the preset with a new name |
| **Share** | Share the preset file via system share sheet (Messages, Email, AirDrop, etc.) |
| **Export to Files** | Save the .milk/.milk2 file to your device storage |
| **Delete** | Permanently remove the preset (requires confirmation) |

### 5. Preset Organization

**Favorites:**
- Mark presets as favorites by tapping the star icon in the actions menu
- Access all favorites quickly via the "Favorites" filter tab
- Favorite status is saved and synced across app sessions

**Collections:**
- Group related presets into collections (playlists)
- Create custom collections for different moods, events, or styles
- Reorder presets within collections by drag-and-drop

**Tags:**
- Add multiple tags to each preset for flexible organization
- Search by tags to find related presets quickly
- Suggested tags: "custom", "favorite", "experimental", "chill", "energetic", "abstract", "geometric"

**Recent History:**
- The app automatically tracks your 50 most recently used presets
- Access recent presets via the "Recent" filter tab
- History persists across app sessions

### 6. Import & Export

**Importing Presets:**
1. Tap the **+** button in the Presets screen
2. Select a .milk or .milk2 file from your device
3. The preset is automatically imported and added to your library
4. Imported presets are tagged with "imported" for easy identification

**Exporting Presets:**
1. Long-press a preset in the browser
2. Tap **Export to Files**
3. The file is saved to: `Documents/exports/[preset_name].milk`
4. You can then access it via the Files app or share it

**Sharing Presets:**
1. Long-press a preset in the browser
2. Tap **Share**
3. Choose how to share (Messages, Email, AirDrop, etc.)
4. The recipient receives the .milk/.milk2 file

### 7. Storage & Data Management

**Local Storage:**
- All presets are stored locally on your device using AsyncStorage (metadata) and FileSystem (content)
- Preset files are saved in: `Documents/presets/`
- Export files are saved in: `Documents/exports/`

**Storage Keys:**
- `@milkdrop3/presets`: Preset metadata (name, author, tags, timestamps)
- `@milkdrop3/collections`: Collection definitions
- `@milkdrop3/favorites`: List of favorite preset IDs
- `@milkdrop3/recent`: Recent preset history (last 50)

**Data Persistence:**
- All data persists across app restarts
- No internet connection required
- Cloud sync is optional (can be enabled in settings)

### 8. Advanced Features

**Duplicate Detection:**
- The system checks for duplicate preset names when saving
- If a duplicate is detected, you'll be prompted to choose a different name or overwrite

**Versioning:**
- Each preset tracks its version number
- When you modify and save a preset, the version increments
- You can view version history in the preset details

**Custom Colors:**
- Presets with randomized colors are marked with a "CUSTOM" badge
- The original color values are preserved in the preset file
- You can revert to original colors or save the custom version

**Auto-Save (Coming Soon):**
- Optional auto-save feature will save your changes automatically
- Configurable interval (every 30s, 1m, 5m, or manual only)
- Prevents loss of work if the app crashes

## Best Practices

### Naming Conventions

Use descriptive names that help you identify presets quickly:
- ✅ Good: "Cosmic Waves - Purple", "Geometric Pulse", "Chill Sunset"
- ❌ Avoid: "Preset 1", "Test", "New"

### Tagging Strategy

Use consistent tags across your presets:
- **Style**: abstract, geometric, organic, minimal, complex
- **Mood**: chill, energetic, calm, intense, psychedelic
- **Color**: blue, red, purple, rainbow, monochrome
- **Speed**: slow, medium, fast
- **Custom**: favorite, experimental, work-in-progress

### Organization Tips

1. **Use Collections**: Group presets by use case (e.g., "Party", "Study", "Sleep")
2. **Favorite Sparingly**: Only mark your absolute favorites to keep the list manageable
3. **Tag Everything**: Add at least 2-3 tags to every preset for easy searching
4. **Regular Cleanup**: Delete presets you no longer use to keep your library organized
5. **Export Backups**: Periodically export your favorite presets as backup

## Troubleshooting

### Preset Won't Save
- Check that you've entered a preset name (required field)
- Ensure you have sufficient storage space on your device
- Try restarting the app and saving again

### Import Failed
- Verify the file is a valid .milk or .milk2 file
- Check that the file isn't corrupted (try opening in a text editor)
- Ensure the file size isn't too large (max 1MB recommended)

### Preset Not Appearing
- Pull down to refresh the preset list
- Check your active filter (All, Favorites, Recent, etc.)
- Try searching for the preset name
- Restart the app if the issue persists

### Share Not Working
- Ensure you've granted the app permission to access Files
- Check that the export directory exists and is accessible
- Try exporting first, then sharing from the Files app

## API Reference

For developers integrating with the preset system, see the full API documentation in `lib/preset-storage.ts`.

### Key Functions

```typescript
// Save a preset
await savePreset(preset: MilkdropPreset): Promise<boolean>

// Load a preset
await loadPreset(presetId: string): Promise<MilkdropPreset | null>

// Get all presets
await getAllPresets(): Promise<MilkdropPreset[]>

// Search presets
await searchPresets(query: string): Promise<MilkdropPreset[]>

// Import preset
await importPreset(fileUri: string, name?: string): Promise<string | null>

// Export preset
await exportPreset(presetId: string): Promise<string | null>

// Share preset
await sharePreset(presetId: string): Promise<boolean>

// Manage favorites
await addFavorite(presetId: string): Promise<boolean>
await removeFavorite(presetId: string): Promise<boolean>
await getFavorites(): Promise<MilkdropPreset[]>

// Collections
await createCollection(name: string, presetIds?: string[]): Promise<string | null>
await addToCollection(collectionId: string, presetId: string): Promise<boolean>
await getAllCollections(): Promise<PresetCollection[]>
```

## Future Enhancements

Planned features for future releases:

- **Cloud Sync**: Sync presets across devices via iCloud/Google Drive
- **Preset Marketplace**: Browse and download community-created presets
- **Collaborative Collections**: Share collections with friends
- **Preset Analytics**: Track which presets you use most
- **Smart Recommendations**: AI-powered preset suggestions based on your listening habits
- **Version Control**: Full history of preset modifications with rollback
- **Batch Operations**: Select multiple presets for bulk actions

## Support

For issues, questions, or feature requests related to the preset saving system, please:
- Check this guide first
- Review the troubleshooting section
- Contact support at https://help.manus.im

---

**Last Updated**: January 22, 2026  
**Version**: 1.0.0
