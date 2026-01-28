/**
 * Import MilkDrop presets into the app's asset bundle
 * This script processes preset files and creates a preset catalog
 */

import * as fs from 'fs';
import * as path from 'path';

interface PresetMetadata {
  id: string;
  name: string;
  author: string;
  category: string;
  type: 'milk' | 'milk2';
  filePath: string;
  size: number;
}

const PRESET_SOURCE_DIR = '/home/ubuntu/milkdrop3_presets/presets-cream-of-the-crop-master';
const PRESET_OUTPUT_DIR = path.join(__dirname, '../assets/presets');
const CATALOG_OUTPUT = path.join(__dirname, '../assets/preset-catalog.json');

// Category mapping from directory names
const CATEGORY_MAP: Record<string, string> = {
  '! Transition': 'transition',
  'Dancer': 'dancer',
  'Drawing': 'drawing',
  'Fractal': 'fractal',
  'Geometric': 'geometric',
  'Hypnotic': 'hypnotic',
  'Particles': 'particles',
  'Reaction': 'reaction',
  'Sparkle': 'sparkle',
  'Supernova': 'supernova',
  'Waveform': 'waveform',
};

function extractAuthorFromFilename(filename: string): string {
  // Common patterns: "Author - Title.milk" or "author_title.milk"
  const match = filename.match(/^([^-_]+)[\s-_]/);
  if (match) {
    return match[1].trim();
  }
  return 'Unknown';
}

function extractTitleFromFilename(filename: string): string {
  // Remove author prefix and extension
  let title = filename.replace(/\.(milk|milk2)$/, '');
  
  // Remove author prefix if present
  const dashIndex = title.indexOf(' - ');
  if (dashIndex > 0) {
    title = title.substring(dashIndex + 3);
  }
  
  return title.trim();
}

function generatePresetId(filePath: string): string {
  // Create a unique ID based on file path
  const hash = Buffer.from(filePath).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 16);
  return `preset_${hash}`;
}

function scanPresets(dir: string, category: string = ''): PresetMetadata[] {
  const presets: PresetMetadata[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subCategory = category || CATEGORY_MAP[entry.name] || entry.name.toLowerCase();
        presets.push(...scanPresets(fullPath, subCategory));
      } else if (entry.isFile() && (entry.name.endsWith('.milk') || entry.name.endsWith('.milk2'))) {
        // Process preset file
        const stats = fs.statSync(fullPath);
        const type = entry.name.endsWith('.milk2') ? 'milk2' : 'milk';
        
        const metadata: PresetMetadata = {
          id: generatePresetId(fullPath),
          name: extractTitleFromFilename(entry.name),
          author: extractAuthorFromFilename(entry.name),
          category: category || 'uncategorized',
          type,
          filePath: fullPath,
          size: stats.size,
        };
        
        presets.push(metadata);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
  
  return presets;
}

function createPresetCatalog() {
  console.log('Scanning presets...');
  const presets = scanPresets(PRESET_SOURCE_DIR);
  
  console.log(`Found ${presets.length} presets`);
  
  // Group by category
  const byCategory: Record<string, number> = {};
  presets.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  
  console.log('\nPresets by category:');
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
  
  // Create output directory
  if (!fs.existsSync(PRESET_OUTPUT_DIR)) {
    fs.mkdirSync(PRESET_OUTPUT_DIR, { recursive: true });
  }
  
  // Copy a sample of presets (to avoid bloating the app)
  // For production, we'd want to either:
  // 1. Bundle all presets (large app size)
  // 2. Download on-demand (requires server)
  // 3. Include a curated selection (best for MVP)
  
  const PRESETS_PER_CATEGORY = 10;
  const selectedPresets: PresetMetadata[] = [];
  
  Object.keys(CATEGORY_MAP).forEach(categoryDir => {
    const category = CATEGORY_MAP[categoryDir];
    const categoryPresets = presets
      .filter(p => p.category === category)
      .slice(0, PRESETS_PER_CATEGORY);
    
    selectedPresets.push(...categoryPresets);
  });
  
  console.log(`\nSelected ${selectedPresets.length} presets for bundling`);
  
  // Copy preset files to assets
  selectedPresets.forEach(preset => {
    const categoryDir = path.join(PRESET_OUTPUT_DIR, preset.category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const outputFile = path.join(categoryDir, `${preset.id}.${preset.type}`);
    fs.copyFileSync(preset.filePath, outputFile);
  });
  
  // Create catalog JSON
  const catalog = {
    version: '1.0.0',
    totalPresets: selectedPresets.length,
    categories: Object.keys(CATEGORY_MAP).map(key => CATEGORY_MAP[key]),
    presets: selectedPresets.map(p => ({
      id: p.id,
      name: p.name,
      author: p.author,
      category: p.category,
      type: p.type,
      assetPath: `presets/${p.category}/${p.id}.${p.type}`,
    })),
  };
  
  fs.writeFileSync(CATALOG_OUTPUT, JSON.stringify(catalog, null, 2));
  console.log(`\nCatalog written to: ${CATALOG_OUTPUT}`);
  console.log('Done!');
}

// Run the import
createPresetCatalog();
