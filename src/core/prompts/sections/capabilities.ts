import { DiffStrategy } from "../../../shared/tools"
import { McpHub } from "../../../services/mcp/McpHub"
import type { ModeConfig, ToolName } from "@roo-code/types"
import { getAvailableToolsInGroup } from "../tools/filter-tools-for-mode"
import type { SystemPromptSettings } from "../types"

export function getCapabilitiesSection(
	cwd: string,
	supportsComputerUse: boolean,
	mode: string,
	customModes: ModeConfig[] | undefined,
	experiments: Record<string, boolean> | undefined,
	mcpHub?: McpHub,
	diffStrategy?: DiffStrategy,
	settings?: SystemPromptSettings,
): string {
	const isWritingMode = ["writer", "editor", "researcher", "publisher"].includes(mode)

	const availableBrowserTools = getAvailableToolsInGroup("browser", mode, customModes, experiments, settings)

	const hasBrowserAction = supportsComputerUse && availableBrowserTools.includes("browser_action")

	if (isWritingMode) {
		return `====

CAPABILITIES

- You are an advanced AI writing assistant capable of managing complex writing projects.
- You can manage files (create, read, update) within the project directory.
- You can maintain a Todo list to track your writing progress.
${
	hasBrowserAction
		? `- You have full web access via a browser to research topics, verify facts, and find inspiration.`
		: ""
}
${
	mcpHub
		? `- You can connect to external knowledge bases and tools via MCP (Model Context Protocol) to enhance your writing capabilities.`
		: ""
}
`
	}

	// Fallback for non-writing modes (legacy support)
	return `====

CAPABILITIES

- You have access to tools that let you execute CLI commands on the user's computer, list files, view source code definitions, regex search${
		hasBrowserAction ? ", use the browser" : ""
	}, read and write files, and ask follow-up questions.
`
}
