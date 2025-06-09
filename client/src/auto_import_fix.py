import os
import re

# Auto-detect SRC_DIR based on where script is run
# We expect to find 'components' and 'pages' folder inside SRC_DIR
def find_src_dir():
    # Try current dir first
    cwd = os.getcwd()
    if os.path.isdir(os.path.join(cwd, "components")) and os.path.isdir(os.path.join(cwd, "pages")):
        return cwd

    # Try one level up
    parent = os.path.dirname(cwd)
    if os.path.isdir(os.path.join(parent, "components")) and os.path.isdir(os.path.join(parent, "pages")):
        return parent

    # Not found, fallback to cwd anyway
    print("Warning: Could not auto-detect src directory structure properly. Using current directory.")
    return cwd

SRC_DIR = find_src_dir()
print(f"Using SRC_DIR = {SRC_DIR}")

COMPONENTS_DIR = os.path.join(SRC_DIR, "components")
PAGES_DIR = os.path.join(SRC_DIR, "pages")

IMPORT_ALIAS = "@/"

# ... rest of your functions remain unchanged ...

def find_all_components():
    comp_dict = {}
    for root, _, files in os.walk(COMPONENTS_DIR):
        for f in files:
            if f.endswith(".tsx"):
                comp_name = f[:-4]
                full_path = os.path.relpath(os.path.join(root, f), SRC_DIR)
                comp_path = full_path[:-4]
                comp_dict[comp_name] = comp_path
    return comp_dict

# ... rest of your existing code unchanged ...

def main():
    comp_dict = find_all_components()
    print(f"Found {len(comp_dict)} components.")

    total_files = 0
    updated_files = 0

    for root, _, files in os.walk(PAGES_DIR):
        for f in files:
            if not f.endswith(".tsx"):
                continue

            filepath = os.path.join(root, f)
            if is_dynamic_route(filepath):
                print(f"⏭️ Skipping dynamic route: {filepath}")
                continue

            total_files += 1

            with open(filepath, "r", encoding="utf-8") as file:
                text = file.read()

            imported = get_imported_components(text)
            used = get_used_components(text, comp_dict.keys())

            missing_imports = used - imported

            if missing_imports:
                print(f"🔧 Updating {filepath} - adding imports for: {', '.join(missing_imports)}")
                changed = add_imports_to_file(filepath, missing_imports, comp_dict)
                if changed:
                    updated_files += 1
            else:
                print(f"✅ No missing imports in {filepath}")

    print(f"\nSummary: Processed {total_files} files, updated {updated_files} files.")

if __name__ == "__main__":
    main()
