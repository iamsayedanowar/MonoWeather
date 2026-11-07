import { LegalWrapper } from "./legal-wrapper";
import { AlertTriangle, ShieldX, Activity, Compass, Wind, AlertOctagon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function DisclaimerPage() {
	return (
		<LegalWrapper
			activeTab="disclaimer"
			title="Legal & safety disclaimer"
			subtitle="Important notices regarding atmospheric data reliability, safety-of-life restrictions, sensor latency, and limitation of liability."
			lastUpdated="Revised November 2026"
			docCode="DOC-DISC-03"
		>
			{/* High-Visibility Emergency Safety Callout */}
			<Alert variant="destructive" className="border-destructive/60 bg-destructive/10 text-foreground p-5 rounded-lg">
				<AlertOctagon className="size-5 text-destructive" />
				<div>
					<AlertTitle className="font-mono text-xs font-semibold text-destructive flex items-center gap-2">
						Critical safety notice · Not for emergency decision making
					</AlertTitle>
					<AlertDescription className="text-xs sm:text-sm text-foreground/90 mt-1.5 leading-relaxed">
						MonoWeather is an independent meteorological dashboard intended solely for general informational and educational purposes. Under no circumstances should this platform be used for marine navigation, aviation routing, severe weather evacuation planning, or emergency safety-of-life decisions. Always monitor your national meteorological authority (such as NOAA/NWS, UK Met Office, IMD, or local civil protection authorities) during severe storms, cyclones, floods, or natural disasters.
					</AlertDescription>
				</div>
			</Alert>

			{/* Executive Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<Compass className="size-4 text-muted-foreground" />
							<span>Informational only</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							All telemetry and charts are provided for personal curiosity, study, and daily planning convenience.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<ShieldX className="size-4 text-muted-foreground" />
							<span>No warranties</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Delivered strictly &ldquo;as is&rdquo; without guarantees of uninterrupted uptime, accuracy, or real-time precision.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50 rounded-lg">
					<CardContent className="p-4 space-y-1.5 font-mono">
						<div className="flex items-center gap-2 text-foreground font-medium text-xs">
							<Wind className="size-4 text-muted-foreground" />
							<span>Sensor latency</span>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Meteorological conditions can shift rapidly. Client caching and satellite update cycles may cause variance.
						</p>
					</CardContent>
				</Card>

				<Card className="border border-border bg-card/50">
					<CardContent className="p-4 space-y-2 font-mono">
						<div className="flex items-center gap-2 text-foreground font-semibold text-xs">
							<Activity className="size-4 text-amber-500" />
							<span>NO MEDICAL ADVICE</span>
						</div>
						<p className="text-[11px] text-muted-foreground leading-relaxed">
							Air Quality Index (AQI) values are regional estimates and do not substitute for formal clinical health counsel.
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
						<span>General Scope</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Informational & Educational Purpose
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							The information, metrics, visualizations, and predictions displayed on MonoWeather are provided exclusively for general informational, educational, and personal convenience purposes.
						</p>
						<p>
							While we endeavor to integrate robust third-party feeds and present clean data models, atmospheric dynamics are inherently chaotic. We make no representations or warranties regarding the completeness, suitability, or correctness of any data rendered on the site.
						</p>
					</div>
				</section>

				{/* Section 02 */}
				<section className="border border-border bg-card p-6 space-y-4">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">02</span>
						<span>Severe Weather & Life Safety</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Exclusion from Safety-of-Life & Critical Missions
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							You expressly acknowledge and agree that MonoWeather is <strong className="text-foreground">NOT</strong> a certified meteorological dispatch system or governmental alerting network.
						</p>
						<div className="border border-border/80 bg-background/50 p-4 font-mono text-xs space-y-2">
							<div className="text-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
								<AlertTriangle className="size-3.5 text-amber-500" />
								<span>Prohibited Critical Use Cases</span>
							</div>
							<ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
								<li>Aviation navigation, flight planning, takeoff/landing clearances, or drone operations.</li>
								<li>Marine navigation, commercial vessel pilotage, or offshore sailing in open ocean.</li>
								<li>Hazardous weather evacuations, hurricane path projections, or tornado shelter protocols.</li>
								<li>Search and rescue operations or active civil defense emergency deployments.</li>
							</ul>
						</div>
						<p>
							During impending catastrophic weather events, always tune into local emergency broadcasts, NOAA Weather Radio, or state civil defense portals.
						</p>
					</div>
				</section>

				{/* Section 03 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">03</span>
						<span>Warranties</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						&ldquo;As Is&rdquo; and &ldquo;As Available&rdquo; Disclaimer
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							THE SERVICE AND ALL METEOROLOGICAL TELEMETRY, CHARTS, MAPS, AND CONTENT ARE PROVIDED STRICTLY ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
						</p>
						<p>
							TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THE CREATOR AND CONTRIBUTORS EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
						</p>
						<ul className="list-disc list-inside space-y-1 font-mono text-xs">
							<li>IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE;</li>
							<li>WARRANTIES OF ACCURACY, RELIABILITY, CURRENTNESS, OR CONTINUOUS UPTIME;</li>
							<li>WARRANTIES THAT DEFECTS WILL BE DETECTED OR CORRECTED IMMEDIATELY;</li>
							<li>FREEDOM FROM SERVICE LATENCIES OR THIRD-PARTY API RATE LIMIT INTERRUPTIONS.</li>
						</ul>
					</div>
				</section>

				{/* Section 04 */}
				<section className="border border-border bg-card p-6 space-y-4">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">04</span>
						<span>Data Mechanics</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Latency, Caching & Microclimate Variances
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							Meteorological metrics displayed on this site reflect readings from automated stations, interpolation algorithms, and numerical weather prediction (NWP) models:
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
							<div className="border border-border/70 bg-background/50 p-3 space-y-1">
								<span className="text-foreground font-semibold">5-Minute Client Cache:</span>
								<p className="text-muted-foreground text-[11px]">
									To prevent wasteful network load, queries are cached on the client for 5 minutes. Sudden microbursts or squalls may occur before the cache expires.
								</p>
							</div>
							<div className="border border-border/70 bg-background/50 p-3 space-y-1">
								<span className="text-foreground font-semibold">Station Distance:</span>
								<p className="text-muted-foreground text-[11px]">
									Weather stations may be located at airports or regional hubs several miles from your exact street address, producing slight localized variances.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Section 05 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">05</span>
						<span>Health & Air Quality</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Air Quality Index (AQI) Medical Disclaimer
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							The Air Quality Index (AQI) readings, particulate matter measurements (PM2.5, PM10), and chemical levels (O3, NO2, SO2, CO) provided on MonoWeather are regional estimates derived from mathematical models and sensor networks.
						</p>
						<p>
							These metrics are <strong className="text-foreground">NOT clinical medical recommendations</strong>. Individuals with asthma, chronic obstructive pulmonary disease (COPD), heart conditions, elderly adults, or pregnant persons should consult qualified physicians and follow official public health advisories rather than relying solely on third-party web readings.
						</p>
					</div>
				</section>

				{/* Section 06 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">06</span>
						<span>Liability</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Limitation of Liability
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							UNDER NO CIRCUMSTANCES SHALL SAYED ANOWAR, MonoWeather, HOSTING PROVIDERS, OR DATA LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING PROPERTY DAMAGE, PERSONAL INJURY, LOST BUSINESS, REVENUE LOSS, OR MISSED TRAVEL CONNECTIONS) ARISING FROM OR CONNECTED WITH:
						</p>
						<ul className="list-disc list-inside space-y-1 font-mono text-xs">
							<li>The use of or inability to access the platform;</li>
							<li>Inaccuracies, omissions, delays, or errors in weather forecasts or radar tiles;</li>
							<li>Decisions made, trips taken, or outdoor activities scheduled based on displayed weather models.</li>
						</ul>
					</div>
				</section>

				{/* Section 07 */}
				<section className="border border-border bg-card p-6 space-y-3">
					<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
						<span className="px-1.5 py-0.5 border border-border bg-muted/40 text-foreground font-semibold">07</span>
						<span>External Resources</span>
					</div>
					<h2 className="text-xl font-semibold tracking-tight text-foreground">
						Third-Party Outbound Links
					</h2>
					<div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
						<p>
							MonoWeather may contain links to external sites (such as OpenWeather, MapLibre, GitHub, or personal portfolios). These external sites are owned and maintained by independent third parties. We do not endorse, monitor, or assume any responsibility for the content, privacy practices, or accuracy of third-party platforms.
						</p>
					</div>
				</section>
			</div>
		</LegalWrapper>
	);
}
