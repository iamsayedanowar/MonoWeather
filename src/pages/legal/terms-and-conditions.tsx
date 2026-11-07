import { LegalWrapper } from "./legal-wrapper";
import { FileCheck, Ban, ShieldAlert, Award, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TermsAndConditionsPage() {
	return (
		<LegalWrapper
			activeTab="terms"
			title="Terms of service"
			subtitle="These Terms of Service govern your access to and use of MonoWeather. Please read them thoroughly."
			lastUpdated="Revised November 2026"
			docCode="DOC-TOS-02"
		>
			{/* Executive Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<FileCheck className="size-4 text-muted-foreground" />
							<span>Free license</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Granted for personal, educational, and non-commercial meteorological monitoring.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<Ban className="size-4 text-muted-foreground" />
							<span>No abuse or flooding</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Automated scraping, denial of service, API key extraction, and proxy attacks are strictly prohibited.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<Award className="size-4 text-muted-foreground" />
							<span>Intellectual property</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Frontend code and visual designs created by Sayed Anowar; weather data belongs to providers.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<Layers className="size-4 text-muted-foreground" />
							<span>External feeds</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Uptime and accuracy rely on third-party meteorological nodes, which may experience intermittent latency.
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Legal Clauses */}
			<div className="space-y-6">
				{/* Section 01 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">01</span>
						<span>Agreement to Terms</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Binding Legal Agreement
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							By accessing, browsing, or utilizing MonoWeather (the &ldquo;Service&rdquo;, &ldquo;Application&rdquo;, or &ldquo;Observatory&rdquo;), you acknowledge that you have read, understood, and agree to comply with and be legally bound by these Terms and Conditions.
						</p>
						<p>
							If you do not agree with any part of these terms, you must discontinue your use of the application immediately.
						</p>
					</div>
				</section>

				{/* Section 02 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">02</span>
						<span>Grant of License</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Permitted Use & Limited License
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							Subject to these Terms, you are granted a worldwide, non-exclusive, non-sublicensable, revocable license to access and interact with the application for:
						</p>
						<ul className="list-disc list-inside space-y-1.5 font-mono text-xs">
							<li>Personal, individual atmospheric observation and forecast checking;</li>
							<li>Educational, academic, and non-commercial research demonstrations;</li>
							<li>Displaying public weather and air quality conditions on personal devices.</li>
						</ul>
						<p>
							Any commercial resale, programmatic redistributions of live feeds without authorization, or sub-licensing of the platform interface is strictly prohibited.
						</p>
					</div>
				</section>

				{/* Section 03 */}
				<section className="border border-border bg-card p-6 space-y-4">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">03</span>
						<span>Acceptable Conduct</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Prohibited Activities & System Integrity
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							To protect the reliability and accessibility of the observatory for all users, you expressly agree NOT to:
						</p>
						<div className="border border-destructive/30 bg-destructive/5 p-4 font-mono text-xs space-y-2">
							<div className="text-destructive font-semibold uppercase tracking-wider flex items-center gap-1.5">
								<ShieldAlert className="size-3.5" />
								<span>Strict Prohibitions</span>
							</div>
							<ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
								<li>Attempt to extract, decompile, or spoof API authentication keys or upstream tokens.</li>
								<li>Deploy automated scrapers, web spiders, or crawlers that generate excessive request volume against the weather endpoints.</li>
								<li>Launch denial of service (DoS/DDoS) floods or execute unauthorized load tests.</li>
								<li>Frame, mirror, or republish the application interface to deceive third parties or masquerade as an official governmental emergency warning system.</li>
								<li>Inject malicious code, cross-site scripts, or payload modifications into the client environment.</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Section 04 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">04</span>
						<span>Intellectual Property</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Ownership & Attribution
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							The MonoWeather name, visual brand identity, bespoke UI components, telemetry dashboards, charts, and layout architecture are developed by and are the intellectual property of <strong className="text-foreground">Sayed Anowar</strong>.
						</p>
						<p>
							All upstream meteorological data feeds, radar tiles, and atmospheric calculation models are the property of OpenWeatherMap, OpenStreetMap contributors, and respective original data custodians.
						</p>
					</div>
				</section>

				{/* Section 05 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">05</span>
						<span>Third-Party Feeds</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						External APIs & Network Availability
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							MonoWeather functions as an integration layer over external weather APIs and mapping tile servers. We do not operate meteorological satellites or ground weather stations directly.
						</p>
						<p>
							Consequently, we do not warrant that external telemetry streams will be uninterrupted, continuous, timely, or completely error-free. Upstream outages, satellite sensor recalibrations, or maintenance windows may cause momentary disruptions beyond our control.
						</p>
					</div>
				</section>

				{/* Section 06 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">06</span>
						<span>Modifications</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Modifications to the Service & Terms
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							We reserve the right to revise, enhance, temporarily suspend, or discontinue any aspect of the application, features, or design at any time without prior liability.
						</p>
						<p>
							These Terms may be revised occasionally. When revisions occur, the updated effective date will be posted at the top of this page. Your continued use constitutes acceptance of revised terms.
						</p>
					</div>
				</section>

				{/* Section 07 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">07</span>
						<span>Indemnity & Disclaimers</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Indemnification & Non-Liability
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							You agree to defend, indemnify, and hold harmless Sayed Anowar, MonoWeather, and associated contributors from any claims, damages, liabilities, costs, or expenses arising from your violation of these Terms or your misuse of the platform.
						</p>
						<p>
							Please refer to our dedicated <a href="/disclaimer" className="text-foreground font-semibold hover:underline">Disclaimer</a> page for comprehensive limitations on warranties and liability.
						</p>
					</div>
				</section>

				{/* Section 08 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">08</span>
						<span>Legal Jurisdiction</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Severability & Governing Law
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							If any provision of these Terms is deemed unlawful or unenforceable by a court of competent jurisdiction, that provision shall be enforced to the maximum extent permissible, and the remaining provisions shall continue in full legal force.
						</p>
					</div>
				</section>
			</div>
		</LegalWrapper>
	);
}
