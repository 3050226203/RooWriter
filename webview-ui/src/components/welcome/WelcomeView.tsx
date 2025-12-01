import { useCallback, useState, useEffect } from "react"
import knuthShuffle from "knuth-shuffle-seeded"
import { Trans } from "react-i18next"
import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import posthog from "posthog-js"

import type { ProviderSettings } from "@roo-code/types"
import { TelemetryEventName } from "@roo-code/types"

import { useExtensionState } from "@src/context/ExtensionStateContext"
import { validateApiConfiguration } from "@src/utils/validate"
import { vscode } from "@src/utils/vscode"
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { getRequestyAuthUrl, getOpenRouterAuthUrl } from "@src/oauth/urls"
import { telemetryClient } from "@src/utils/TelemetryClient"
import { Button } from "@src/components/ui"

import ApiOptions from "../settings/ApiOptions"
import { Tab, TabContent } from "../common/Tab"

import RooHero from "./RooHero"

const WelcomeView = () => {
	const { apiConfiguration, currentApiConfigName, setApiConfiguration, uriScheme, machineId } = useExtensionState()
	const { t } = useAppTranslation()
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
	const [showRooProvider, setShowRooProvider] = useState(false)

	// Check PostHog feature flag for Roo provider
	useEffect(() => {
		posthog.onFeatureFlags(function () {
			setShowRooProvider(posthog?.getFeatureFlag("roo-provider-featured") === "test")
		})
	}, [])

	// Memoize the setApiConfigurationField function to pass to ApiOptions
	const setApiConfigurationFieldForApiOptions = useCallback(
		<K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => {
			setApiConfiguration({ [field]: value })
		},
		[setApiConfiguration], // setApiConfiguration from context is stable
	)

	const handleSubmit = useCallback(() => {
		const error = apiConfiguration ? validateApiConfiguration(apiConfiguration) : undefined

		if (error) {
			setErrorMessage(error)
			return
		}

		setErrorMessage(undefined)
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}, [apiConfiguration, currentApiConfigName])

	// Using a lazy initializer so it reads once at mount
	const [imagesBaseUri] = useState(() => {
		const w = window as any
		return w.IMAGES_BASE_URI || ""
	})

	return (
		<Tab>
			<TabContent className="flex flex-col gap-4 p-6 pt-8">
				<RooHero />
				<h2 className="mt-0 mb-4 text-xl">{t("welcome:greeting")}</h2>

				<div className="text-base text-vscode-foreground py-2 mb-4">
					<p className="mb-3 leading-relaxed">
						<Trans i18nKey="welcome:introduction" />
					</p>
					<p className="mb-0 leading-relaxed">
						{/* <Trans i18nKey="welcome:chooseProvider" /> */}
					</p>
				</div>

				<div className="mb-4">
					{/* Removed LLM Router Recommendation */}
					{/* <p className="text-sm font-medium mt-4 mb-3">{t("welcome:startRouter")}</p> */}

					<div>
						{/* Define the providers */}
						{(() => {
							// Provider card configuration
							const baseProviders: {
								slug: string
								name: string
								description: string
								incentive?: string
								authUrl?: string
							}[] = [
								// Removed default router providers
							]

							// Conditionally add Roo provider based on feature flag
							if (showRooProvider) {
								baseProviders.push({
									slug: "roo",
									name: "RooWriter Cloud",
									description: t("welcome:routers.roo.description"),
									incentive: t("welcome:routers.roo.incentive"),
								})
							}

							return baseProviders.length > 0 ? (
								<div className="flex flex-col gap-3">
									{baseProviders.map((provider) => (
										<button
											key={provider.slug}
											onClick={() => {
												if (provider.slug === "roo") {
													// Set provider to roo-code-cloud
													setApiConfigurationFieldForApiOptions("apiProvider", "roo")
													// Optionally trigger any auth flow here if needed, though Roo provider usually handles it internally or via a different flow
												} else if (provider.authUrl) {
													window.open(provider.authUrl)
												}
											}}
											className="flex flex-col gap-1 p-3 border border-vscode-widget-border rounded hover:bg-vscode-list-hoverBackground text-left group">
											<div className="flex items-center justify-between w-full">
												<span className="font-medium">{provider.name}</span>
												{provider.incentive && (
													<span className="text-xs bg-vscode-badge-background text-vscode-badge-foreground px-1.5 py-0.5 rounded">
														{provider.incentive}
													</span>
												)}
											</div>
											<span className="text-xs text-vscode-descriptionForeground">
												{provider.description}
											</span>
										</button>
									))}
								</div>
							) : null
						})()}
					</div>
				</div>

				<div className="mt-2">
					{/* Updated text to be more direct since we removed the "Or..." phrasing */}
					<p className="text-sm font-medium mb-3">{t("welcome:chooseProvider")}</p>
					<ApiOptions
						fromWelcomeView
						apiConfiguration={apiConfiguration || {}}
						uriScheme={uriScheme}
						setApiConfigurationField={setApiConfigurationFieldForApiOptions}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				</div>
			</TabContent>
			<div className="sticky bottom-0 bg-vscode-sideBar-background p-4 border-t border-vscode-panel-border">
				<div className="flex flex-col gap-2">
					<div className="flex justify-end">
						<VSCodeLink
							href="#"
							onClick={(e) => {
								e.preventDefault()
								vscode.postMessage({ type: "importSettings" })
							}}
							className="text-sm">
							{t("welcome:importSettings")}
						</VSCodeLink>
					</div>
					<Button onClick={handleSubmit} variant="primary">
						{t("welcome:start")}
					</Button>
				</div>
			</div>
		</Tab>
	)
}

export default WelcomeView

