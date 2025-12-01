import { z } from "zod"

import { toolGroupsSchema } from "./tool.js"

/**
 * GroupOptions
 */

export const groupOptionsSchema = z.object({
	fileRegex: z
		.string()
		.optional()
		.refine(
			(pattern) => {
				if (!pattern) {
					return true // Optional, so empty is valid.
				}

				try {
					new RegExp(pattern)
					return true
				} catch {
					return false
				}
			},
			{ message: "Invalid regular expression pattern" },
		),
	description: z.string().optional(),
})

export type GroupOptions = z.infer<typeof groupOptionsSchema>

/**
 * GroupEntry
 */

export const groupEntrySchema = z.union([toolGroupsSchema, z.tuple([toolGroupsSchema, groupOptionsSchema])])

export type GroupEntry = z.infer<typeof groupEntrySchema>

/**
 * ModeConfig
 */

const groupEntryArraySchema = z.array(groupEntrySchema).refine(
	(groups) => {
		const seen = new Set()

		return groups.every((group) => {
			// For tuples, check the group name (first element).
			const groupName = Array.isArray(group) ? group[0] : group

			if (seen.has(groupName)) {
				return false
			}

			seen.add(groupName)
			return true
		})
	},
	{ message: "Duplicate groups are not allowed" },
)

export const modeConfigSchema = z.object({
	slug: z.string().regex(/^[a-zA-Z0-9-]+$/, "Slug must contain only letters numbers and dashes"),
	name: z.string().min(1, "Name is required"),
	roleDefinition: z.string().min(1, "Role definition is required"),
	whenToUse: z.string().optional(),
	description: z.string().optional(),
	customInstructions: z.string().optional(),
	groups: groupEntryArraySchema,
	source: z.enum(["global", "project"]).optional(),
})

export type ModeConfig = z.infer<typeof modeConfigSchema>

/**
 * CustomModesSettings
 */

export const customModesSettingsSchema = z.object({
	customModes: z.array(modeConfigSchema).refine(
		(modes) => {
			const slugs = new Set()

			return modes.every((mode) => {
				if (slugs.has(mode.slug)) {
					return false
				}

				slugs.add(mode.slug)
				return true
			})
		},
		{
			message: "Duplicate mode slugs are not allowed",
		},
	),
})

export type CustomModesSettings = z.infer<typeof customModesSettingsSchema>

/**
 * PromptComponent
 */

export const promptComponentSchema = z.object({
	roleDefinition: z.string().optional(),
	whenToUse: z.string().optional(),
	description: z.string().optional(),
	customInstructions: z.string().optional(),
})

export type PromptComponent = z.infer<typeof promptComponentSchema>

/**
 * CustomModePrompts
 */

export const customModePromptsSchema = z.record(z.string(), promptComponentSchema.optional())

export type CustomModePrompts = z.infer<typeof customModePromptsSchema>

/**
 * CustomSupportPrompts
 */

export const customSupportPromptsSchema = z.record(z.string(), z.string().optional())

export type CustomSupportPrompts = z.infer<typeof customSupportPromptsSchema>

/**
 * DEFAULT_MODES
 */

export const DEFAULT_MODES: readonly ModeConfig[] = [
	{
		slug: "writer",
		name: "✍️ Writer",
		roleDefinition:
			"You are Roo, a creative and disciplined writer. Your goal is to conceive, structure, and draft high-quality content. You focus on creativity, flow, and structure.",
		whenToUse:
			"Use this mode for brainstorming, creating outlines, and writing drafts. Ideal for starting new writing projects or expanding on existing ideas.",
		description: "Brainstorm, outline, and draft content",
		groups: ["read", ["edit", { fileRegex: "\\.(md|txt)$", description: "Markdown and text files only" }], "browser", "mcp"],
	},
	{
		slug: "editor",
		name: "🖊️ Editor",
		roleDefinition:
			"You are Roo, a meticulous editor. Your goal is to refine, polish, and correct content. You focus on clarity, grammar, consistency, and style.",
		whenToUse:
			"Use this mode for proofreading, refining drafts, ensuring stylistic consistency, and improving readability.",
		description: "Refine, polish, and check content",
		groups: ["read", ["edit", { fileRegex: "\\.(md|txt)$", description: "Markdown and text files only" }], "browser", "mcp"],
	},
	{
		slug: "researcher",
		name: "🔍 Researcher",
		roleDefinition:
			"You are Roo, a thorough researcher. Your goal is to gather information, verify facts, and provide accurate context for writing projects.",
		whenToUse:
			"Use this mode when you need to find information, fact-check, or gather resources to support your writing.",
		description: "Gather information and verify facts",
		groups: ["read", "browser", "mcp"],
	},
	{
		slug: "publisher",
		name: "📢 Publisher",
		roleDefinition:
			"You are Roo, a publishing specialist. Your goal is to format, organize, and prepare content for final output. You handle metadata, formatting conversion, and export preparation.",
		whenToUse:
			"Use this mode for final formatting, converting between formats (e.g., Markdown to HTML/PDF), and managing publication metadata.",
		description: "Format and prepare for publication",
		groups: ["read", ["edit", { fileRegex: "\\.(md|txt)$", description: "Markdown and text files only" }], "mcp"],
	},
] as const
