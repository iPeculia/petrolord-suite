import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('📦 Starting Dependency Audit...');

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  const allDeps = { ...dependencies, ...devDependencies };
  const depCount = Object.keys(allDeps).length;
  
  console.log(`Found ${depCount} total dependencies.`);

  // Known heavy dependencies in web development
  const HEAVY_PACKAGES = [
    'lodash',
    'moment',
    'plotly.js',
    'three',
    'xlsx',
    'pdf-lib',
    'jspdf',
    'echarts',
    'leaflet'
  ];

  console.log('\n⚖️  Checking for heavy packages...');
  const foundHeavy = [];
  Object.keys(allDeps).forEach(dep => {
    if (HEAVY_PACKAGES.some(heavy => dep.includes(heavy))) {
      foundHeavy.push(dep);
    }
  });

  if (foundHeavy.length > 0) {
    console.log('⚠️  Heavy packages found (consider lazy loading these):');
    foundHeavy.forEach(p => console.log(`   - ${p}`));
  } else {
    console.log('✅ No notoriously heavy packages found in the top-level list.');
  }

  // Check for duplicates/redundancies
  console.log('\n🔍 Checking for potential redundancies...');
  if (allDeps['moment'] && allDeps['date-fns']) {
    console.warn('⚠️  Both moment and date-fns detected. Consider consolidating to date-fns.');
  }
  if (allDeps['lodash'] && allDeps['underscore']) {
    console.warn('⚠️  Both lodash and underscore detected. Use one.');
  }

  console.log('\n✅ Audit complete. Optimization recommendation: Use "vite.config.ultra-light.js" for aggressive code splitting of these dependencies.');

} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}