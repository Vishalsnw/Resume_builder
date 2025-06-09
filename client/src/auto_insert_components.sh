#!/bin/bash

# Root folder where the script runs should be inside `client/src`
PAGES_DIR="src"

# Map of component to target file
declare -A usage_map=(
  [AIContentGenerator]="pages/resumes/[id].tsx"
  [AIFeedback]="pages/resumes/[id].tsx"
  [ATSScoreCard]="pages/resumes/[id].tsx"
  [ContentEnhancer]="pages/resumes/[id].tsx"
  [ResumeBuilder]="pages/resumes/create.tsx"
  [ResumeActionBar]="pages/resumes/[id].tsx"
  [ResumeList]="pages/dashboard.tsx"
  [ProtectedRoute]="pages/dashboard.tsx"
  [CoverLetterGenerator]="pages/resumes/[id].tsx"
  [ATSTemplate]="pages/templates/[id].tsx"
  [ClassicTemplate]="pages/templates/[id].tsx"
  [CreativeTemplate]="pages/templates/[id].tsx"
  [ModernTemplate]="pages/templates/[id].tsx"
  [Alert]="pages/login.tsx"
  [Modal]="pages/login.tsx"
  [Toast]="pages/register.tsx"
  [CertificationsForm]="pages/resumes/edit/[id].tsx"
  [ExperienceForm]="pages/resumes/edit/[id].tsx"
  [ProjectsForm]="pages/resumes/edit/[id].tsx"
  [SkillsForm]="pages/resumes/edit/[id].tsx"
  [DOCXExporter]="pages/resumes/[id].tsx"
  [PDFExporter]="pages/resumes/[id].tsx"
)

# Loop through export usage report
while IFS= read -r line; do
  comp=$(echo "$line" | cut -d':' -f1 | xargs)
  usage=$(echo "$line" | cut -d':' -f2 | xargs)

  if [[ "$usage" == "0 usages" && ${usage_map[$comp]+_} ]]; then
    file="${usage_map[$comp]}"

    # Skip dynamic route files like [id].tsx if they don't exist
    if [[ "$file" == *"["*"]"* ]]; then
      echo "⏭️ Skipping dynamic route: $file"
      continue
    fi

    abs_path="$PAGES_DIR/$file"

    if [[ -f "$abs_path" ]]; then
      echo "🔧 Adding $comp to $abs_path..."

      # Resolve import path from components folder
      comp_path=$(find components -name "$comp.tsx" | head -n1)
      if [[ -z "$comp_path" ]]; then
        echo "❌ Could not locate component file for $comp"
        continue
      fi
      import_path="@/components/${comp_path#components/}"
      import_path="${import_path%.tsx}"

      # Insert import at top if not already present
      grep -q "$comp" "$abs_path" || sed -i "1i import $comp from '$import_path';" "$abs_path"

      # Insert JSX usage before last line (assumes functional JSX file)
      sed -i '$i\
{/* Auto Inserted Component */}\
\n<'$comp' />\
' "$abs_path"

    else
      echo "⚠️ File not found: $abs_path"
    fi
  fi
done < export_usage_report.txt

echo "✅ Done inserting components."
