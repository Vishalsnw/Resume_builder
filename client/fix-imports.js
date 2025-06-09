// fix-imports.js
const fs = require('fs');
const path = require('path');

// Function to fix invalid imports in a file
function fixFileImports(filePath) {
  console.log(`Checking ${filePath}...`);
  
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Original content length for comparison
    const originalLength = content.length;
    
    // Fix imports with hyphens, numbers, square brackets, etc.
    content = content.replace(/^import\s+([0-9]+|.*?[\-\[\].].*?)\s+from\s+['"].*?['"]\s*;?\s*$/gm, '// REMOVED INVALID IMPORT');
    
    // Fix import with special characters that starts with @
    content = content.replace(/^import\s+(.*?)(\s+from\s+['"]@\/.*?['"]\s*;?\s*)$/gm, (match, importName) => {
      // If import name contains invalid characters
      if (/^[0-9]|[\-\[\].]/.test(importName)) {
        return '// REMOVED INVALID IMPORT';
      }
      return match;
    });
    
    // If content changed, save the file
    if (content.length !== originalLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    return false;
  }
}

// Function to recursively traverse directories
function processDirectory(dir) {
  let fixedCount = 0;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      fixedCount += processDirectory(filePath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      if (fixFileImports(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Start processing from src directory
const srcDir = path.join(__dirname, 'src');
const fixedCount = processDirectory(srcDir);

console.log(`\nFixed imports in ${fixedCount} files.`);
