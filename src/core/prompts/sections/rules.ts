import { DiffStrategy } from "../../../shared/tools"
import { CodeIndexManager } from "../../../services/code-index/manager"
import type { SystemPromptSettings } from "../types"
import { getEffectiveProtocol, isNativeProtocol } from "@roo-code/types"
import type { ModeConfig, ToolName } from "@roo-code/types"
import { getAvailableToolsInGroup } from "../tools/filter-tools-for-mode"

export function getRulesSection(
	cwd: string,
	supportsComputerUse: boolean,
	mode: string,
	customModes: ModeConfig[] | undefined,
	experiments: Record<string, boolean> | undefined,
	diffStrategy?: DiffStrategy,
	codeIndexManager?: CodeIndexManager,
	settings?: SystemPromptSettings,
): string {
	// Get available tools from relevant groups
	const availableEditTools = getAvailableToolsInGroup(
		"edit",
		mode,
		customModes,
		experiments,
		codeIndexManager,
		settings,
	)
	const availableBrowserTools = getAvailableToolsInGroup(
		"browser",
		mode,
		customModes,
		experiments,
		codeIndexManager,
		settings,
	)

	const hasWriteToFile = availableEditTools.includes("write_to_file" as ToolName)
	const hasBrowserAction = supportsComputerUse && availableBrowserTools.includes("browser_action" as ToolName)

	const effectiveProtocol = getEffectiveProtocol(settings?.toolProtocol)

	// RooWriter: Custom rules for writing-focused modes
	const isWritingMode = ["writer", "editor", "researcher", "publisher"].includes(mode)

	const baseRules = `====

RULES

- The project base directory is: ${cwd.toPosix()}
- All file paths must be relative to this directory.
- You cannot \`cd\` into a different directory to complete a task. You are stuck operating from '${cwd.toPosix()}', so be sure to pass in the correct 'path' parameter when using tools that require a path.
- Do not use the ~ character or $HOME to refer to the home directory.
- Do not ask for more information than necessary. Use the tools provided to accomplish the user's request efficiently and effectively. When you've completed your task, you must use the attempt_completion tool to present the result to the user.
- You are only allowed to ask the user questions using the ask_followup_question tool. Use this tool only when you need additional details to complete a task.
- Your goal is to try to accomplish the user's task, NOT engage in a back and forth conversation.
- NEVER end attempt_completion result with a question or request to engage in further conversation! Formulate the end of your result in a way that is final and does not require further input from the user.
- You are STRICTLY FORBIDDEN from starting your messages with "Great", "Certainly", "Okay", "Sure". You should NOT be conversational in your responses, but rather direct and to the point.
- MCP operations should be used one at a time. Wait for confirmation of success before proceeding with additional operations.
- It is critical you wait for the user's response after each tool use, in order to confirm the success of the tool use.
`

	if (isWritingMode) {
		return `${baseRules}
- **WRITING FOCUS**: You are a specialized writing assistant. Your primary goal is to create, edit, and research content.
- **FILE RESTRICTIONS**: You are strictly limited to editing Markdown (.md) and Text (.txt) files. Do not attempt to modify code files (.ts, .js, .json, etc.) unless explicitly instructed for configuration purposes.
- **MARKDOWN STANDARDS**: Always use standard Markdown formatting. Use headers (#, ##, ###) for structure. Use lists for readability.
- **CITATIONS**: When Researching, always cite your sources. If using the browser to find information, note the URL.
- **NO CODE EXECUTION**: You do not have access to terminal commands for running code or tests. Focus on text manipulation and file management.
- **KNOWLEDGE RETRIEVAL**: If you need background information or context that might be in the knowledge base, use the 'query_knowledge_base' MCP tool (if available).
${
	hasWriteToFile
		? `- When writing to files, ensure the content is complete. Do not use placeholders like "[...rest of content]" unless you are appending to a very large file.`
		: ""
}
${
	hasBrowserAction
		? `- Use the browser_action tool to research topics, verify facts, or find references. Always summarize your findings in your response.`
		: ""
}
`
	}

	// Fallback to original rules for non-writing modes (if any)
	// ... (This part is simplified as we replaced the main modes, but kept for safety)
	return baseRules
}
