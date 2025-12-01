import React, { useState, useEffect } from "react"
import { VSCodeButton, VSCodeTextField, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react"
// import { vscode } from "../../utils/vscode"
// import { useExtensionState } from "../../context/ExtensionStateContext"

interface ProjectMetadata {
	title: string
	author: string
	synopsis: string
}

interface ProjectMetadataViewProps {
	onDone: () => void
}

export const ProjectMetadataView: React.FC<ProjectMetadataViewProps> = ({ onDone }) => {
	const [metadata, setMetadata] = useState<ProjectMetadata>({
		title: "",
		author: "",
		synopsis: "",
	})

	// Load initial state (in a real implementation, this would come from ExtensionState or file)
	useEffect(() => {
		// Mock loading
		const savedMetadata = localStorage.getItem("roo-writer-metadata")
		if (savedMetadata) {
			setMetadata(JSON.parse(savedMetadata))
		}
	}, [])

	const handleSave = () => {
		// Persist metadata (mock implementation)
		localStorage.setItem("roo-writer-metadata", JSON.stringify(metadata))
		// In real app, send to extension backend:
		// vscode.postMessage({ type: "saveProjectMetadata", metadata })
		onDone()
	}

	return (
		<div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-lg font-bold">Writing Project</h2>
				<VSCodeButton appearance="icon" onClick={onDone}>
					<span className="codicon codicon-close"></span>
				</VSCodeButton>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-xs font-medium opacity-70">Title</label>
				<VSCodeTextField
					value={metadata.title}
					onInput={(e: any) => setMetadata({ ...metadata, title: e.target.value })}
					placeholder="Project Title"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-xs font-medium opacity-70">Author</label>
				<VSCodeTextField
					value={metadata.author}
					onInput={(e: any) => setMetadata({ ...metadata, author: e.target.value })}
					placeholder="Author Name"
				/>
			</div>

			<div className="flex flex-col gap-2 flex-grow">
				<label className="text-xs font-medium opacity-70">Synopsis</label>
				<VSCodeTextArea
					value={metadata.synopsis}
					onInput={(e: any) => setMetadata({ ...metadata, synopsis: e.target.value })}
					placeholder="Brief summary of your story or article..."
					className="h-full min-h-[150px]"
					resize="vertical"
				/>
			</div>

			<div className="mt-auto pt-4">
				<VSCodeButton className="w-full" onClick={handleSave}>
					Save Project Details
				</VSCodeButton>
			</div>
		</div>
	)
}
