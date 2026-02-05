
import os
import re

src_dir = 'src'

# Mapping of folder names to their expected internal file name
# Components, Pages, Hooks, Services, Utils (if moved)
folders_to_update = ['components', 'pages', 'hooks', 'services', 'utils', 'contexts']

def update_imports(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    original_content = content

    # Replace relative imports with @ alias first for simplicity if possible, 
    # but the structure is already folder-based so it's easier to just fix the paths.

    # Pattern for @/ alias imports
    for folder in folders_to_update:
        # Match from '@/folder/Name' but not '@/folder/Name/Name'
        pattern = fr"from '@/({folder})/([^/']+)'"
        # Since we moved Name.tsx to Name/Name.tsx, the import should be '@/folder/Name/Name'
        # Unless it's a file like src/types.ts which wasn't moved to a folder.
        
        def replace_fn(match):
            folder_part = match.group(1)
            name_part = match.group(2)
            
            # Check if it's already updated or if it's a non-moved file
            # Actually, most components/pages/hooks/services WERE moved.
            # Exceptions: types.ts, constants.ts (if in src root)
            
            if name_part in ['types', 'constants']:
                return match.group(0)
                
            return f"from '@/{folder_part}/{name_part}/{name_part}'"

        content = re.sub(pattern, replace_fn, content)

    # Handle relative imports that weren't converted yet
    # This is trickier because depth varies. Converting to @/ is safest.
    
    # Pattern for from '../...' or './...'
    # We'll convert them to @/ first if they are likely src-relative
    
    # For now, let's just fix the @/ ones first as they are most common now.

    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        return True
    return False

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            full_path = os.path.join(root, file)
            update_imports(full_path)
