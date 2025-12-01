import React from "react"
import { VSCodeDropdown, VSCodeOption, VSCodeButton } from "@vscode/webview-ui-toolkit/react"

export interface WritingTemplate {
	id: string
	name: string
	description: string
	prompt: string
}

export const BUILTIN_TEMPLATES: WritingTemplate[] = [
	{
		id: "tech-blog",
		name: "📝 Tech Blog",
		description: "Technical tutorial or article with code examples",
		prompt: "I want to write a technical blog post about [TOPIC]. \n\nStructure:\n1. Introduction (Problem Statement)\n2. Prerequisites\n3. Step-by-Step Implementation\n4. Common Pitfalls\n5. Conclusion\n\nPlease help me outline and draft this."
	},
	{
		id: "fiction-chapter",
		name: "📖 Fiction Chapter",
		description: "Story chapter with scene setting and dialogue",
		prompt: "I need to write a chapter for my story. \n\nContext: [Describe current situation]\nCharacters: [List characters present]\nGoal: [What happens in this chapter?]\n\nPlease help me write a vivid scene focusing on show-don't-tell."
	},
	{
		id: "academic-paper",
		name: "🎓 Academic Paper",
		description: "Formal research paper structure",
		prompt: "I am writing an academic paper on [TOPIC]. \n\nSection to write: [Abstract/Intro/Methodology/Results/Discussion]\nKey points to cover: \n- Point 1\n- Point 2\n\nPlease ensure formal tone and proper citation placeholders."
	},
	{
		id: "weekly-report",
		name: "📊 Weekly Report",
		description: "Progress update and planning",
		prompt: "Draft a weekly status report.\n\nAccomplishments:\n- [Item 1]\n\nBlockers:\n- [Item 2]\n\nNext Week's Plan:\n- [Item 3]\n\nTone: Professional and concise."
	}
]

interface TemplateSelectorProps {
	onSelect: (template: WritingTemplate) => void
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
	const [selectedId, setSelectedId] = React.useState(BUILTIN_TEMPLATES[0].id)

	const handleSelect = () => {
		const template = BUILTIN_TEMPLATES.find(t => t.id === selectedId)
		if (template) {
			onSelect(template)
		}
	}

	return (
		<div className="flex flex-col gap-3 p-4 border border-[var(--vscode-widget-border)] rounded-md bg-[var(--vscode-editor-background)]">
			<h3 className="text-sm font-bold uppercase opacity-70">Quick Start Templates</h3>
			
			<div className="flex flex-col gap-2">
				<VSCodeDropdown 
					value={selectedId} 
					onChange={(e: any) => setSelectedId(e.target.value)}
					className="w-full"
				>
					{BUILTIN_TEMPLATES.map(t => (
						<VSCodeOption key={t.id} value={t.id}>{t.name}</VSCodeOption>
					))}
				</VSCodeDropdown>
				
				<p className="text-xs opacity-60 min-h-[2.5em]">
					{BUILTIN_TEMPLATES.find(t => t.id === selectedId)?.description}
				</p>
			</div>

			<VSCodeButton onClick={handleSelect} appearance="secondary">
				Use Template
			</VSCodeButton>
		</div>
	)
}
