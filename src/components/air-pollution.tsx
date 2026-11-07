import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { AirPollutionData } from "@/api/types";
import { AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

interface AirPollutionProps {
	data: AirPollutionData;
}

interface AqiTier {
	index: number;
	label: string;
	status: string;
	description: string;
	healthRecommendation: string;
}

const aqiTiers: AqiTier[] = [
	{
		index: 1,
		label: "Good",
		status: "Optimal",
		description: "Good air quality. Little to no health risk.",
		healthRecommendation: "Ideal for outdoor activities and fresh air.",
	},
	{
		index: 2,
		label: "Fair",
		status: "Acceptable",
		description: "Acceptable air quality. Minor risk for sensitive people.",
		healthRecommendation: "Safe for most outdoor activities. Sensitive people should monitor symptoms.",
	},
	{
		index: 3,
		label: "Moderate",
		status: "Advisory",
		description: "Sensitive people may experience breathing discomfort.",
		healthRecommendation: "Sensitive individuals should limit heavy outdoor activity.",
	},
	{
		index: 4,
		label: "Poor",
		status: "Unhealthy",
		description: "Everyone may experience discomfort. Sensitive groups face higher risks.",
		healthRecommendation: "Avoid outdoor exercise and keep windows closed.",
	},
	{
		index: 5,
		label: "Very poor",
		status: "Hazardous",
		description: "Severe health risk. Everyone may experience health effects.",
		healthRecommendation: "Stay indoors with windows closed and run an air purifier.",
	},
];

interface PollutantMeta {
	symbol: ReactNode;
	name: string;
	key: "co" | "no" | "no2" | "o3" | "so2" | "pm2_5" | "pm10" | "nh3";
	whoLimit: number;
	unit: string;
}

const pollutantMetas: PollutantMeta[] = [
	{
		symbol: (
			<>
				PM<sub className="font-open-sans">2.5</sub>
			</>
		),
		name: "Fine Dust",
		key: "pm2_5",
		whoLimit: 25,
		unit: "µg/m³",
	},
	{
		symbol: (
			<>
				PM<sub className="font-open-sans">10</sub>
			</>
		),
		name: "Coarse Dust",
		key: "pm10",
		whoLimit: 50,
		unit: "µg/m³",
	},
	{
		symbol: (
			<>
				NO<sub className="font-open-sans">2</sub>
			</>
		),
		name: "Nitrogen Dioxide",
		key: "no2",
		whoLimit: 40,
		unit: "µg/m³",
	},
	{
		symbol: (
			<>
				O<sub className="font-open-sans">3</sub>
			</>
		),
		name: "Surface Ozone",
		key: "o3",
		whoLimit: 100,
		unit: "µg/m³",
	},
	{
		symbol: (
			<>
				SO<sub className="font-open-sans">2</sub>
			</>
		),
		name: "Sulfur Dioxide",
		key: "so2",
		whoLimit: 40,
		unit: "µg/m³",
	},
	{ symbol: "CO", name: "Carbon Monoxide", key: "co", whoLimit: 4000, unit: "µg/m³" },
	{ symbol: "NO", name: "Nitric Oxide", key: "no", whoLimit: 50, unit: "µg/m³" },
	{
		symbol: (
			<>
				NH<sub className="font-open-sans">3</sub>
			</>
		),
		name: "Ammonia",
		key: "nh3",
		whoLimit: 100,
		unit: "µg/m³",
	},
];

export function AirPollution({ data }: AirPollutionProps) {
	const aqi = data.list[0].main.aqi;
	const currentTier = aqiTiers.find((t) => t.index === aqi) || aqiTiers[0];
	const components = data.list[0].components;

	const getRatioTier = (val: number, limit: number) => {
		const ratio = val / limit;
		if (ratio <= 0.6) return { badge: "Safe", variant: "bg-muted text-muted-foreground" };
		if (ratio <= 1.0) return { badge: "Moderate", variant: "bg-secondary text-foreground" };
		if (ratio <= 1.5) return { badge: "High", variant: "bg-primary text-primary-foreground font-medium" };
		return { badge: "Alert", variant: "bg-destructive text-destructive-foreground font-semibold" };
	};

	return (
		<Card className="w-full border-border bg-card rounded-lg">
			<CardHeader className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="space-y-0.5">
					<CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
						Air quality
					</CardTitle>
					<p className="font-mono text-xs text-muted-foreground">
						Live pollutant telemetry and safety ratings
					</p>
				</div>
				<div className="flex items-center gap-1.5 font-mono text-xs">
					<span className="text-muted-foreground">Standard:</span>
					<span className="px-2 py-0.5 border border-border bg-muted/40 font-medium text-foreground rounded">
						WHO / CAQI
					</span>
				</div>
			</CardHeader>

			<CardContent className="p-4 sm:p-5 space-y-6">
				{/* Top Status Banner */}
				<div className="flex flex-col md:flex-row border border-border bg-card/60 rounded-lg overflow-hidden">
					{/* AQI Score Indicator */}
					<div className="flex flex-col items-center justify-center p-6 md:p-5 md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border space-y-1.5 text-center bg-muted/20">
						<span className="font-mono text-xs text-muted-foreground">
							AQI score
						</span>
						<span className="font-mono text-5xl font-semibold tracking-tight text-foreground">
							{aqi}
							<span className="text-sm font-normal text-muted-foreground font-sans"> / 5</span>
						</span>
						<div className="inline-flex px-2 py-0.5 border border-border bg-card text-xs font-mono font-medium text-foreground rounded">
							{currentTier.label}
						</div>
					</div>

					{/* Qualitative Summary & Guidelines */}
					<div className="flex-1 flex flex-col justify-between p-4 sm:p-5 space-y-4">
						<div className="space-y-1.5">
							<div className="flex items-center gap-2">
								{aqi <= 2 ? (
									<CheckCircle2 className="size-4 text-emerald-500" />
								) : (
									<ShieldAlert className="size-4 text-amber-500" />
								)}
								<h3 className="font-medium text-sm text-foreground tracking-tight">
									Air quality: {currentTier.status}
								</h3>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								{currentTier.description}
							</p>
							<p className="text-xs text-foreground font-mono bg-muted/30 p-2.5 border border-border/80 flex items-center gap-2 rounded">
								<AlertCircle className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
								<span>{currentTier.healthRecommendation}</span>
							</p>
						</div>

						{/* Segmented 5-Tier Spectrum */}
						<div className="space-y-1.5 pt-1">
							<div className="grid grid-cols-5 gap-1 sm:gap-2">
								{aqiTiers.map((tier) => {
									const isActive = tier.index === aqi;
									const isFilled = tier.index <= aqi;

									return (
										<div key={tier.index} className="flex flex-col items-center">
											{/* Bar segment */}
											<div className="h-2.5 flex items-center w-full">
												<div
													className={`w-full transition-all rounded-sm border border-border/80 ${isFilled ? "bg-foreground" : "bg-muted/40"
														} ${isActive ? "h-2.5 ring-1 ring-foreground" : "h-1.5"}`}
													title={`${tier.label}: Level ${tier.index}`}
												/>
											</div>

											{/* Tier label */}
											<div
												className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 font-mono text-[10px] pt-1.5 text-center w-full transition-colors ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"
													}`}
											>
												<span>{tier.index}</span>
												<span className="hidden sm:inline">•</span>
												<span className="leading-tight sm:leading-none truncate max-w-full">
													{tier.label}
												</span>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				{/* 8 Chemical Gas & Particulate Sensors Grid */}
				<div className="space-y-2.5">
					<div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
						<span>Pollutant concentrations</span>
						<span>Values in µg/m³</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
						{pollutantMetas.map((meta) => {
							const val = components[meta.key] || 0;
							const ratio = val / meta.whoLimit;
							const percent = Math.min(Math.round(ratio * 100), 100);
							const { badge, variant } = getRatioTier(val, meta.whoLimit);

							return (
								<div
									key={meta.key}
									className="flex flex-col justify-between p-3.5 border border-border bg-card/60 hover:bg-muted/20 transition-colors rounded-lg space-y-3"
								>
									{/* Symbol & Name */}
									<div className="flex items-start justify-between">
										<div>
											<span className="font-mono text-sm font-semibold text-foreground">
												{meta.symbol}
											</span>
											<p className="text-xs text-muted-foreground line-clamp-1">
												{meta.name}
											</p>
										</div>
										<span className={`font-mono text-[10px] px-1.5 py-0.5 border border-border/80 rounded ${variant}`}>
											{badge}
										</span>
									</div>

									{/* Measured Value */}
									<div className="space-y-1.5">
										<div className="flex items-baseline justify-between font-mono">
											<span className="text-lg font-semibold tracking-tight text-foreground">
												{val.toFixed(1)}
											</span>
											<span className="text-[10px] text-muted-foreground">
												Limit: {meta.whoLimit} {meta.unit}
											</span>
										</div>

										{/* Safety threshold progress line */}
										<div className="h-1 w-full bg-muted/60 border border-border/60 rounded-full overflow-hidden">
											<div
												className={`h-full rounded-full ${percent > 100
													? "bg-destructive"
													: percent > 60
														? "bg-foreground"
														: "bg-muted-foreground"
													}`}
												style={{ width: `${percent}%` }}
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
