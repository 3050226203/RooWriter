import { memo, useState, useEffect } from "react"
import type { HistoryItem } from "@roo-code/types"

import { vscode } from "@/utils/vscode"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

import TaskItemFooter from "./TaskItemFooter"

interface DisplayHistoryItem extends HistoryItem {
	highlight?: string
}

interface TaskItemProps {
	item: DisplayHistoryItem
	variant: "compact" | "full"
	showWorkspace?: boolean
	isSelectionMode?: boolean
	isSelected?: boolean
	onToggleSelection?: (taskId: string, isSelected: boolean) => void
	onDelete?: (taskId: string) => void
	className?: string
}

const TaskItem = ({
	item,
	variant,
	showWorkspace = false,
	isSelectionMode = false,
	isSelected = false,
	onToggleSelection,
	onDelete,
	className,
}: TaskItemProps) => {
	const [isEditingSnapshot, setIsEditingSnapshot] = useState(false)
	const [snapshotLabel, setSnapshotLabel] = useState(item.snapshot || "")

	useEffect(() => {
		setSnapshotLabel(item.snapshot || "")
	}, [item.snapshot])

	const handleSnapshotSave = (e?: React.MouseEvent | React.KeyboardEvent) => {
		e?.stopPropagation()
		vscode.postMessage({ type: "updateTask", historyItem: { ...item, snapshot: snapshotLabel } })
		setIsEditingSnapshot(false)
	}

	const handleSnapshotCancel = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		setSnapshotLabel(item.snapshot || "")
		setIsEditingSnapshot(false)
	}

	const handleClick = () => {
		if (isEditingSnapshot) return
		if (isSelectionMode && onToggleSelection) {
			onToggleSelection(item.id, !isSelected)
		} else {
			vscode.postMessage({ type: "showTaskWithId", text: item.id })
		}
	}

	const isCompact = variant === "compact"

	return (
		<div
			key={item.id}
			data-testid={`task-item-${item.id}`}
			className={cn(
				"cursor-pointer group bg-vscode-editor-background rounded-xl relative overflow-hidden border hover:bg-vscode-editor-foreground/10 transition-colors",
				"border-transparent",
				className,
			)}
			onClick={handleClick}>
			<div className={(!isCompact && isSelectionMode ? "pl-3 pb-3" : "pl-4") + " flex gap-3 px-3 pt-3 pb-1"}>
				{/* Selection checkbox - only in full variant */}
				{!isCompact && isSelectionMode && (
					<div
						className="task-checkbox mt-1"
						onClick={(e) => {
							e.stopPropagation()
						}}>
						<Checkbox
							checked={isSelected}
							onCheckedChange={(checked: boolean) => onToggleSelection?.(item.id, checked === true)}
							variant="description"
						/>
					</div>
				)}

				<div className="flex-1 min-w-0">
					<div
						className={cn(
							"overflow-hidden whitespace-pre-wrap font-light text-vscode-foreground text-ellipsis line-clamp-3",
							{
								"text-base": !isCompact,
							},
							!isCompact && isSelectionMode ? "mb-1" : "",
						)}
						data-testid="task-content"
						{...(item.highlight ? { dangerouslySetInnerHTML: { __html: item.highlight } } : {})}>
						{item.highlight ? undefined : item.task}
					</div>

					{/* Snapshot Label */}
					{item.snapshot && !isEditingSnapshot && (
						<div className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-vscode-badge-background text-vscode-badge-foreground">
							{item.snapshot}
						</div>
					)}

					{/* Edit Input */}
					{isEditingSnapshot && (
						<div className="flex items-center gap-1 mt-1 mb-1" onClick={(e) => e.stopPropagation()}>
							<input
								type="text"
								value={snapshotLabel}
								onChange={(e) => setSnapshotLabel(e.target.value)}
								className="text-xs border rounded px-1 py-0.5 bg-vscode-input-background text-vscode-input-foreground border-vscode-input-border focus:outline-none focus:border-vscode-focusBorder"
								placeholder="Snapshot Name"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") handleSnapshotSave(e)
									if (e.key === "Escape") handleSnapshotCancel()
								}}
								onClick={(e) => e.stopPropagation()}
							/>
							<div
								onClick={handleSnapshotSave}
								className="cursor-pointer text-xs text-vscode-charts-green hover:opacity-80 px-1">
								✓
							</div>
							<div
								onClick={handleSnapshotCancel}
								className="cursor-pointer text-xs text-vscode-charts-red hover:opacity-80 px-1">
								✕
							</div>
						</div>
					)}

					<TaskItemFooter
						item={item}
						variant={variant}
						isSelectionMode={isSelectionMode}
						onDelete={onDelete}
						onSnapshotClick={() => setIsEditingSnapshot(true)}
					/>

					{showWorkspace && item.workspace && (
						<div className="flex flex-row gap-1 text-vscode-descriptionForeground text-xs mt-1">
							<span className="codicon codicon-folder scale-80" />
							<span>{item.workspace}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default memo(TaskItem)
