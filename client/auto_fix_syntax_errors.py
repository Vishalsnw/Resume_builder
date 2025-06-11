import os
import subprocess

def get_all_js_files(directory):
    js_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".js") or file.endswith(".jsx"):
                js_files.append(os.path.join(root, file))
    return js_files

def run_eslint_fix(file_path):
    try:
        result = subprocess.run(
            ["npx", "eslint", "--fix", file_path],
            capture_output=True,
            text=True
        )
        print(f"\n✅ Fixed: {file_path}")
        if result.stderr:
            print(f"⚠️ Warnings/Errors:\n{result.stderr}")
    except Exception as e:
        print(f"❌ Failed to fix {file_path}: {e}")

def main():
    src_folder = "./src"
    if not os.path.exists(src_folder):
        print("❌ No src folder found.")
        return

    js_files = get_all_js_files(src_folder)
    if not js_files:
        print("❌ No .js or .jsx files found.")
        return

    print(f"🔍 Found {len(js_files)} files. Fixing with ESLint...\n")

    for file in js_files:
        run_eslint_fix(file)

    print("\n🎉 Done! All fixable syntax issues are auto-fixed.")

if __name__ == "__main__":
    main()
