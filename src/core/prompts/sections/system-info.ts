import os from "os"
import osName from "os-name"

import { getShell } from "../../../utils/shell"

export function getSystemInfoSection(cwd: string): string {
	return `====

SYSTEM INFORMATION

Current Workspace Directory: ${cwd.toPosix()}`
}
