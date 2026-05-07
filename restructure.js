const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const moves = [
  // from -> to
  ['components/features/CategoryChips.tsx', 'features/map/components/CategoryChips.tsx'],
  ['components/features/LocationCard.tsx', 'features/map/components/LocationCard.tsx'],
  ['components/features/QrScanner.tsx', 'features/stamps/components/QrScanner.tsx'],
  ['components/features/StampBadge.tsx', 'features/stamps/components/StampBadge.tsx'],
  ['components/features/VoucherCard.tsx', 'features/stamps/components/VoucherCard.tsx'],
  ['components/map/MapMarker.tsx', 'features/map/components/MapMarker.tsx'],
  ['components/map/MapView.tsx', 'features/map/components/MapView.tsx'],
  ['store/passport.store.ts', 'features/passport/store.ts'],
];

const importReplacements = [
  ['@/components/features/CategoryChips', '@/features/map/components/CategoryChips'],
  ['@/components/features/LocationCard', '@/features/map/components/LocationCard'],
  ['@/components/features/QrScanner', '@/features/stamps/components/QrScanner'],
  ['@/components/features/StampBadge', '@/features/stamps/components/StampBadge'],
  ['@/components/features/VoucherCard', '@/features/stamps/components/VoucherCard'],
  ['@/components/map/MapMarker', '@/features/map/components/MapMarker'],
  ['@/components/map/MapView', '@/features/map/components/MapView'],
  ['@/store/passport.store', '@/features/passport/store']
];

// 1. Move files
console.log('--- Moving files ---');
moves.forEach(([from, to]) => {
  const fromPath = path.join(srcDir, from);
  const toPath = path.join(srcDir, to);
  
  if (fs.existsSync(fromPath)) {
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.renameSync(fromPath, toPath);
    console.log(`Moved: ${from} -> ${to}`);
  } else {
    console.warn(`File not found: ${from}`);
  }
});

// 2. Cleanup empty directories
['components/features', 'components/map'].forEach(dir => {
  const dirPath = path.join(srcDir, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) {
      fs.rmdirSync(dirPath);
      console.log(`Deleted empty dir: ${dir}`);
    } else {
      console.warn(`Dir not empty, skipping delete: ${dir} (${files.join(', ')})`);
    }
  }
});

// 3. Update imports in all files
console.log('\n--- Updating imports ---');
function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walk(filepath, callback);
    } else if (stats.isFile() && (filepath.endsWith('.ts') || filepath.endsWith('.tsx'))) {
      callback(filepath);
    }
  });
}

walk(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf-8');
  let changed = false;

  importReplacements.forEach(([oldImport, newImport]) => {
    // Escape for regex if needed, but since paths have no special chars other than @ and /, standard replaceAll works
    // Use regex to catch both single and double quotes
    const regex1 = new RegExp(`['"]${oldImport}['"]`, 'g');
    if (regex1.test(content)) {
      content = content.replace(regex1, `"${newImport}"`);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`Updated imports in: ${path.relative(srcDir, filepath)}`);
  }
});

console.log('\nDone!');
