#!/bin/bash

# Export list file (tumhara exported components/functions wala file)
EXPORTS_FILE="all_exports.txt"

# Search directory (tumhara React source folder)
SEARCH_DIR="src"

# Temp file for components names only
COMPONENTS_FILE="components_list.txt"

echo "Extracting exported component/function names..."

# Extract exported names (after 'export const' or 'export default')
awk -F ':' '
{
  line = $2
  if (match(line, /export const ([A-Za-z0-9_]+)/, arr)) {
    print arr[1]
  } else if (match(line, /export default ([A-Za-z0-9_]+)/, arr)) {
    print arr[1]
  }
}
' "$EXPORTS_FILE" | sort | uniq > "$COMPONENTS_FILE"

count=$(wc -l < "$COMPONENTS_FILE")
echo "Total exported components/functions found: $count"

echo "Checking usage of exported components/functions..."

# Prepare report file
REPORT_FILE="export_usage_report.txt"
echo "Exported Component/Function Usage Report" > "$REPORT_FILE"
echo "======================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Loop over each exported component/function
while read -r comp; do
  # Grep usage in the source directory (excluding the file where it's exported)
  # Ignore the exact export line by excluding lines containing 'export' and component name together
  usage_count=$(grep -r --exclude="$EXPORTS_FILE" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=build --exclude="$COMPONENTS_FILE" -w "$comp" "$SEARCH_DIR" | grep -v "export .*$comp" | wc -l)
  
  echo "$comp : $usage_count usages" >> "$REPORT_FILE"
done < "$COMPONENTS_FILE"

echo "Done! Usage report saved to $REPORT_FILE"
