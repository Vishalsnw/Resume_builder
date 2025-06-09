import os
import re

SRC_DIR = os.getcwd()
IMPORT_ALIAS = "@/"

# Directories to scan for exportable components/modules
BASE_DIRS = ['components', 'hooks', 'utils', 'contexts', 'services', 'types']

def find_all_exports(base_dirs):
    exports = {}
    for base in base_dirs:
        base_path = os.path.join(SRC_DIR, base)
        if not os.path.exists(base_path):
            continue
        for root, _, files in os.walk(base_path):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                    name = file.rsplit('.', 1)[0]
                    rel_path = os.path.relpath(os.path.join(root, file), SRC_DIR).replace("\\", "/")
                    path_no_ext = os.path.splitext(rel_path)[0]
                    exports[name] = path_no_ext
    return exports

def get_imported_items(text):
    direct_imports = re.findall(r'import\s+([A-Za-z0-9_]+)', text)
    renamed_imports = re.findall(r'import\s+{[^}]*\s+as\s+([A-Za-z0-9_]+)[^}]*}', text)
    return set(direct_imports + renamed_imports)

def get_local_declarations(text):
    consts = re.findall(r'(?:const|let|var)\s+(\w+)\s*[:=]', text)
    funcs = re.findall(r'function\s+(\w+)', text)
    classes = re.findall(r'class\s+(\w+)', text)
    types = re.findall(r'(?:interface|type|enum)\s+(\w+)', text)
    return set(consts + funcs + classes + types)

def get_used_items(text, known_items):
    used = set()
    for item in known_items:
        if re.search(rf'\b{item}\b', text):
            used.add(item)
    return used

def add_imports(filepath, missing, exports, local_declarations):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    insert_at = next((i for i, line in enumerate(lines)
                      if line.strip() and not line.strip().startswith(("//", "/*", "*"))), 0)

    import_lines = []
    skipped = []

    for item in missing:
        if item in local_declarations:
            alias = f"{item}Import"
            import_lines.append(f"import {{ default as {alias} }} from '{IMPORT_ALIAS}{exports[item]}';\n")
            skipped.append(f"{item} → {alias}")
        else:
            import_lines.append(f"import {item} from '{IMPORT_ALIAS}{exports[item]}';\n")

    if skipped:
        import_lines.append("\n// NOTE: Renamed imports to avoid naming conflicts:\n")
        import_lines.append("// " + ", ".join(skipped) + "\n")

    updated_lines = lines[:insert_at] + import_lines + lines[insert_at:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(updated_lines)

    return skipped

def is_code_file(filename):
    return filename.endswith(('.tsx', '.ts', '.js', '.jsx'))

def main():
    exports = find_all_exports(BASE_DIRS)
    print(f"🧠 Found {len(exports)} exported items from: {', '.join(BASE_DIRS)}")

    updated_files = 0
    total_files = 0
    all_used = set()
    conflicts = []

    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if not is_code_file(file):
                continue

            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            imported = get_imported_items(content)
            local = get_local_declarations(content)
            used = get_used_items(content, exports.keys())
            all_used.update(used)

            missing = used - imported
            if missing:
                print(f"🛠️  {filepath} — adding imports: {', '.join(missing)}")
                renamed = add_imports(filepath, missing, exports, local)
                if renamed:
                    conflicts.extend([f"{filepath}: {r}" for r in renamed])
                updated_files += 1

            total_files += 1

    # Unused exports
    unused = set(exports.keys()) - all_used
    if unused:
        print("\n⚠️ Possibly unused exported files:")
        for u in sorted(unused):
            print(f"  - {u} → {exports[u]}")

    if conflicts:
        print("\n⚠️ Renamed imports due to local name conflict:")
        for conflict in conflicts:
            print(f"  - {conflict}")

    print(f"\n✅ Completed. Processed {total_files} files, updated {updated_files} files.")

if __name__ == "__main__":
    main()
