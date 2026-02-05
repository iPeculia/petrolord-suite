import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SRC_DIR = path.join(rootDir, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

function scanForWarnings() {
  console.log('🔍 Scanning for JSX syntax warnings (unescaped ">")...');
  const files = getAllFiles(SRC_DIR);
  let issueCount = 0;

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Simple heuristic: > not inside a tag definition and not an arrow function
      // This is a loose check to help identify potential issues
      if (line.includes('>') && !line.includes('/>') && !line.includes('</') && !line.includes('=>')) {
        // Check if it looks like text content
        // Ignore imports, comments
        if (!line.trim().startsWith('import') && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
           // Check for specific patterns mentioned in prompt
           if (line.match(/>\s*\d+%/) || line.match(/\w+\s*>\s*\w+/)) {
              console.log(`⚠️  Potential issue in ${path.relative(rootDir, file)}:${index + 1}`);
              console.log(`   Line: ${line.trim()}`);
              issueCount++;
           }
        }
      }
    });
  });

  if (issueCount === 0) {
    console.log('✅ No obvious JSX text warnings found in scanned files.');
  } else {
    console.log(`\nFound ${issueCount} potential issues.`);
  }
}

scanForWarnings();