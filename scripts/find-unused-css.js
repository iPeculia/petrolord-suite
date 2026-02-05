import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

console.log('🎨 Scanning for Unused CSS...');

// Helper to recursively find files
function getFiles(dir, ext) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(getFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      files.push(filePath);
    }
  });
  return files;
}

const cssFiles = getFiles(srcDir, '.css');
const jsxFiles = getFiles(srcDir, '.jsx');
const jsFiles = getFiles(srcDir, '.js');

console.log(`Found ${cssFiles.length} CSS files and ${jsxFiles.length + jsFiles.length} JS/JSX files.`);

// This is a simplified heuristic scanner
// Real CSS pruning requires complex AST parsing (PurgeCSS)
// This script identifies potential custom CSS classes defined but not used in JS files
let unusedClasses = 0;

cssFiles.forEach(cssFile => {
  const cssContent = fs.readFileSync(cssFile, 'utf8');
  // Naive regex to find class definitions like .className {
  const classMatches = cssContent.match(/\.([a-zA-Z0-9_-]+)\s*\{/g);
  
  if (classMatches) {
    classMatches.forEach(match => {
      const className = match.replace('.', '').replace(/\s*\{/, '').trim();
      let isUsed = false;
      
      // Check if this class exists in any JS/JSX file
      for (const file of [...jsxFiles, ...jsFiles]) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(className)) {
          isUsed = true;
          break;
        }
      }
      
      if (!isUsed) {
        // console.log(`⚠️  Potentially unused class: .${className} in ${path.basename(cssFile)}`);
        unusedClasses++;
      }
    });
  }
});

console.log(`\n📊 Analysis complete.`);
console.log(`   To optimize CSS, the build process is configured to use Tailwind's built-in purging.`);
console.log(`   Ensure "content" in tailwind.config.js covers all src files.`);