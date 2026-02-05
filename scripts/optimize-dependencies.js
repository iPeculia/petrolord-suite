import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const HEAVY_DEPENDENCIES = {
  'moment': 'Use date-fns or dayjs for smaller bundle size',
  'lodash': 'Use lodash-es or native Array methods',
  'three': 'Ensure only needed modules are imported or use @react-three/drei',
  'echarts': 'Use cleaner imports or check if smaller charting lib works',
  'xlsx': 'Heavy library. Consider loading dynamically',
};

function findLargeDependencies() {
  console.log('📦 analyzing dependencies...');
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const issues = [];

  Object.keys(deps).forEach(dep => {
    if (HEAVY_DEPENDENCIES[dep]) {
      issues.push({
        package: dep,
        suggestion: HEAVY_DEPENDENCIES[dep]
      });
    }
  });

  return issues;
}

function findUnusedDependencies() {
  // Naive check - normally requires AST parsing or 'depcheck' package
  console.log('🔍 Checking for potentially unused dependencies...');
  console.log('   (Note: Run "npx depcheck" for accurate analysis)');
  return [];
}

function suggestAlternatives(issues) {
  if (issues.length === 0) {
    console.log('✅ No major heavy dependencies flagged.');
    return;
  }

  console.log('\n⚠️  Optimization Suggestions:');
  issues.forEach(issue => {
    console.log(`   - ${issue.package}: ${issue.suggestion}`);
  });
}

// Run
const largeDeps = findLargeDependencies();
suggestAlternatives(largeDeps);

console.log('\n✅ Dependency analysis complete.');