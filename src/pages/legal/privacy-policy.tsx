import { LegalWrapper } from "./legal-wrapper";
import { Shield, EyeOff, HardDrive, MapPin, Globe, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PrivacyPolicyPage() {
	return (
		<LegalWrapper
			activeTab="privacy"
			title="Privacy policy"
			subtitle="MonoWeather is built around strict data minimization and client-side autonomy. We do not track, profile, monetize, or harvest personal data."
			lastUpdated="Revised November 2026"
			docCode="DOC-POL-01"
		>
			{/* Executive Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<EyeOff className="size-4 text-muted-foreground" />
							<span>Zero tracking</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							No tracking scripts, third-party analytics pixels, fingerprinting, or advertising beacons are deployed.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<MapPin className="size-4 text-muted-foreground" />
							<span>Transient location</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Coordinates are processed temporarily in volatile memory only to request weather data, then immediately discarded.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<HardDrive className="size-4 text-muted-foreground" />
							<span>Local storage</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Saved cities, search history, temperature scale, and theme preferences live exclusively in your local browser.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<Shield className="size-4 text-muted-foreground" />
							<span>No user accounts</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							No sign-up forms, passwords, or personal emails are collected. The platform is entirely open and friction-free.
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
						<span>Introduction & Commitment</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Privacy by Design & Data Minimization
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							MonoWeather (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the observatory&rdquo;) was conceived as a privacy-respecting atmospheric telemetry platform. We believe real-time weather information should be accessible without surveillance, profiling, or monetizing user identities.
						</p>
						<p>
							This Privacy Policy outlines how the application operates on your device, what limited information is processed to fetch weather reports, and how your data remains under your absolute control.
						</p>
					</div>
				</section>

				{/* Section 02 */}
				<section className="border border-border bg-card p-6 space-y-4">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">02</span>
						<span>Geographical Coordinates</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Geolocation Data Handling
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							When you open MonoWeather or click the &ldquo;Enable Location&rdquo; / &ldquo;Locate&rdquo; button, your browser requests permission to access your device&apos;s geographic coordinates via the standard W3C Geolocation API (<code className="font-mono text-xs bg-muted px-1.5 py-0.5 border border-border text-foreground">navigator.geolocation</code>).
						</p>
						<div className="border border-border/80 bg-background/50 p-4 font-mono text-xs space-y-2">
							<div className="text-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
								<CheckCircle2 className="size-3.5 text-emerald-500" />
								<span>Strict Geolocation Boundaries</span>
							</div>
							<ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
								<li>Coordinates (<code className="text-foreground">latitude</code> and <code className="text-foreground">longitude</code>) are held only in client memory during the current session.</li>
								<li>Coordinates are never uploaded to any proprietary MonoWeather server, database, or analytics endpoint.</li>
								<li>Coordinates are passed exclusively over encrypted HTTPS to OpenWeatherMap to retrieve current weather, 5-day forecasts, and air pollution measurements.</li>
								<li>Granting geolocation is entirely optional. You may decline location access and search manually for any city worldwide.</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Section 03 */}
				<section className="border border-border bg-card p-6 space-y-4">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">03</span>
						<span>Browser Storage</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Client-Side Persistence (<span className="font-mono text-lg font-normal">window.localStorage</span>)
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							To improve your daily experience, MonoWeather stores a limited set of non-identifiable user preferences locally in your browser&apos;s Web Storage. This data never leaves your device:
						</p>
						<div className="overflow-x-auto border border-border">
							<table className="w-full text-left font-mono text-xs">
								<thead className="bg-muted/40 border-b border-border text-foreground">
									<tr>
										<th className="p-3">Key Identifier</th>
										<th className="p-3">Description & Scope</th>
										<th className="p-3">Storage Location</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border text-muted-foreground">
									<tr>
										<td className="p-3 font-semibold text-foreground">weather_favorites</td>
										<td className="p-3">Your bookmarked cities for fast telemetry access</td>
										<td className="p-3">Client Browser Only</td>
									</tr>
									<tr>
										<td className="p-3 font-semibold text-foreground">weather_history</td>
										<td className="p-3">Recent search queries displayed in the quick search palette</td>
										<td className="p-3">Client Browser Only</td>
									</tr>
									<tr>
										<td className="p-3 font-semibold text-foreground">temperature_unit</td>
										<td className="p-3">Unit selection (Metric Celsius &deg;C / Imperial Fahrenheit &deg;F)</td>
										<td className="p-3">Client Browser Only</td>
									</tr>
									<tr>
										<td className="p-3 font-semibold text-foreground">theme</td>
										<td className="p-3">Visual theme preference (Dark Mode / Light Mode)</td>
										<td className="p-3">Client Browser Only</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>

				{/* Section 04 */}
				<section className="border border-border bg-card p-6 space-y-4">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">04</span>
						<span>Upstream Processors</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Third-Party Services & API Integrations
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							MonoWeather interfaces directly with external meteorological services to fetch atmospheric measurements:
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-xs">
							<div className="border border-border/80 bg-background/50 p-4 space-y-2">
								<div className="flex items-center gap-2 text-foreground font-semibold">
									<Globe className="size-4 text-foreground" />
									<span>OpenWeather API</span>
								</div>
								<p className="text-muted-foreground text-[11px] leading-relaxed">
									Provides real-time meteorological observations, hourly and 5-day forecasts, reverse geocoding, and Air Quality Index (AQI) values. Requests transmit coordinates or city query strings directly to OpenWeather servers under OpenWeather&apos;s privacy policies.
								</p>
							</div>

							<div className="border border-border/80 bg-background/50 p-4 space-y-2">
								<div className="flex items-center gap-2 text-foreground font-semibold">
									<Globe className="size-4 text-foreground" />
									<span>MapLibre & OpenStreetMap</span>
								</div>
								<p className="text-muted-foreground text-[11px] leading-relaxed">
									Interactive weather radar and map visualizers load vector/raster map tiles from public open-source mapping services. Tile requests contain standard HTTP headers (IP address, user agent) standard to web browsing.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Section 05 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">05</span>
						<span>Tracking Technologies</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Zero Cookies & Zero Behavioral Profiling
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							MonoWeather does not set advertising cookies, session cookies, tracking tags, web beacons, or fingerprinting scripts. We do not integrate with data brokers, Facebook Graph, Google Analytics, or marketing automation platforms.
						</p>
						<p>
							Because we do not store tracking cookies, there are no intrusive cookie consent banners or cookie walls on MonoWeather.
						</p>
					</div>
				</section>

				{/* Section 06 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">06</span>
						<span>Data Control & Rights</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Your Rights & How to Delete Your Data
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							Under GDPR, CCPA, and global privacy standards, you maintain absolute sovereignty over your data. Because all preference data is held locally on your device:
						</p>
						<ul className="list-disc list-inside space-y-1.5 font-mono text-xs">
							<li><strong className="text-foreground">Clear Stored Cities:</strong> You can remove individual cities from your favorites list at any time with a single click.</li>
							<li><strong className="text-foreground">Wipe All Preferences:</strong> Clearing your browser&apos;s site data or cache for this domain immediately erases all stored telemetry preferences.</li>
							<li><strong className="text-foreground">Revoke Location:</strong> Click the lock/tune icon in your browser URL bar to revoke geolocation permissions at any moment.</li>
						</ul>
					</div>
				</section>

				{/* Section 07 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">07</span>
						<span>Transport Security</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						HTTPS Encryption & Infrastructure
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<div className="flex items-start gap-3 p-3.5 border border-border/80 bg-background/50 font-mono text-xs">
							<Lock className="size-4 text-emerald-500 shrink-0 mt-0.5" />
							<div>
								<span className="text-foreground font-semibold">TLS 1.3 End-to-End Encryption:</span>
								<p className="text-muted-foreground text-[11px] mt-1">
									All communications between your client browser and API services take place over secure Transport Layer Security (TLS/HTTPS), preventing eavesdropping, man-in-the-middle tampering, or packet interception.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Section 08 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">08</span>
						<span>Children&apos;s Privacy</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						COPPA & Youth Protection
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							MonoWeather is suitable for general audiences and educational meteorological study. We do not intentionally or unintentionally collect personal information from individuals under 13, 16, or any age.
						</p>
					</div>
				</section>

				{/* Section 09 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">09</span>
						<span>Policy Revisions</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Updates to This Privacy Statement
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							We may periodically update this Privacy Policy to reflect architectural upgrades or new non-intrusive features. Revisions will be documented with an updated timestamp at the head of this document. Continued use of the platform after updates indicates consent.
						</p>
					</div>
				</section>
			</div>
		</LegalWrapper>
	);
}
