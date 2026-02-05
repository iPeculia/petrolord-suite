
/* eslint-env node */
/**
 * Verification Script for EarthModel Pro Phase 4
 * 
 * Checks if key files and configurations are in place.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_FILES = [
    'src/components/earthmodel/ml/MLHub.jsx',
    'src/components/earthmodel/ml/FaciesPrediction.jsx',
    'src/components/earthmodel/ml/WellPlacementOptimizationML.jsx',
    'src/services/ml/mlService.js',
    'src/services/ml/optimizationService.js',
    'docs/EARTHMODEL_PHASE4_COMPLETE_SUMMARY.md',
    'docs/EARTHMODEL_ML_USER_GUIDE.md'
];

console.log('🔍 Verifying EarthModel Pro Phase 4 Installation...\n');

let missing = 0;

REQUIRED_FILES.forEach(file => {
    const fullPath = path.join(path.resolve(__dirname, '..'), file);
    if (fs.existsSync(fullPath)) {
        console.log(`✅ Found: ${file}`);
    } else {
        console.log(`❌ Missing: ${file}`);
        missing++;
    }
});

console.log('\n----------------------------------------');
if (missing === 0) {
    console.log('🎉 Verification PASSED. All Phase 4 components are present.');
} else {
    console.log(`⚠️ Verification FAILED. ${missing} file(s) are missing.`);
    process.exit(1);
}
