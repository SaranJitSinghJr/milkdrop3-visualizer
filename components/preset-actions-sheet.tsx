import { View, Text, Modal, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import {
  sharePreset,
  exportPreset,
  deletePreset,
  duplicatePreset,
  addFavorite,
  removeFavorite,
  type MilkdropPreset,
} from '@/lib/preset-storage';

interface PresetActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  preset: MilkdropPreset | null;
  onAction?: (action: string) => void;
}

interface ActionItem {
  icon: string;
  label: string;
  action: string;
  color?: string;
  destructive?: boolean;
}

export function PresetActionsSheet({
  visible,
  onClose,
  preset,
  onAction,
}: PresetActionsSheetProps) {
  const colors = useColors();

  if (!preset) return null;

  const handleAction = async (action: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      switch (action) {
        case 'favorite':
          if (preset.metadata.isFavorite) {
            await removeFavorite(preset.id);
            Alert.alert('Success', 'Removed from favorites');
          } else {
            await addFavorite(preset.id);
            Alert.alert('Success', 'Added to favorites');
          }
          break;

        case 'duplicate':
          const newId = await duplicatePreset(preset.id);
          if (newId) {
            Alert.alert('Success', 'Preset duplicated successfully');
          } else {
            throw new Error('Failed to duplicate');
          }
          break;

        case 'share':
          const shared = await sharePreset(preset.id);
          if (!shared) {
            throw new Error('Failed to share');
          }
          break;

        case 'export':
          const exportPath = await exportPreset(preset.id);
          if (exportPath) {
            Alert.alert('Success', `Preset exported to:\n${exportPath}`);
          } else {
            throw new Error('Failed to export');
          }
          break;

        case 'delete':
          Alert.alert(
            'Delete Preset',
            `Are you sure you want to delete "${preset.name}"? This cannot be undone.`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  const deleted = await deletePreset(preset.id);
                  if (deleted) {
                    if (Platform.OS !== 'web') {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                    Alert.alert('Success', 'Preset deleted');
                  } else {
                    throw new Error('Failed to delete');
                  }
                },
              },
            ]
          );
          break;
      }

      onAction?.(action);
      onClose();
    } catch (error) {
      console.error(`Action ${action} failed:`, error);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Error', `Failed to ${action} preset. Please try again.`);
    }
  };

  const actions: ActionItem[] = [
    {
      icon: preset.metadata.isFavorite ? 'star.fill' : 'star',
      label: preset.metadata.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      action: 'favorite',
      color: colors.warning,
    },
    {
      icon: 'square.on.square',
      label: 'Duplicate',
      action: 'duplicate',
    },
    {
      icon: 'square.and.arrow.up',
      label: 'Share',
      action: 'share',
    },
    {
      icon: 'arrow.down.doc',
      label: 'Export to Files',
      action: 'export',
    },
    {
      icon: 'trash',
      label: 'Delete',
      action: 'delete',
      color: colors.error,
      destructive: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="rounded-t-3xl pt-4 pb-8"
          style={{ backgroundColor: colors.surface }}
        >
          {/* Handle Bar */}
          <View className="items-center mb-4">
            <View
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
          </View>

          {/* Preset Info */}
          <View className="px-6 mb-4">
            <Text className="text-xl font-bold text-foreground mb-1">
              {preset.name}
            </Text>
            <Text className="text-sm text-muted">
              by {preset.author} • {preset.type.toUpperCase()}
            </Text>
          </View>

          {/* Actions */}
          <View className="px-4">
            {actions.map((item, index) => (
              <TouchableOpacity
                key={item.action}
                onPress={() => handleAction(item.action)}
                className="flex-row items-center px-4 py-4 rounded-xl mb-2"
                style={{
                  backgroundColor: colors.background,
                }}
              >
                <IconSymbol
                  name={item.icon as any}
                  size={24}
                  color={item.color || colors.foreground}
                />
                <Text
                  className="ml-4 text-base font-medium"
                  style={{
                    color: item.color || colors.foreground,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <View className="px-6 mt-2">
            <TouchableOpacity
              onPress={onClose}
              className="rounded-full py-4 items-center"
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text className="text-foreground font-semibold text-base">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
