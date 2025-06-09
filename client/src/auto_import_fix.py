import os
import re

SRC_DIR = os.path.join(os.getcwd(), "client/src")  # ✅ Change if needed
IMPORT_ALIAS = "@/"

def is_code_file(filename):
    return filename.endswith(('.tsx', '.ts', '.js', '.jsx'))

def find_all_exports():
    exports = {}
    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if not is_code_file(file):
                continue
            name = file.rsplit('.', 1)[0]
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, SRC_DIR).replace("\\", "/")
            path_no_ext = os.path.splitext(rel_path)[0]
            exports[name] = path_no_ext
    return exports

def get_imported_items(text):
    direct = re.findall(r'import\s+([A-Za-z0-9_]+)', text)
    renamed = re.findall(r'import\s+{[^}]*\s+as\s+([A-Za-z0-9_]+)[^}]*}', text)
    return set(direct + renamed)

def get_local_declarations(text):
    consts = re.findall(r'(?:const|let|var)\s+(\w+)\s*[:=]', text)
    funcs = re.findall(r'function\s+(\w+)', text)
    classes = re.findall(r'class\s+(\w+)', text)
    types = re.findall(r'(?:interface|type|enum)\s+(\w+)', text)
    return set(consts + funcs + classes + types)

def get_used_items(text, known_items):
    return {item for item in known_items if re.search(rf'\b{item}\b', text)}

def add_imports(filepath, missing, exports, local_declarations):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    insert_at = next((i for i, line in enumerate(lines)
                      if line.strip() and not line.strip().startswith(("//", "/*", "*"))), 0)

    import_lines = []
    renamed = []

    for item in missing:
        if item in local_declarations:
            alias = f"{item}Import"
            import_lines.append(f"import {{ default as {alias} }} from '{IMPORT_ALIAS}{exports[item]}';\n")
            renamed.append(f"{item} → {alias}")
        else:
            import_lines.append(f"import {item} from '{IMPORT_ALIAS}{exports[item]}';\n")

    if renamed:
        import_lines.append("\n// NOTE: Renamed to avoid conflict with local declarations:\n")
        import_lines.append("// " + ", ".join(renamed) + "\n")

    updated = lines[:insert_at] + import_lines + lines[insert_at:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(updated)

    return renamed

def main():
    exports = find_all_exports()
    print(f"🧠 Found {len(exports)} exportable items (auto-detected)")

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

    unused = set(exports.keys()) - all_used
    if unused:
        print("\n⚠️ Possibly unused components:")
        for u in sorted(unused):
            print(f"  - {u} → {exports[u]}")

    if conflicts:
        print("\n⚠️ Renamed imports due to local declaration conflict:")
        for c in conflicts:
            print(f"  - {c}")

    print(f"\n✅ Done: Processed {total_files} files, updated {updated_files} files.")

if __name__ == "__main__":
    main()
