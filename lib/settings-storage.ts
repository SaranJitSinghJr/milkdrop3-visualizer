import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@milkdrop3/settings';

export interface MilkdropSettings {
  // Visual Effects
  fDecay: number;
  fGammaAdj: number;
  fVideoEchoZoom: number;
  fVideoEchoAlpha: number;
  zoom: number;
  rot: number;
  warp: number;
  bDarkenCenter: boolean;
  bBrighten: boolean;
  bDarken: boolean;
  bSolarize: boolean;
  bInvert: boolean;
  bTexWrap: boolean;
  bRedBlueStereo: boolean;

  // Waveform
  fWaveAlpha: number;
  fWaveScale: number;
  fWaveSmoothing: number;
  bAdditiveWaves: boolean;
  bWaveDots: boolean;
  bWaveThick: boolean;
  bMaximizeWaveColor: boolean;
  bModWaveAlphaByVolume: boolean;

  // Colors
  wave_r: number;
  wave_g: number;
  wave_b: number;
  ob_size: number;
  ob_r: number;
  ob_g: number;
  ob_b: number;
  ob_a: number;
  ib_size: number;
  ib_r: number;
  ib_g: number;
  ib_b: number;
  ib_a: number;

  // Motion
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  sx: number;
  sy: number;
  fWarpAnimSpeed: number;
  fWarpScale: number;
  fZoomExponent: number;

  // Performance
  targetFPS: number;
  audioFFTSize: number;

  // UI
  showFPS: boolean;
  showPresetInfo: boolean;
  autoHideControls: boolean;
  fullscreenMode: boolean;
  uiOpacity: number;

  // Preset Transitions
  autoAdvance: boolean;
  presetDuration: number;
  transitionDuration: number;
  randomPresetOrder: boolean;

  // Audio
  audioSensitivity: number;
  normalizeAudio: boolean;
  bassBoost: number;
  trebleBoost: number;
}

export const DEFAULT_SETTINGS: MilkdropSettings = {
  // Visual Effects
  fDecay: 0.98,
  fGammaAdj: 2.0,
  fVideoEchoZoom: 1.0,
  fVideoEchoAlpha: 0.5,
  zoom: 1.0,
  rot: 0.0,
  warp: 1.0,
  bDarkenCenter: false,
  bBrighten: false,
  bDarken: false,
  bSolarize: false,
  bInvert: false,
  bTexWrap: true,
  bRedBlueStereo: false,

  // Waveform
  fWaveAlpha: 0.8,
  fWaveScale: 1.0,
  fWaveSmoothing: 0.75,
  bAdditiveWaves: false,
  bWaveDots: false,
  bWaveThick: false,
  bMaximizeWaveColor: true,
  bModWaveAlphaByVolume: false,

  // Colors
  wave_r: 0.5,
  wave_g: 0.5,
  wave_b: 0.5,
  ob_size: 0.01,
  ob_r: 0.0,
  ob_g: 0.0,
  ob_b: 0.0,
  ob_a: 0.0,
  ib_size: 0.01,
  ib_r: 0.25,
  ib_g: 0.25,
  ib_b: 0.25,
  ib_a: 0.0,

  // Motion
  cx: 0.5,
  cy: 0.5,
  dx: 0.0,
  dy: 0.0,
  sx: 1.0,
  sy: 1.0,
  fWarpAnimSpeed: 1.0,
  fWarpScale: 1.0,
  fZoomExponent: 1.0,

  // Performance
  targetFPS: 30,
  audioFFTSize: 512,

  // UI
  showFPS: false,
  showPresetInfo: true,
  autoHideControls: true,
  fullscreenMode: false,
  uiOpacity: 0.8,

  // Preset Transitions
  autoAdvance: false,
  presetDuration: 30,
  transitionDuration: 2.0,
  randomPresetOrder: false,

  // Audio
  audioSensitivity: 1.0,
  normalizeAudio: true,
  bassBoost: 1.0,
  trebleBoost: 1.0,
};

/**
 * Load settings from storage
 */
export async function loadSettings(): Promise<MilkdropSettings> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings: MilkdropSettings): Promise<boolean> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<boolean> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return true;
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return false;
  }
}

/**
 * Get a specific setting value
 */
export async function getSetting<K extends keyof MilkdropSettings>(
  key: K
): Promise<MilkdropSettings[K]> {
  const settings = await loadSettings();
  return settings[key];
}

/**
 * Update a specific setting value
 */
export async function updateSetting<K extends keyof MilkdropSettings>(
  key: K,
  value: MilkdropSettings[K]
): Promise<boolean> {
  try {
    const settings = await loadSettings();
    settings[key] = value;
    return await saveSettings(settings);
  } catch (error) {
    console.error('Failed to update setting:', error);
    return false;
  }
}
