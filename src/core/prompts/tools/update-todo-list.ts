import { ToolArgs } from "./types"

/**
 * Get the description for the update_todo_list tool.
 */
export function getUpdateTodoListDescription(args?: ToolArgs): string {
	return `## update_todo_list
Description: Replace the entire TODO list with an updated checklist. Always provide the full list.
Checklist Format:
- [ ] Pending
- [x] Completed
- [-] In Progress

Usage:
<update_todo_list>
<todos>
[x] Phase 1
[-] Phase 2
[ ] Phase 3
</todos>
</update_todo_list>`
}
