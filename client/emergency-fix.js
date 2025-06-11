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
    content = fs.readFileSync(filePath, "utf8"); // Make sure this is sync
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
    const formatted = prettier.format(content, {
      parser: "typescript",
    });

    fs.writeFileSync(filePath, formatted); // Sync write
    console.log("✅ Fixed:", filePath);
  } catch (err) {
    console.error("❌ Prettier failed for:", filePath, "\n", err.message);
  }
});

if (brokenFiles.length) {
  console.log("\n🚨 Broken files (skipped):");
  console.log(brokenFiles.join("\n"));
}

// Git auto-commit block
try {
  execSync("git add . && git commit -m 'auto: fix broken TSX files' && git push", {
    stdio: "inherit",
  });
} catch (e) {
  console.warn("❗ Git commit failed — maybe no changes or repo not clean.");
}
