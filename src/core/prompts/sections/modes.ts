import * as vscode from "vscode"

import type { ModeConfig } from "@roo-code/types"

import { getAllModesWithPrompts } from "../../../shared/modes"
import { ensureSettingsDirectoryExists } from "../../../utils/globalContext"

export function getModesSection(modes: ModeConfig[]): string {
	if (!modes || !Array.isArray(modes)) {
		return ""
	}
	const modeDescriptions = modes
		.map((mode) => {
			return `* "${mode.name}" mode (${mode.slug}) - ${mode.description}`
		})
		.join("\n")

	return `====

MODES

- These are the currently available modes:
${modeDescriptions}`
}
