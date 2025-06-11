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
    // Remove invalid dynamic imports
    .replace(/^import\s+\.\.\.nextauth\s+from\s+['"][^'"]+['"];?\n?/gm, "")
    .replace(/^import\s+id\s+from\s+['"][^'"]+['"];?\n?/gm, "")
    // Fix .service imports to CamelCaseService
    .replace(/import\s+([a-zA-Z0-9_]+)\.service\s+from/g, (_, name) => {
      return `import ${name}Service from`;
    })
    // Remove exact duplicate import lines
    .replace(
      /^(import\s+.*from\s+['"][^'"]+['"];)(?:\s*\1)+/gm,
      (_, line) => line
    );
}

async function processFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.warn("❌ Can't read:", filePath);
    return;
  }

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
