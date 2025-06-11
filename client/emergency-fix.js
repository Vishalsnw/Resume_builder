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

walk(srcDir, (filePath) => {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.warn("❌ Can't read:", filePath);
    return;
  }

  if (!content.includes("import") && !content.includes("React")) {
    brokenFiles.push(filePath);
    console.warn("❌ Possibly broken file:", filePath);
    return;
  }

  try {
    // Use resolveConfig.sync to get .prettierrc config properly
    const options = prettier.resolveConfig.sync(filePath) || {};
    options.parser = "typescript";

    const formatted = prettier.format(content, options);
    fs.writeFileSync(filePath, formatted);
    console.log("✅ Fixed:", filePath);
  } catch (err) {
    console.error("❌ Prettier failed for:", filePath);
    console.error(err.message || err);
  }
});

if (brokenFiles.length) {
  console.log("\n🚨 Broken files (skipped):");
  console.log(brokenFiles.join("\n"));
}

// Git auto-commit
try {
  const userName = execSync("git config user.name").toString().trim();
  const userEmail = execSync("git config user.email").toString().trim();

  if (!userName || !userEmail) {
    console.warn("❗ Git identity not set. Run this:");
    console.warn('   git config --global user.name "Your Name"');
    console.warn('   git config --global user.email "you@example.com"');
  }

  execSync("git add . && git commit -m 'auto: fix broken TSX files' && git push", {
    stdio: "inherit",
  });
} catch (e) {
  console.warn("❗ Git commit failed — maybe no changes, repo not clean, or identity missing.");
}
