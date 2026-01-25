import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export interface MilkdropPreset {
  id: string;
  name: string;
  author: string;
  type: 'milk' | 'milk2';
  content: string;
  metadata: {
    createdAt: string;
    modifiedAt: string;
    isFavorite: boolean;
    tags: string[];
    version: number;
    customColors?: boolean;
  };
}

export interface PresetCollection {
  id: string;
  name: string;
  presetIds: string[];
  createdAt: string;
}

const STORAGE_KEYS = {
  PRESETS: '@milkdrop3/presets',
  COLLECTIONS: '@milkdrop3/collections',
  FAVORITES: '@milkdrop3/favorites',
  RECENT: '@milkdrop3/recent',
  SETTINGS: '@milkdrop3/preset_settings',
};

const PRESET_DIR = `${FileSystem.documentDirectory ?? ''}presets/`;
const EXPORT_DIR = `${FileSystem.documentDirectory ?? ''}exports/`;

/**
 * Initialize preset storage directories
 */
export async function initializePresetStorage(): Promise<void> {
  try {
    const presetDirInfo = await FileSystem.getInfoAsync(PRESET_DIR);
    if (!presetDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PRESET_DIR, { intermediates: true });
    }

    const exportDirInfo = await FileSystem.getInfoAsync(EXPORT_DIR);
    if (!exportDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(EXPORT_DIR, { intermediates: true });
    }
  } catch (error) {
    console.error('Failed to initialize preset storage:', error);
  }
}

/**
 * Save a preset to storage
 */
export async function savePreset(preset: MilkdropPreset): Promise<boolean> {
  try {
    // Save preset content to file
    const filePath = `${PRESET_DIR}${preset.id}.${preset.type}`;
    await FileSystem.writeAsStringAsync(filePath, preset.content);

    // Save preset metadata to AsyncStorage
    const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
    const presets: Record<string, MilkdropPreset> = presetsJson ? JSON.parse(presetsJson) : {};
    
    presets[preset.id] = {
      ...preset,
      metadata: {
        ...preset.metadata,
        modifiedAt: new Date().toISOString(),
      },
    };

    await AsyncStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
    return true;
  } catch (error) {
    console.error('Failed to save preset:', error);
    return false;
  }
}

/**
 * Load a preset from storage
 */
export async function loadPreset(presetId: string): Promise<MilkdropPreset | null> {
  try {
    const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!presetsJson) return null;

    const presets: Record<string, MilkdropPreset> = JSON.parse(presetsJson);
    const preset = presets[presetId];
    
    if (!preset) return null;

    // Load preset content from file
    const filePath = `${PRESET_DIR}${preset.id}.${preset.type}`;
    const content = await FileSystem.readAsStringAsync(filePath);

    return {
      ...preset,
      content,
    };
  } catch (error) {
    console.error('Failed to load preset:', error);
    return null;
  }
}

/**
 * Get all presets metadata (without content)
 */
export async function getAllPresets(): Promise<MilkdropPreset[]> {
  try {
    const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!presetsJson) return [];

    const presets: Record<string, MilkdropPreset> = JSON.parse(presetsJson);
    return Object.values(presets).sort((a, b) => 
      new Date(b.metadata.modifiedAt).getTime() - new Date(a.metadata.modifiedAt).getTime()
    );
  } catch (error) {
    console.error('Failed to get all presets:', error);
    return [];
  }
}

/**
 * Delete a preset
 */
export async function deletePreset(presetId: string): Promise<boolean> {
  try {
    const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!presetsJson) return false;

    const presets: Record<string, MilkdropPreset> = JSON.parse(presetsJson);
    const preset = presets[presetId];
    
    if (!preset) return false;

    // Delete file
    const filePath = `${PRESET_DIR}${preset.id}.${preset.type}`;
    await FileSystem.deleteAsync(filePath, { idempotent: true });

    // Remove from metadata
    delete presets[presetId];
    await AsyncStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));

    // Remove from favorites if present
    await removeFavorite(presetId);

    return true;
  } catch (error) {
    console.error('Failed to delete preset:', error);
    return false;
  }
}

/**
 * Export preset to device storage
 */
export async function exportPreset(presetId: string): Promise<string | null> {
  try {
    const preset = await loadPreset(presetId);
    if (!preset) return null;

    const fileName = `${preset.name.replace(/[^a-z0-9]/gi, '_')}.${preset.type}`;
    const exportPath = `${EXPORT_DIR}${fileName}`;

    await FileSystem.writeAsStringAsync(exportPath, preset.content);
    return exportPath;
  } catch (error) {
    console.error('Failed to export preset:', error);
    return null;
  }
}

/**
 * Share preset via system share sheet
 */
export async function sharePreset(presetId: string): Promise<boolean> {
  try {
    const exportPath = await exportPreset(presetId);
    if (!exportPath) return false;

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.error('Sharing is not available on this device');
      return false;
    }

    await Sharing.shareAsync(exportPath, {
      mimeType: 'text/plain',
      dialogTitle: 'Share MilkDrop Preset',
    });

    return true;
  } catch (error) {
    console.error('Failed to share preset:', error);
    return false;
  }
}

/**
 * Import preset from file
 */
