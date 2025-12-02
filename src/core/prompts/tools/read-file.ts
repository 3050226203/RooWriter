import { ToolArgs } from "./types"

export function getReadFileDescription(args: ToolArgs): string | undefined {
	return `## read_file
Description: Request to read the contents of one or more files.
Parameters:
- args: Contains one or more file elements, where each file contains:
  - path: (required) File path (relative to workspace directory ${args.cwd})

Usage:
<read_file>
<args>
  <file>
    <path>path/to/file</path>
  </file>
</args>
</read_file>

Example:
<read_file>
<args>
  <file>
    <path>chapter1.md</path>
  </file>
</args>
</read_file>`
}
