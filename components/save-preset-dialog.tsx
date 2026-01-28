import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';
import { savePreset, duplicatePreset, type MilkdropPreset } from '@/lib/preset-storage';

interface SavePresetDialogProps {
  visible: boolean;
  onClose: () => void;
  currentPreset?: MilkdropPreset;
  presetContent: string;
  mode: 'save' | 'saveAs';
  onSaved?: (presetId: string) => void;
}

export function SavePresetDialog({
  visible,
  onClose,
  currentPreset,
  presetContent,
  mode,
  onSaved,
}: SavePresetDialogProps) {
  const colors = useColors();
  const [name, setName] = useState(currentPreset?.name || 'My Preset');
  const [author, setAuthor] = useState(currentPreset?.author || 'User');
  const [tags, setTags] = useState(currentPreset?.metadata.tags.join(', ') || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a preset name');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setSaving(true);

    try {
      let presetId: string | null = null;

      if (mode === 'save' && currentPreset) {
        // Update existing preset
        const updatedPreset: MilkdropPreset = {
          ...currentPreset,
          name: name.trim(),
          author: author.trim(),
          content: presetContent,
          metadata: {
            ...currentPreset.metadata,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            customColors: true,
          },
        };
        const success = await savePreset(updatedPreset);
        presetId = success ? updatedPreset.id : null;
      } else {
        // Save as new preset (duplicate)
        if (currentPreset) {
          presetId = await duplicatePreset(currentPreset.id, name.trim());
        } else {
          // Create brand new preset
          const newPreset: MilkdropPreset = {
            id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim(),
            author: author.trim(),
            type: 'milk',
            content: presetContent,
            metadata: {
              createdAt: new Date().toISOString(),
              modifiedAt: new Date().toISOString(),
              isFavorite: false,
              tags: tags.split(',').map(t => t.trim()).filter(Boolean),
              version: 1,
              customColors: true,
            },
          };
          const success = await savePreset(newPreset);
          presetId = success ? newPreset.id : null;
        }
      }

      if (presetId) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Alert.alert('Success', 'Preset saved successfully!');
        onSaved?.(presetId);
        onClose();
      } else {
        throw new Error('Failed to save preset');
      }
    } catch (error) {
      console.error('Save preset error:', error);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Error', 'Failed to save preset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="w-11/12 max-w-md rounded-2xl p-6"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl font-bold text-foreground mb-6">
              {mode === 'save' ? 'Save Preset' : 'Save As New Preset'}
            </Text>

            <View className="gap-4">
              {/* Preset Name */}
              <View>
                <Text className="text-sm font-semibold text-muted mb-2">
                  Preset Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter preset name"
                  placeholderTextColor={colors.muted}
                  className="rounded-lg px-4 py-3 text-foreground"
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  maxLength={50}
                />
              </View>

              {/* Author */}
              <View>
                <Text className="text-sm font-semibold text-muted mb-2">
                  Author
                </Text>
                <TextInput
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Your name"
                  placeholderTextColor={colors.muted}
                  className="rounded-lg px-4 py-3 text-foreground"
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  maxLength={30}
                />
              </View>

              {/* Tags */}
              <View>
                <Text className="text-sm font-semibold text-muted mb-2">
                  Tags (comma separated)
                </Text>
                <TextInput
                  value={tags}
                  onChangeText={setTags}
                  placeholder="custom, favorite, experimental"
                  placeholderTextColor={colors.muted}
                  className="rounded-lg px-4 py-3 text-foreground"
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  maxLength={100}
                />
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 rounded-full py-3 items-center"
                style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className="flex-1 rounded-full py-3 items-center"
                style={{
                  backgroundColor: saving ? colors.muted : colors.primary,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Text className="text-white font-semibold">
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
