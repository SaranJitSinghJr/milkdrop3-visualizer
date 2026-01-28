import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { savePreset, type MilkdropPreset } from './preset-storage';

// Import the preset catalog
const presetCatalog = require('../assets/preset-catalog.json');

interface PresetCatalogEntry {
  id: string;
  name: string;
  author: string;
  category: string;
  type: 'milk' | 'milk2';
  assetPath: string;
}

interface PresetCatalog {
  version: string;
  totalPresets: number;
  categories: string[];
  presets: PresetCatalogEntry[];
}

const BUNDLED_PRESETS_LOADED_KEY = '@milkdrop3/bundled_presets_loaded';

/**
 * Load bundled presets into the app storage on first launch
 */
export async function loadBundledPresets(): Promise<void> {
  try {
    // Check if already loaded
    const loaded = await AsyncStorage.getItem(BUNDLED_PRESETS_LOADED_KEY);
    if (loaded === 'true') {
      console.log('Bundled presets already loaded');
      return;
    }

    console.log('Loading bundled presets...');
    const catalog: PresetCatalog = presetCatalog;
    
    let successCount = 0;
    let errorCount = 0;

    for (const entry of catalog.presets) {
      try {
        // Load preset content from asset
        const content = await loadPresetFromAsset(entry.assetPath);
        
        if (content) {
          const preset: MilkdropPreset = {
            id: entry.id,
            name: entry.name,
            author: entry.author,
            type: entry.type,
            content,
            metadata: {
              createdAt: new Date().toISOString(),
              modifiedAt: new Date().toISOString(),
              isFavorite: false,
              tags: [entry.category, 'bundled'],
              version: 1,
            },
          };

          const saved = await savePreset(preset);
          if (saved) {
            successCount++;
          } else {
            errorCount++;
          }
        }
      } catch (error) {
        console.error(`Failed to load preset ${entry.name}:`, error);
        errorCount++;
      }
    }

    // Mark as loaded
    await AsyncStorage.setItem(BUNDLED_PRESETS_LOADED_KEY, 'true');
    
    console.log(`Bundled presets loaded: ${successCount} success, ${errorCount} errors`);
  } catch (error) {
    console.error('Failed to load bundled presets:', error);
  }
}

/**
 * Load preset content from asset bundle
 */
async function loadPresetFromAsset(assetPath: string): Promise<string | null> {
  try {
    // For Expo, we need to use require() for bundled assets
    // This is a workaround since we can't dynamically require
    // In production, presets would be loaded differently
    
    // For now, return a placeholder preset
    return generatePlaceholderPreset(assetPath);
  } catch (error) {
    console.error(`Failed to load asset ${assetPath}:`, error);
    return null;
  }
}

/**
 * Generate a placeholder preset for demo purposes
 */
function generatePlaceholderPreset(assetPath: string): string {
  const presetName = assetPath.split('/').pop()?.replace(/\.(milk|milk2)$/, '') || 'Preset';
  
  return `[preset00]
fRating=3.000000
fGammaAdj=2.000000
fDecay=0.980000
fVideoEchoZoom=1.000000
fVideoEchoAlpha=0.500000
nVideoEchoOrientation=0
nWaveMode=0
bAdditiveWaves=0
bWaveDots=0
bWaveThick=0
bModWaveAlphaByVolume=0
bMaximizeWaveColor=1
bTexWrap=1
bDarkenCenter=0
bRedBlueStereo=0
bBrighten=0
bDarken=0
bSolarize=0
bInvert=0
fWaveAlpha=0.800000
fWaveScale=1.000000
fWaveSmoothing=0.750000
fWaveParam=0.000000
fModWaveAlphaStart=0.750000
fModWaveAlphaEnd=0.950000
fWarpAnimSpeed=1.000000
fWarpScale=1.000000
fZoomExponent=1.000000
fShader=0.000000
zoom=1.000000
rot=0.000000
cx=0.500000
cy=0.500000
dx=0.000000
dy=0.000000
warp=1.000000
sx=1.000000
sy=1.000000
wave_r=0.500000
wave_g=0.500000
wave_b=0.500000
wave_x=0.500000
wave_y=0.500000
ob_size=0.010000
ob_r=0.000000
ob_g=0.000000
ob_b=0.000000
ob_a=0.000000
ib_size=0.010000
ib_r=0.250000
ib_g=0.250000
ib_b=0.250000
ib_a=0.000000
nMotionVectorsX=12.000000
nMotionVectorsY=9.000000
mv_dx=0.000000
mv_dy=0.000000
mv_l=0.900000
mv_r=1.000000
mv_g=1.000000
mv_b=1.000000
mv_a=0.000000
per_frame_1=wave_r = wave_r + 0.400*( 0.60*sin(0.933*time) + 0.40*sin(1.045*time) );
per_frame_2=wave_g = wave_g + 0.400*( 0.60*sin(0.900*time) + 0.40*sin(0.956*time) );
per_frame_3=wave_b = wave_b + 0.400*( 0.60*sin(0.910*time) + 0.40*sin(0.920*time) );
per_frame_4=zoom = zoom + 0.023*( 0.60*sin(0.339*time) + 0.40*sin(0.276*time) );
per_frame_5=rot = rot + 0.030*( 0.60*sin(0.381*time) + 0.40*sin(0.579*time) );
per_frame_6=cx = cx + 0.110*( 0.60*sin(0.374*time) + 0.40*sin(0.294*time) );
per_frame_7=cy = cy + 0.110*( 0.60*sin(0.393*time) + 0.40*sin(0.223*time) );
`;
}

/**
 * Get preset catalog information
 */
export function getPresetCatalog(): PresetCatalog {
  return presetCatalog;
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: string): PresetCatalogEntry[] {
  const catalog: PresetCatalog = presetCatalog;
  return catalog.presets.filter(p => p.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  const catalog: PresetCatalog = presetCatalog;
  return catalog.categories;
}

/**
 * Reset bundled presets (force reload on next app start)
 */
export async function resetBundledPresets(): Promise<void> {
  await AsyncStorage.removeItem(BUNDLED_PRESETS_LOADED_KEY);
  console.log('Bundled presets reset - will reload on next launch');
}
