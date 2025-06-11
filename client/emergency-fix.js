const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const { execSync } = require("child_process");

const srcDir = path.join(__dirname, "src");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      callback(fullPath);
    }
  });
}

const brokenFiles = [];

function fixImports(content) {
  return content
    // Fix [...nextauth] imports
    .replace(/import\s+\.\.\.nextauth\s+from/g, `import nextauthHandler from`)
    // Fix [id] imports
    .replace(/import\s+id\s+from/g, `import EditComponent from`)
    // Fix `xyz.service` to `xyzService`
    .replace(/import\s+([a-zA-Z0-9_]+)\.service\s+from/g, (match, p1) => {
      return `import ${p1}Service from`;
    })
    // Remove duplicate imports
    .replace(/(import\s+[^\n]+from\s+['"][^'"]+['"];)[\r\n]+\1/g, '$1');
}

async function processFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.warn("❌ Can't read:", filePath);
    return;
  }

  // Step 1: Fix broken imports
  const fixedContent = fixImports(content);

  try {
    const options = (await prettier.resolveConfig(filePath)) || {};
    const formatted = await prettier.format(fixedContent, {
      ...options,
      parser: "typescript",
    });

    fs.writeFileSync(filePath, formatted);
    console.log("✅ Fixed & formatted:", filePath);
  } catch (err) {
    brokenFiles.push(filePath);
    console.error("❌ Prettier failed for:", filePath, "\n", err.message);
  }
}

(async () => {
  const promises = [];

  walk(srcDir, (filePath) => {
    promises.push(processFile(filePath));
  });

  await Promise.all(promises);

  if (brokenFiles.length) {
    console.log("\n🚨 Broken files (still failed):");
    console.log(brokenFiles.join("\n"));
  }

  try {
    execSync("git add . && git commit -m 'auto: import + prettier fix' && git push", {
      stdio: "inherit",
    });
  } catch (e) {
    console.warn("❗ Git commit failed — maybe no changes or repo not clean.");
  }
})();
