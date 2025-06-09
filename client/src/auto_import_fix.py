import os
import re

SRC_DIR = "src"
COMPONENTS_DIR = os.path.join(SRC_DIR, "components")
PAGES_DIR = os.path.join(SRC_DIR, "pages")

IMPORT_ALIAS = "@/"

def find_all_components():
    comp_dict = {}
    for root, _, files in os.walk(COMPONENTS_DIR):
        for f in files:
            if f.endswith(".tsx"):
                comp_name = f[:-4]
                full_path = os.path.relpath(os.path.join(root, f), SRC_DIR)
                # Store path relative to src/, without .tsx
                comp_path = full_path[:-4]
                comp_dict[comp_name] = comp_path
    return comp_dict

def is_dynamic_route(filepath):
    # If filename contains [ or ] consider dynamic route, skip
    filename = os.path.basename(filepath)
    return "[" in filename or "]" in filename

def get_imported_components(file_text):
    # Regex to find import ComponentName from '...'
    pattern = r'import\s+(\w+)\s+from\s+[\'"][^\'"]+[\'"]'
    return set(re.findall(pattern, file_text))

def get_used_components(file_text, component_names):
    used = set()
    # Basic heuristic: check if component name is used as JSX tag <ComponentName
    for comp in component_names:
        # Word boundary + <Component or <Component (with attributes)
        if re.search(rf"<{comp}(\s|>)", file_text):
            used.add(comp)
    return used

def add_imports_to_file(filepath, missing_components, comp_dict):
    if not missing_components:
        return False

    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Find first non-comment, non-empty line index to add imports after any shebang/comments
    insert_at = 0
    for i, line in enumerate(lines):
        if line.strip() and not line.strip().startswith("//") and not line.strip().startswith("/*") and not line.strip().startswith("*"):
            insert_at = i
            break

    import_lines = []
    for comp in missing_components:
        import_path = comp_dict[comp].replace("\\", "/")  # for Windows compatibility
        import_line = f'import {comp} from \'{IMPORT_ALIAS}{import_path}\';\n'
        import_lines.append(import_line)

    # Insert imports before insert_at line
    lines = lines[:insert_at] + import_lines + lines[insert_at:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(lines)

    return True

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
