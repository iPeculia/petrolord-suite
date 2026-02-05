import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');

console.log('🖼️  Simulating Asset Optimization...');

function findAssets(dir) {
  let assets = [];
  if (!fs.existsSync(dir)) return assets;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      assets = assets.concat(findAssets(filePath));
    } else if (/\.(png|jpg|jpeg|gif|svg)$/i.test(file)) {
      assets.push({ path: filePath, size: stat.size });
    }
  });
  return assets;
}

const publicAssets = findAssets(publicDir);
const srcAssets = findAssets(srcDir);
const allAssets = [...publicAssets, ...srcAssets];

let savings = 0;
allAssets.forEach(asset => {
  if (asset.size > 500 * 1024) { // 500KB
    console.log(`⚠️  Large asset found: ${path.relative(rootDir, asset.path)} (${(asset.size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`   -> Recommendation: Convert to WebP or compress`);
    savings += asset.size * 0.6; // Estimate 60% savings
  }
});

if (savings > 0) {
  console.log(`\n📉 Potential savings: ${(savings / 1024 / 1024).toFixed(2)} MB`);
} else {
  console.log('\n✅ No critically large assets found.');
}