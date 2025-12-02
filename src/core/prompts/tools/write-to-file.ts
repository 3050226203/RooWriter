import { ToolArgs } from "./types"

export function getWriteToFileDescription(args: ToolArgs): string | undefined {
	return `## write_to_file
Description: Request to write content to a file. If the file exists, it will be overwritten. If it doesn't exist, it will be created.
Parameters:
- path: (required) The path of the file to write to (relative to the current workspace directory ${args.cwd})
- content: (required) The content to write to the file.
- line_count: (required) The number of lines in the file.
Usage:
<write_to_file>
<path>File path here</path>
<content>
Your file content here
</content>
<line_count>total number of lines</line_count>
</write_to_file>

Example:
<write_to_file>
<path>drafts/chapter1.md</path>
<content>
# Chapter 1
It was a dark and stormy night.
</content>
<line_count>3</line_count>
</write_to_file>`
}
