/**
 * Import all MilkDrop preset collections into the app
 * Combines: Cream of the Crop, Original MilkDrop, and ProjectM Classic
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
  collection: string;
}

const PRESET_COLLECTIONS = [
  {
    name: 'cream-of-the-crop',
    path: '/home/ubuntu/milkdrop3_presets/presets-cream-of-the-crop-master',
    categories: {
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
    }
  },
  {
    name: 'milkdrop-original',
    path: '/home/ubuntu/milkdrop3_presets/presets-milkdrop-original-master/Milkdrop-Original',
    categories: {} as Record<string, string>
  },
  {
    name: 'projectm-classic',
    path: '/home/ubuntu/milkdrop3_presets/presets-projectm-classic-master',
    categories: {} as Record<string, string>
  }
];

const PRESET_OUTPUT_DIR = path.join(__dirname, '../assets/presets');
const CATALOG_OUTPUT = path.join(__dirname, '../assets/preset-catalog.json');

function extractAuthorFromFilename(filename: string): string {
  const match = filename.match(/^([^-_]+)[\s-_]/);
  if (match) {
    return match[1].trim();
  }
  return 'Unknown';
}

function extractTitleFromFilename(filename: string): string {
  let title = filename.replace(/\.(milk|milk2)$/, '');
  const dashIndex = title.indexOf(' - ');
  if (dashIndex > 0) {
    title = title.substring(dashIndex + 3);
  }
  return title.trim();
}

function generatePresetId(filePath: string, collection: string): string {
  const hash = Buffer.from(filePath + collection).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 16);
  return `preset_${hash}`;
}

function inferCategory(filePath: string, categoryMap: Record<string, string>): string {
  // Check if path contains any known category
  for (const [dirName, category] of Object.entries(categoryMap)) {
    if (filePath.includes(dirName)) {
      return category;
    }
  }
  
  // Try to infer from path structure
  const parts = filePath.split(path.sep);
  if (parts.length > 2) {
    const potentialCategory = parts[parts.length - 2].toLowerCase();
    return potentialCategory;
  }
  
  return 'general';
}

function scanPresets(dir: string, collection: string, categoryMap: Record<string, string> = {}): PresetMetadata[] {
  const presets: PresetMetadata[] = [];
  
  function scan(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          scan(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.milk') || entry.name.endsWith('.milk2'))) {
          const stats = fs.statSync(fullPath);
          const type = entry.name.endsWith('.milk2') ? 'milk2' : 'milk';
          
          const metadata: PresetMetadata = {
            id: generatePresetId(fullPath, collection),
            name: extractTitleFromFilename(entry.name),
            author: extractAuthorFromFilename(entry.name),
            category: inferCategory(fullPath, categoryMap),
            type,
            filePath: fullPath,
            size: stats.size,
            collection,
          };
          
          presets.push(metadata);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentDir}:`, error);
    }
  }
  
  scan(dir);
  return presets;
}

function createComprehensiveCatalog() {
  console.log('Scanning all preset collections...\n');
  
  const allPresets: PresetMetadata[] = [];
  
  for (const collection of PRESET_COLLECTIONS) {
    if (!fs.existsSync(collection.path)) {
      console.log(`⚠️  Collection ${collection.name} not found at ${collection.path}`);
      continue;
    }
    
    console.log(`📁 Scanning ${collection.name}...`);
    const presets = scanPresets(collection.path, collection.name, collection.categories);
    console.log(`   Found ${presets.length} presets`);
    allPresets.push(...presets);
  }
  
  console.log(`\n✅ Total presets found: ${allPresets.length}`);
  
  // Statistics
  const byCollection: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byAuthor: Record<string, number> = {};
  
  allPresets.forEach(p => {
    byCollection[p.collection] = (byCollection[p.collection] || 0) + 1;
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    byAuthor[p.author] = (byAuthor[p.author] || 0) + 1;
  });
  
  console.log('\n📊 Presets by collection:');
  Object.entries(byCollection).forEach(([col, count]) => {
    console.log(`   ${col}: ${count}`);
  });
  
  console.log('\n📊 Top 10 categories:');
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
  
  console.log('\n📊 Top 10 authors:');
  Object.entries(byAuthor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([author, count]) => {
      console.log(`   ${author}: ${count}`);
    });
  
  // Create output directory
  if (!fs.existsSync(PRESET_OUTPUT_DIR)) {
    fs.mkdirSync(PRESET_OUTPUT_DIR, { recursive: true });
  }
  
  // Select a curated subset for bundling
  // Strategy: Take top presets from each category across all collections
  const PRESETS_PER_CATEGORY = 15;
  const selectedPresets: PresetMetadata[] = [];
  
  const categories = [...new Set(allPresets.map(p => p.category))];
  
  categories.forEach(category => {
    const categoryPresets = allPresets
      .filter(p => p.category === category)
      .sort((a, b) => a.size - b.size) // Prefer smaller files
      .slice(0, PRESETS_PER_CATEGORY);
    
    selectedPresets.push(...categoryPresets);
  });
  
  console.log(`\n📦 Selected ${selectedPresets.length} presets for bundling`);
  
  // Copy preset files to assets
  console.log('\n📋 Copying preset files...');
  let copiedCount = 0;
  
  selectedPresets.forEach(preset => {
    const categoryDir = path.join(PRESET_OUTPUT_DIR, preset.category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const outputFile = path.join(categoryDir, `${preset.id}.${preset.type}`);
    try {
      fs.copyFileSync(preset.filePath, outputFile);
      copiedCount++;
    } catch (error) {
      console.error(`   Failed to copy ${preset.name}: ${error}`);
    }
  });
  
  console.log(`   Copied ${copiedCount} files`);
  
  // Create catalog JSON
  const catalog = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    totalPresets: selectedPresets.length,
    collections: PRESET_COLLECTIONS.map(c => c.name),
    categories: categories.sort(),
    presets: selectedPresets.map(p => ({
      id: p.id,
      name: p.name,
      author: p.author,
      category: p.category,
      type: p.type,
      collection: p.collection,
      assetPath: `presets/${p.category}/${p.id}.${p.type}`,
    })),
  };
  
  fs.writeFileSync(CATALOG_OUTPUT, JSON.stringify(catalog, null, 2));
  console.log(`\n✅ Catalog written to: ${CATALOG_OUTPUT}`);
  console.log('✅ Done!\n');
}

// Run the import
createComprehensiveCatalog();