export async function importPreset(fileUri: string, name?: string): Promise<string | null> {
  try {
    const content = await FileSystem.readAsStringAsync(fileUri);
    const fileName = fileUri.split('/').pop() || 'imported.milk';
    const type = fileName.endsWith('.milk2') ? 'milk2' : 'milk';
    
    const presetId = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const presetName = name || fileName.replace(/\.(milk|milk2)$/, '');

    const preset: MilkdropPreset = {
      id: presetId,
      name: presetName,
      author: 'Imported',
      type,
      content,
      metadata: {
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        isFavorite: false,
        tags: ['imported'],
        version: 1,
      },
    };

    const success = await savePreset(preset);
    return success ? presetId : null;
  } catch (error) {
    console.error('Failed to import preset:', error);
    return null;
  }
}

/**
 * Duplicate a preset
 */
export async function duplicatePreset(presetId: string, newName?: string): Promise<string | null> {
  try {
    const preset = await loadPreset(presetId);
    if (!preset) return null;

    const newId = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const duplicatedPreset: MilkdropPreset = {
      ...preset,
      id: newId,
      name: newName || `${preset.name} (Copy)`,
      metadata: {
        ...preset.metadata,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        version: 1,
      },
    };

    const success = await savePreset(duplicatedPreset);
    return success ? newId : null;
  } catch (error) {
    console.error('Failed to duplicate preset:', error);
    return null;
  }
}

/**
 * Add preset to favorites
 */
export async function addFavorite(presetId: string): Promise<boolean> {
  try {
    const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];

    if (!favorites.includes(presetId)) {
      favorites.push(presetId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));

      // Update preset metadata
      const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
      if (presetsJson) {
        const presets: Record<string, MilkdropPreset> = JSON.parse(presetsJson);
        if (presets[presetId]) {
          presets[presetId].metadata.isFavorite = true;
          await AsyncStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return false;
  }
}

/**
 * Remove preset from favorites
 */
export async function removeFavorite(presetId: string): Promise<boolean> {
  try {
    const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];

    const filtered = favorites.filter(id => id !== presetId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));

    // Update preset metadata
    const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
    if (presetsJson) {
      const presets: Record<string, MilkdropPreset> = JSON.parse(presetsJson);
      if (presets[presetId]) {
        presets[presetId].metadata.isFavorite = false;
        await AsyncStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return false;
  }
}

/**
 * Get favorite presets
 */
export async function getFavorites(): Promise<MilkdropPreset[]> {
  try {
    const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];

    const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!presetsJson) return [];

    const presets: Record<string, MilkdropPreset> = JSON.parse(presetsJson);
    return favorites
      .map(id => presets[id])
      .filter(Boolean)
      .sort((a, b) => 
        new Date(b.metadata.modifiedAt).getTime() - new Date(a.metadata.modifiedAt).getTime()
      );
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
}

/**
 * Add preset to recent history
 */
export async function addToRecent(presetId: string): Promise<void> {
  try {
    const recentJson = await AsyncStorage.getItem(STORAGE_KEYS.RECENT);
    const recent: string[] = recentJson ? JSON.parse(recentJson) : [];

    // Remove if already exists
    const filtered = recent.filter(id => id !== presetId);
    
    // Add to front
    filtered.unshift(presetId);

    // Keep only last 50
    const limited = filtered.slice(0, 50);

    await AsyncStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to add to recent:', error);
  }
}

/**
 * Get recent presets
 */
export async function getRecent(limit: number = 20): Promise<MilkdropPreset[]> {
  try {
    const recentJson = await AsyncStorage.getItem(STORAGE_KEYS.RECENT);
    const recent: string[] = recentJson ? JSON.parse(recentJson) : [];

    const presetsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!presetsJson) return [];

    const presets: Record<string, MilkdropPreset> = JSON.parse(presetsJson);
    return recent
      .slice(0, limit)
      .map(id => presets[id])
      .filter(Boolean);
  } catch (error) {
    console.error('Failed to get recent presets:', error);
    return [];
  }
}

/**
 * Create a preset collection
 */
export async function createCollection(name: string, presetIds: string[] = []): Promise<string | null> {
  try {
    const collectionId = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const collection: PresetCollection = {
      id: collectionId,
      name,
      presetIds,
      createdAt: new Date().toISOString(),
    };

    const collectionsJson = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    const collections: Record<string, PresetCollection> = collectionsJson ? JSON.parse(collectionsJson) : {};
    
    collections[collectionId] = collection;
    await AsyncStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));

    return collectionId;
  } catch (error) {
    console.error('Failed to create collection:', error);
    return null;
  }
}

/**
 * Add preset to collection
 */
export async function addToCollection(collectionId: string, presetId: string): Promise<boolean> {
  try {
    const collectionsJson = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (!collectionsJson) return false;

    const collections: Record<string, PresetCollection> = JSON.parse(collectionsJson);
    const collection = collections[collectionId];
    
    if (!collection) return false;

    if (!collection.presetIds.includes(presetId)) {
      collection.presetIds.push(presetId);
      await AsyncStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    }

    return true;
  } catch (error) {
    console.error('Failed to add to collection:', error);
    return false;
  }
}

/**
 * Get all collections
 */
export async function getAllCollections(): Promise<PresetCollection[]> {
  try {
    const collectionsJson = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (!collectionsJson) return [];

    const collections: Record<string, PresetCollection> = JSON.parse(collectionsJson);
    return Object.values(collections).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Failed to get collections:', error);
    return [];
  }
}

/**
 * Search presets by name, author, or tags
 */
export async function searchPresets(query: string): Promise<MilkdropPreset[]> {
  try {
    const allPresets = await getAllPresets();
    const lowerQuery = query.toLowerCase();

    return allPresets.filter(preset => 
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.author.toLowerCase().includes(lowerQuery) ||
      preset.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Failed to search presets:', error);
    return [];
  }
}
