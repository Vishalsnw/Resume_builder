import os
import re

SRC_DIR = os.getcwd()
IMPORT_ALIAS = "@/"

def find_all_exports(base_dirs):
    exports = {}
    for base in base_dirs:
        for root, _, files in os.walk(os.path.join(SRC_DIR, base)):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                    name = file.rsplit('.', 1)[0]
                    path = os.path.relpath(os.path.join(root, file), SRC_DIR).replace("\\", "/")
                    path_no_ext = os.path.splitext(path)[0]
                    exports[name] = path_no_ext
    return exports

def get_imported_items(text):
    return set(re.findall(r'import\s+(\w+)', text))

def get_used_items(text, known_items):
    used = set()
    for item in known_items:
        # Match tags <ComponentName or usage like ComponentName(...)
        if re.search(rf'\b{item}\b', text):
            used.add(item)
    return used

def add_imports(filepath, missing, exports):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    insert_at = next((i for i, line in enumerate(lines)
                      if line.strip() and not line.strip().startswith(("//", "/*", "*"))), 0)

    import_lines = [f"import {item} from '{IMPORT_ALIAS}{exports[item]}';\n" for item in missing]

    updated = lines[:insert_at] + import_lines + lines[insert_at:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(updated)

def is_code_file(filename):
    return filename.endswith(('.tsx', '.ts', '.js', '.jsx'))

def main():
    base_dirs = ['components', 'hooks', 'utils', 'contexts', 'services', 'types']
    exports = find_all_exports(base_dirs)
    print(f"🧠 Found {len(exports)} exportable items in: {', '.join(base_dirs)}")

    total = 0
    updated = 0
    all_used = set()

    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if not is_code_file(file):
                continue

            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                text = f.read()

            imported = get_imported_items(text)
            used = get_used_items(text, exports.keys())
            all_used.update(used)

            missing = used - imported
            if missing:
                print(f"🔧 Updating {filepath} - adding: {', '.join(missing)}")
                add_imports(filepath, missing, exports)
                updated += 1

            total += 1

    # Unused component warning
    unused = set(exports.keys()) - all_used
    if unused:
        print("\n⚠️ Possibly unused files/components:")
        for u in sorted(unused):
            print(f"  - {u} → {exports[u]}")

    print(f"\n✅ Done: Processed {total} files, updated {updated} files.")

if __name__ == "__main__":
    main()
