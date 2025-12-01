import React from "react"

interface FileNode {
	name: string
	path: string
	type: "file" | "folder"
	children?: FileNode[]
}

// Mock file tree data for now
const MOCK_FILES: FileNode[] = [
	{ name: "Chapter 1.md", path: "chapter-1.md", type: "file" },
	{ name: "Chapter 2.md", path: "chapter-2.md", type: "file" },
	{
		name: "Characters",
		path: "characters",
		type: "folder",
		children: [
			{ name: "Protagonist.txt", path: "characters/protagonist.txt", type: "file" },
			{ name: "Antagonist.txt", path: "characters/antagonist.txt", type: "file" },
		],
	},
	{ name: "Notes.txt", path: "notes.txt", type: "file" },
]

const FileNodeItem: React.FC<{ node: FileNode; level: number }> = ({ node, level }) => {
	const isMdOrTxt = node.type === "folder" || node.name.endsWith(".md") || node.name.endsWith(".txt")

	if (!isMdOrTxt) return null

	return (
		<div className="flex flex-col">
			<div
				className="flex items-center py-1 px-2 hover:bg-[var(--vscode-list-hoverBackground)] cursor-pointer text-sm"
				style={{ paddingLeft: `${level * 12 + 8}px` }}>
				<span
					className={`codicon codicon-${node.type === "folder" ? "folder" : "file"} mr-2 opacity-70`}></span>
				<span className="truncate">{node.name}</span>
			</div>
			{node.children && (
				<div className="flex flex-col">
					{node.children.map((child) => (
						<FileNodeItem key={child.path} node={child} level={level + 1} />
					))}
				</div>
			)}
		</div>
	)
}

export const SimpleFileTree: React.FC = () => {
	return (
		<div className="flex flex-col h-full overflow-y-auto border-t border-[var(--vscode-widget-border)] pt-2">
			<div className="px-4 pb-2 text-xs font-bold opacity-50 uppercase tracking-wider">Project Files</div>
			<div className="flex flex-col">
				{MOCK_FILES.map((node) => (
					<FileNodeItem key={node.path} node={node} level={0} />
				))}
			</div>
		</div>
	)
}
