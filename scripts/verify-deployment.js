
/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🔍 Verifying Deployment Bundle...');

if (!fs.existsSync(distDir)) {
  console.error('❌ Dist folder missing. Run build first.');
  process.exit(1);
}

const indexHtml = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtml)) {
  console.error('❌ index.html missing in dist.');
  process.exit(1);
}

console.log('✅ Critical files present.');

// Check bundle sizes
let totalSize = 0;
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else {
      totalSize += stat.size;
    }
  });
}

scanDir(distDir);
const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
console.log(`📦 Total Bundle Size: ${sizeMB} MB`);

if (totalSize > 50 * 1024 * 1024) { // 50MB
  console.warn('⚠️  Warning: Total build size exceeds 50MB. This may cause timeout issues.');
} else {
  console.log('✅ Bundle size within acceptable limits.');
}
