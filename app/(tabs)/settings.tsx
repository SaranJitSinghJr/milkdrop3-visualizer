import { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { loadSettings, saveSettings, resetSettings, type MilkdropSettings } from '@/lib/settings-storage';

export default function SettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState<MilkdropSettings | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['visual']));

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    const loaded = await loadSettings();
    setSettings(loaded);
  };

  const updateSetting = async <K extends keyof MilkdropSettings>(
    key: K,
    value: MilkdropSettings[K]
  ) => {
    if (!settings) return;
    
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveSettings(updated);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetSettings();
            await loadSettingsData();
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  if (!settings) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Loading settings...</Text>
      </ScreenContainer>
    );
  }

  const renderSectionHeader = (title: string, icon: string, sectionKey: string) => {
    const isExpanded = expandedSections.has(sectionKey);
    
    return (
      <TouchableOpacity
        onPress={() => toggleSection(sectionKey)}
        className="flex-row items-center justify-between py-4 px-6 bg-surface border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <View className="flex-row items-center gap-3">
          <IconSymbol name={icon as any} size={24} color={colors.primary} />
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
        </View>
        <IconSymbol
          name="chevron.right"
          size={20}
          color={colors.muted}
          style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
        />
      </TouchableOpacity>
    );
  };

  const renderSlider = (
    label: string,
    value: number,
    onValueChange: (val: number) => void,
    min: number = 0,
    max: number = 1,
    step: number = 0.01
  ) => (
    <View className="py-3 px-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-foreground">{label}</Text>
        <Text className="text-muted font-mono">{value.toFixed(2)}</Text>
      </View>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
    </View>
  );

  const renderToggle = (label: string, value: boolean, onValueChange: (val: boolean) => void, subtitle?: string) => (
    <View className="flex-row items-center justify-between py-4 px-6">
      <View className="flex-1 pr-4">
        <Text className="text-foreground">{label}</Text>
        {subtitle && <Text className="text-sm text-muted mt-1">{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView>
        {/* Header */}
        <View className="p-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
          <Text className="text-muted mt-1">Customize your MilkDrop experience</Text>
        </View>

        {/* Visual Settings */}
        {renderSectionHeader('Visual Effects', 'chevron.left.forwardslash.chevron.right', 'visual')}
        {expandedSections.has('visual') && (
          <View>
            {renderSlider('Decay', settings.fDecay, (v) => updateSetting('fDecay', v), 0.9, 1.0)}
            {renderSlider('Gamma', settings.fGammaAdj, (v) => updateSetting('fGammaAdj', v), 1.0, 4.0)}
            {renderSlider('Video Echo Zoom', settings.fVideoEchoZoom, (v) => updateSetting('fVideoEchoZoom', v), 0.9, 1.1)}
            {renderSlider('Video Echo Alpha', settings.fVideoEchoAlpha, (v) => updateSetting('fVideoEchoAlpha', v))}
            {renderSlider('Zoom', settings.zoom, (v) => updateSetting('zoom', v), 0.9, 1.1)}
            {renderSlider('Rotation', settings.rot, (v) => updateSetting('rot', v), -0.1, 0.1, 0.001)}
            {renderSlider('Warp', settings.warp, (v) => updateSetting('warp', v), 0, 2)}
            {renderToggle('Darken Center', settings.bDarkenCenter, (v) => updateSetting('bDarkenCenter', v))}
            {renderToggle('Brighten', settings.bBrighten, (v) => updateSetting('bBrighten', v))}
            {renderToggle('Darken', settings.bDarken, (v) => updateSetting('bDarken', v))}
            {renderToggle('Solarize', settings.bSolarize, (v) => updateSetting('bSolarize', v))}
            {renderToggle('Invert', settings.bInvert, (v) => updateSetting('bInvert', v))}
          </View>
        )}

        {/* Waveform Settings */}
        {renderSectionHeader('Waveform', 'house.fill', 'waveform')}
        {expandedSections.has('waveform') && (
          <View>
            {renderSlider('Wave Alpha', settings.fWaveAlpha, (v) => updateSetting('fWaveAlpha', v))}
            {renderSlider('Wave Scale', settings.fWaveScale, (v) => updateSetting('fWaveScale', v), 0.1, 5.0)}
            {renderSlider('Wave Smoothing', settings.fWaveSmoothing, (v) => updateSetting('fWaveSmoothing', v))}
            {renderToggle('Additive Waves', settings.bAdditiveWaves, (v) => updateSetting('bAdditiveWaves', v))}
            {renderToggle('Wave Dots', settings.bWaveDots, (v) => updateSetting('bWaveDots', v))}
            {renderToggle('Thick Waves', settings.bWaveThick, (v) => updateSetting('bWaveThick', v))}
            {renderToggle('Maximize Wave Color', settings.bMaximizeWaveColor, (v) => updateSetting('bMaximizeWaveColor', v))}
            {renderToggle('Modulate Alpha by Volume', settings.bModWaveAlphaByVolume, (v) => updateSetting('bModWaveAlphaByVolume', v))}
          </View>
        )}

        {/* Color Settings */}
        {renderSectionHeader('Colors', 'chevron.left.forwardslash.chevron.right', 'colors')}
        {expandedSections.has('colors') && (
          <View>
            <Text className="text-sm text-muted px-6 pt-4 pb-2">Wave Colors</Text>
            {renderSlider('Red', settings.wave_r, (v) => updateSetting('wave_r', v))}
            {renderSlider('Green', settings.wave_g, (v) => updateSetting('wave_g', v))}
            {renderSlider('Blue', settings.wave_b, (v) => updateSetting('wave_b', v))}
            
            <Text className="text-sm text-muted px-6 pt-4 pb-2">Outer Border</Text>
            {renderSlider('Size', settings.ob_size, (v) => updateSetting('ob_size', v), 0, 0.5)}
            {renderSlider('Red', settings.ob_r, (v) => updateSetting('ob_r', v))}
            {renderSlider('Green', settings.ob_g, (v) => updateSetting('ob_g', v))}
            {renderSlider('Blue', settings.ob_b, (v) => updateSetting('ob_b', v))}
            {renderSlider('Alpha', settings.ob_a, (v) => updateSetting('ob_a', v))}
            
            <Text className="text-sm text-muted px-6 pt-4 pb-2">Inner Border</Text>
            {renderSlider('Size', settings.ib_size, (v) => updateSetting('ib_size', v), 0, 0.5)}
            {renderSlider('Red', settings.ib_r, (v) => updateSetting('ib_r', v))}
            {renderSlider('Green', settings.ib_g, (v) => updateSetting('ib_g', v))}
            {renderSlider('Blue', settings.ib_b, (v) => updateSetting('ib_b', v))}
            {renderSlider('Alpha', settings.ib_a, (v) => updateSetting('ib_a', v))}
          </View>
        )}

        {/* Motion Settings */}
        {renderSectionHeader('Motion', 'chevron.left.forwardslash.chevron.right', 'motion')}
        {expandedSections.has('motion') && (
          <View>
            {renderSlider('Center X', settings.cx, (v) => updateSetting('cx', v))}
            {renderSlider('Center Y', settings.cy, (v) => updateSetting('cy', v))}
            {renderSlider('Delta X', settings.dx, (v) => updateSetting('dx', v), -0.1, 0.1, 0.001)}
            {renderSlider('Delta Y', settings.dy, (v) => updateSetting('dy', v), -0.1, 0.1, 0.001)}
            {renderSlider('Scale X', settings.sx, (v) => updateSetting('sx', v), 0.5, 2.0)}
            {renderSlider('Scale Y', settings.sy, (v) => updateSetting('sy', v), 0.5, 2.0)}
            {renderSlider('Warp Animation Speed', settings.fWarpAnimSpeed, (v) => updateSetting('fWarpAnimSpeed', v), 0, 5)}
            {renderSlider('Warp Scale', settings.fWarpScale, (v) => updateSetting('fWarpScale', v), 0, 5)}
            {renderSlider('Zoom Exponent', settings.fZoomExponent, (v) => updateSetting('fZoomExponent', v), 0.1, 10)}
          </View>
        )}

        {/* Performance Settings */}
        {renderSectionHeader('Performance', 'chevron.left.forwardslash.chevron.right', 'performance')}
        {expandedSections.has('performance') && (
          <View>
            {renderSlider('Target FPS', settings.targetFPS, (v) => updateSetting('targetFPS', v), 15, 60, 1)}
            {renderSlider('Audio FFT Size', settings.audioFFTSize, (v) => updateSetting('audioFFTSize', v), 256, 2048, 256)}
            {renderToggle('Texture Wrapping', settings.bTexWrap, (v) => updateSetting('bTexWrap', v), 'Enable texture edge wrapping')}
            {renderToggle('Red-Blue Stereo', settings.bRedBlueStereo, (v) => updateSetting('bRedBlueStereo', v), '3D anaglyph mode')}
          </View>
        )}

        {/* UI Settings */}
        {renderSectionHeader('User Interface', 'house.fill', 'ui')}
        {expandedSections.has('ui') && (
          <View>
            {renderToggle('Show FPS Counter', settings.showFPS, (v) => updateSetting('showFPS', v))}
            {renderToggle('Show Preset Info', settings.showPresetInfo, (v) => updateSetting('showPresetInfo', v), 'Display preset name overlay')}
            {renderToggle('Auto-hide Controls', settings.autoHideControls, (v) => updateSetting('autoHideControls', v), 'Hide controls after 3 seconds')}
            {renderToggle('Fullscreen Mode', settings.fullscreenMode, (v) => updateSetting('fullscreenMode', v))}
            {renderSlider('UI Opacity', settings.uiOpacity, (v) => updateSetting('uiOpacity', v), 0.3, 1.0)}
          </View>
        )}

        {/* Preset Transition Settings */}
        {renderSectionHeader('Preset Transitions', 'chevron.left.forwardslash.chevron.right', 'transitions')}
        {expandedSections.has('transitions') && (
          <View>
            {renderToggle('Auto-advance Presets', settings.autoAdvance, (v) => updateSetting('autoAdvance', v))}
            {renderSlider('Preset Duration (seconds)', settings.presetDuration, (v) => updateSetting('presetDuration', v), 5, 120, 5)}
            {renderSlider('Transition Duration (seconds)', settings.transitionDuration, (v) => updateSetting('transitionDuration', v), 0.5, 10, 0.5)}
            {renderToggle('Random Preset Order', settings.randomPresetOrder, (v) => updateSetting('randomPresetOrder', v))}
          </View>
        )}

        {/* Audio Settings */}
        {renderSectionHeader('Audio', 'house.fill', 'audio')}
        {expandedSections.has('audio') && (
          <View>
            {renderSlider('Audio Sensitivity', settings.audioSensitivity, (v) => updateSetting('audioSensitivity', v), 0.1, 5.0)}
            {renderToggle('Normalize Audio', settings.normalizeAudio, (v) => updateSetting('normalizeAudio', v), 'Auto-adjust volume levels')}
            {renderSlider('Bass Boost', settings.bassBoost, (v) => updateSetting('bassBoost', v), 0, 2)}
            {renderSlider('Treble Boost', settings.trebleBoost, (v) => updateSetting('trebleBoost', v), 0, 2)}
          </View>
        )}

        {/* Reset Button */}
        <View className="p-6">
          <TouchableOpacity
            onPress={handleReset}
            className="py-4 px-6 rounded-2xl items-center"
            style={{ backgroundColor: colors.error }}
          >
            <Text className="text-white font-semibold">Reset All Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View className="p-6 items-center">
          <Text className="text-muted text-sm">MilkDrop 3 Mobile</Text>
          <Text className="text-muted text-xs mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
