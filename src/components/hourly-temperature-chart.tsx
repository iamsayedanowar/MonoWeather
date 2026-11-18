import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";

export interface ChartDataPoint {
	time: string;
	fullTime: string;
	date: string;
	dayName?: string;
	shortDate: string;
	temp: number;
	feels_like: number;
	humidity: number;
	pop: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust: number;
	visibility: number;
	wet_bulb: number;
	pressure: number;
	clouds: number;
	icon: string;
	description: string;
}

export type TabId = "temperature" | "wind" | "humidity" | "pressure" | "clouds" | "visibility" | "wet_bulb";

export interface ActiveTabConfig {
	id: TabId;
	label: string;
	unitLabel: string;
	dataKey: keyof ChartDataPoint;
	formatter: (val: number) => string;
}

interface HourlyTemperatureChartProps {
	displayData: ChartDataPoint[];
	activeConfig: ActiveTabConfig;
	xTicks: string[];
	formatXTick: (fullTime: string) => string;
}

export function HourlyTemperatureChart({
	displayData,
	activeConfig,
	xTicks,
	formatXTick,
}: HourlyTemperatureChartProps) {
	return (
		<div className="h-44 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={displayData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
					<defs>
						<linearGradient id="monochromeGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.20} />
							<stop offset="95%" stopColor="var(--foreground)" stopOpacity={0.0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="2 2" stroke="var(--border)" vertical={false} />
					<XAxis
						dataKey="fullTime"
						ticks={xTicks}
						tickFormatter={formatXTick}
						stroke="var(--muted-foreground)"
						fontSize={10}
						tickLine={false}
						axisLine={{ stroke: "var(--border)" }}
					/>
					<YAxis
						stroke="var(--muted-foreground)"
						fontSize={10}
						tickLine={false}
						axisLine={false}
						domain={["auto", "auto"]}
					/>
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const pt = payload[0].payload as ChartDataPoint;
								return (
									<div className="border border-border bg-card p-2.5 rounded-md font-mono text-xs space-y-1">
										<p className="font-medium text-foreground">{pt.fullTime}</p>
										<p className="text-muted-foreground capitalize">{pt.description}</p>
										<div className="pt-1 border-t border-border/60 flex items-center justify-between gap-4">
											<span className="text-muted-foreground">{activeConfig.label}:</span>
											<span className="text-foreground font-semibold">
												{activeConfig.formatter(pt[activeConfig.dataKey] as number)}
											</span>
										</div>
										{pt.pop > 0 && (
											<div className="flex items-center justify-between gap-4 text-[10px]">
												<span className="text-muted-foreground">Precipitation:</span>
												<span className="text-foreground font-medium">{pt.pop}%</span>
											</div>
										)}
									</div>
								);
							}
							return null;
						}}
					/>
					<Area
						type="monotone"
						dataKey={activeConfig.dataKey}
						stroke="var(--foreground)"
						strokeWidth={1.5}
						fill="url(#monochromeGradient)"
						dot={false}
						activeDot={{ r: 4, stroke: "var(--background)", strokeWidth: 2, fill: "var(--foreground)" }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
