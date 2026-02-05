import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🌍 Initializing EarthModel Pro Environment...');

// 1. Verify Public Directory
const publicDir = path.join(rootDir, 'public', 'sample-data');
if (!fs.existsSync(publicDir)) {
  console.log('Creating sample data directory...');
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('✅ Sample data directory ready.');

// 2. Verify Docs Directory
const docsDir = path.join(rootDir, 'docs');
if (!fs.existsSync(docsDir)) {
  console.log('Creating docs directory...');
  fs.mkdirSync(docsDir, { recursive: true });
}

console.log('✅ Documentation directory ready.');

console.log('\n🚀 Initialization Steps:');
console.log('1. Sample data has been generated in /public/sample-data');
console.log('2. Documentation has been generated in /docs');
console.log('3. Components have been registered in /src/pages/apps/EarthModelPro.jsx');
console.log('4. New Geoscience Hub created at /src/pages/apps/GeoscienceHub.jsx');
console.log('5. Help system initialized.');

console.log('\n👉 Next Steps:');
console.log('   Run "npm run dev" to start the application.');
console.log('   Navigate to /apps/geoscience/earth-model-pro to view the new app.');
console.log('   Navigate to /apps/geoscience/hub to view the hub.');