import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PresetActionsSheet } from '@/components/preset-actions-sheet';
import { useColors } from '@/hooks/use-colors';
import {
  getAllPresets,
  getFavorites,
  getRecent,
  searchPresets,
  importPreset,
  initializePresetStorage,
  type MilkdropPreset,
} from '@/lib/preset-storage';
import { loadBundledPresets, getPresetCatalog } from '@/lib/preset-loader';

type PresetFilter = 'all' | 'favorites' | 'recent' | 'milk' | 'milk2';

export default function PresetsScreen() {
  const colors = useColors();
  const [presets, setPresets] = useState<MilkdropPreset[]>([]);
  const [filteredPresets, setFilteredPresets] = useState<MilkdropPreset[]>([]);
  const [filter, setFilter] = useState<PresetFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<MilkdropPreset | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await initializePresetStorage();
      await loadBundledPresets();
      await loadPresets();
    };
    initializeApp();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, presets, searchQuery]);

  const loadPresets = async () => {
    try {
      const allPresets = await getAllPresets();
      setPresets(allPresets);
    } catch (error) {
      console.error('Failed to load presets:', error);
      Alert.alert('Error', 'Failed to load presets');
    }
  };

  const applyFilter = async () => {
    let filtered: MilkdropPreset[] = [];

    if (searchQuery.trim()) {
      filtered = await searchPresets(searchQuery);
    } else {
      switch (filter) {
        case 'all':
          filtered = presets;
          break;
        case 'favorites':
          filtered = await getFavorites();
          break;
        case 'recent':
          filtered = await getRecent();
          break;
        case 'milk':
          filtered = presets.filter(p => p.type === 'milk');
          break;
        case 'milk2':
          filtered = presets.filter(p => p.type === 'milk2');
          break;
      }
    }

    setFilteredPresets(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPresets();
    setRefreshing(false);
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', '*/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const presetId = await importPreset(asset.uri, asset.name);
        
        if (presetId) {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          Alert.alert('Success', 'Preset imported successfully!');
          await loadPresets();
        } else {
          throw new Error('Import failed');
        }
      }
    } catch (error) {
      console.error('Import error:', error);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Error', 'Failed to import preset');
    }
  };

  const handlePresetPress = (preset: MilkdropPreset) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Load preset in visualizer
    Alert.alert('Load Preset', `Loading "${preset.name}"...`);
  };

  const handlePresetLongPress = (preset: MilkdropPreset) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedPreset(preset);
    setShowActions(true);
  };

  const renderPresetItem = ({ item }: { item: MilkdropPreset }) => (
    <TouchableOpacity
      onPress={() => handlePresetPress(item)}
      onLongPress={() => handlePresetLongPress(item)}
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-base font-semibold text-foreground flex-1">
              {item.name}
            </Text>
            {item.metadata.isFavorite && (
              <IconSymbol name="star.fill" size={16} color={colors.warning} />
            )}
          </View>
          <Text className="text-sm text-muted mb-1">
            by {item.author}
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: colors.background }}
            >
              <Text className="text-xs font-medium text-primary">
                {item.type.toUpperCase()}
              </Text>
            </View>
            {item.metadata.customColors && (
              <View
                className="px-2 py-1 rounded"
                style={{ backgroundColor: colors.background }}
              >
                <Text className="text-xs font-medium text-success">
                  CUSTOM
                </Text>
              </View>
            )}
          </View>
        </View>
        <IconSymbol
          name="chevron.right"
          size={20}
          color={colors.muted}
        />
      </View>
    </TouchableOpacity>
  );

  const filters: { key: PresetFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'favorites', label: 'Favorites' },
    { key: 'recent', label: 'Recent' },
    { key: 'milk', label: 'Classic' },
    { key: 'milk2', label: 'Double' },
  ];

  return (
    <ScreenContainer>
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-foreground mb-4">
            Presets
          </Text>

          {/* Search Bar */}
          <View className="flex-row items-center gap-2 mb-4">
            <View className="flex-1 flex-row items-center rounded-xl px-4 py-3"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search presets..."
                placeholderTextColor={colors.muted}
                className="flex-1 ml-2 text-foreground"
              />
            </View>
            <TouchableOpacity
              onPress={handleImport}
              className="rounded-xl p-3"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row gap-2">
            {filters.map(f => (
              <TouchableOpacity
                key={f.key}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setFilter(f.key);
                }}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: filter === f.key ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: filter === f.key ? colors.primary : colors.border,
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: filter === f.key ? '#FFFFFF' : colors.foreground,
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preset List */}
        <FlatList
          data={filteredPresets}
          renderItem={renderPresetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <IconSymbol name="folder.fill" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-4">
                {searchQuery ? 'No presets found' : 'No presets yet'}
              </Text>
              <Text className="text-muted text-center text-sm mt-2">
                {searchQuery ? 'Try a different search' : 'Import presets to get started'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Actions Sheet */}
      <PresetActionsSheet
        visible={showActions}
        onClose={() => setShowActions(false)}
        preset={selectedPreset}
        onAction={async () => {
          await loadPresets();
        }}
      />
    </ScreenContainer>
  );
}
