import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { SavePresetDialog } from "@/components/save-preset-dialog";
import { MilkdropVisualizer } from "@/components/milkdrop-visualizer";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { loadSettings, type MilkdropSettings, DEFAULT_SETTINGS } from "@/lib/settings-storage";
import { getAllPresets, type MilkdropPreset } from "@/lib/preset-storage";

export default function VisualizerScreen() {
  const colors = useColors();
  const router = useRouter();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [settings, setSettings] = useState<MilkdropSettings>(DEFAULT_SETTINGS);
  const [presets, setPresets] = useState<MilkdropPreset[]>([]);
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);

  useEffect(() => {
    loadSettingsData();
    loadPresetsData();
  }, []);

  const loadSettingsData = async () => {
    const loaded = await loadSettings();
    setSettings(loaded);
  };

  const loadPresetsData = async () => {
    const loaded = await getAllPresets();
    setPresets(loaded);
  };

  const handleSavePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowSaveDialog(true);
  };

  const handleRandomizeColors = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Randomize wave colors
    const newSettings = {
      ...settings,
      wave_r: Math.random(),
      wave_g: Math.random(),
      wave_b: Math.random(),
    };
    setSettings(newSettings);
    Alert.alert('Colors Randomized', 'New color scheme applied!');
  };

  const handleNextPreset = () => {
    if (presets.length === 0) return;
    const nextIndex = (currentPresetIndex + 1) % presets.length;
    setCurrentPresetIndex(nextIndex);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePrevPreset = () => {
    if (presets.length === 0) return;
    const prevIndex = currentPresetIndex === 0 ? presets.length - 1 : currentPresetIndex - 1;
    setCurrentPresetIndex(prevIndex);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleToggleUI = () => {
    setOverlayVisible(!overlayVisible);
  };

  const currentPreset = presets[currentPresetIndex];

  return (
    <ScreenContainer>
      {/* WebGL Visualization */}
      <MilkdropVisualizer
        settings={settings}
        onSwipeLeft={handleNextPreset}
        onSwipeRight={handlePrevPreset}
        onTap={handleToggleUI}
        className="flex-1"
      />

      {/* Overlay Controls */}
      {overlayVisible && (
        <View className="absolute inset-0 pointer-events-none">
          {/* Top Overlay - Preset Name */}
          <View className="pt-16 px-6 pointer-events-none">
            <View className="rounded-2xl px-6 py-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <Text className="text-white text-center font-semibold">
                {currentPreset?.name || 'No Preset'}
              </Text>
              <Text className="text-gray-400 text-center text-sm">
                by {currentPreset?.author || 'Unknown'}
              </Text>
            </View>
          </View>

          {/* Bottom Controls */}
          <View className="absolute bottom-0 left-0 right-0 pb-24 px-6 pointer-events-auto">
            <View className="rounded-3xl p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
              <View className="flex-row items-center justify-around">
                <TouchableOpacity
                  onPress={handleRandomizeColors}
                  className="items-center p-3"
                >
                  <IconSymbol name="chevron.left.forwardslash.chevron.right" size={28} color="#FFFFFF" />
                  <Text className="text-white text-xs mt-1">Colors</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSavePress}
                  className="items-center p-3"
                >
                  <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    <IconSymbol name="plus" size={32} color="#FFFFFF" />
                  </View>
                  <Text className="text-white text-xs mt-1 font-semibold">Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/settings')}
                  className="items-center p-3"
                >
                  <IconSymbol name="gear" size={28} color="#FFFFFF" />
                  <Text className="text-white text-xs mt-1">Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Save Preset Dialog */}
      <SavePresetDialog
        visible={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        presetContent="// Demo preset content"
        mode="saveAs"
        onSaved={(presetId) => {
          Alert.alert('Success', `Preset saved with ID: ${presetId}`);
        }}
      />
    </ScreenContainer>
  );
}
