import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('📉 Starting Build Size Reduction Analysis...');

function findLargeFiles(dir, minSize = 500 * 1024) { // 500KB
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        results = results.concat(findLargeFiles(filePath, minSize));
      }
    } else {
      if (stat.size > minSize) {
        results.push({
          path: filePath.replace(rootDir, ''),
          size: (stat.size / 1024 / 1024).toFixed(2) + ' MB'
        });
      }
    }
  });
  return results;
}

function optimizeDependencies() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  console.log('\n📦 Dependency Check:');
  const heavyDeps = ['moment', 'lodash', 'xlsx'];
  
  heavyDeps.forEach(dep => {
    if (pkg.dependencies[dep] || pkg.devDependencies[dep]) {
      console.warn(`⚠️  Found heavy dependency: ${dep}. Consider replacements.`);
    }
  });
}

// Execute
try {
  const largeFiles = findLargeFiles(path.join(rootDir, 'src'));
  
  console.log('\n📂 Large Source Files (>500KB):');
  if (largeFiles.length === 0) console.log('   None found. Good job!');
  else largeFiles.forEach(f => console.log(`   ${f.path}: ${f.size}`));

  optimizeDependencies();
  
  console.log('\n✅ Reduction analysis complete. Run "npm run build:fast" to build with optimization.');
  
} catch (e) {
  console.error('Error during analysis:', e);
}