import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { useTemperature } from "@/context/temperature-provider";
import {
	Navigation2,
	Droplets,
	Gauge,
	Eye,
	Thermometer,
	Cloud,
	LineChart as LineChartIcon,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { WeatherIcon } from "./weather-icon";
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";

const calculateWetBulb = (T: number, RH: number): number => {
	return (
		T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
		Math.atan(T + RH) -
		Math.atan(RH - 1.676331) +
		0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
		4.686035
	);
};

interface HourlyTemperatureProps {
	data: ForecastData;
}

interface ChartDataPoint {
	time: string;
	fullTime: string;
	date: string;
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

type TabId = "temperature" | "wind" | "humidity" | "pressure" | "clouds" | "visibility" | "wet_bulb";

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
	const { getChartTemp, unit } = useTemperature();
	const [activeTab, setActiveTab] = useState<TabId>("temperature");
	const [showChart, setShowChart] = useState<boolean>(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const tabsRef = useRef<HTMLDivElement>(null);

	// Reset cards scroll position to the beginning when active tab or forecast data changes
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({ left: 0, behavior: "instant" });
			scrollRef.current.scrollLeft = 0;
		}
	}, [activeTab, data]);

	const handleTabChange = (tabId: TabId) => {
		setActiveTab(tabId);
		if (scrollRef.current) {
			scrollRef.current.scrollTo({ left: 0, behavior: "instant" });
			scrollRef.current.scrollLeft = 0;
		}
	};

	// Wheel horizontal scroll handler for forecast scrub deck
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const handleWheel = (e: WheelEvent) => {
			if (e.deltaY !== 0) {
				const maxScroll = el.scrollWidth - el.clientWidth;
				if (maxScroll > 0) {
					if (
						(e.deltaY > 0 && el.scrollLeft < maxScroll) ||
						(e.deltaY < 0 && el.scrollLeft > 0)
					) {
						e.preventDefault();
						el.scrollLeft += e.deltaY;
					}
				}
			}
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, []);

	// Wheel horizontal scroll handler for metric tabs
	useEffect(() => {
		const el = tabsRef.current;
		if (!el) return;

		const handleWheel = (e: WheelEvent) => {
			if (e.deltaY !== 0) {
				const maxScroll = el.scrollWidth - el.clientWidth;
				if (maxScroll > 0) {
					if (
						(e.deltaY > 0 && el.scrollLeft < maxScroll) ||
						(e.deltaY < 0 && el.scrollLeft > 0)
					) {
						e.preventDefault();
						el.scrollLeft += e.deltaY;
					}
				}
			}
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, []);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const offset = direction === "left" ? -320 : 320;
			scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
		}
	};

	const getWindDirection = (degree: number) => {
		const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
		const index = Math.round(((degree % 360) + 360) % 360 / 22.5);
		return directions[index % 16];
	};

	const chartData: ChartDataPoint[] = data.list.map((item) => {
		const date = new Date(item.dt * 1000);
		return {
			time: format(date, "HH:mm"),
			fullTime: format(date, "MMM d, HH:mm"),
			date: format(date, "d MMM"),
			temp: Math.round(getChartTemp(item.main.temp)),
			feels_like: Math.round(getChartTemp(item.main.feels_like)),
			humidity: item.main.humidity,
			pop: Math.round(item.pop * 100),
			wind_speed: Number((item.wind.speed * 3.6).toFixed(1)),
			wind_gust: Number(((item.wind.gust || item.wind.speed) * 3.6).toFixed(1)),
			wind_deg: item.wind.deg,
			visibility: Number((item.visibility / 1000).toFixed(1)),
			wet_bulb: Math.round(getChartTemp(calculateWetBulb(item.main.temp, item.main.humidity))),
			pressure: item.main.pressure,
			clouds: item.clouds.all,
			icon: item.weather[0].icon,
			description: item.weather[0].description,
		};
	});

	const tabConfigs: { id: TabId; label: string; unitLabel: string; dataKey: keyof ChartDataPoint; formatter: (v: number) => string; }[] = [
		{ id: "temperature", label: "Temperature", unitLabel: `°${unit}`, dataKey: "temp", formatter: (val) => `${val}°` },
		{ id: "wind", label: "Wind", unitLabel: "km/h", dataKey: "wind_speed", formatter: (val) => `${val} km/h` },
		{ id: "humidity", label: "Humidity", unitLabel: "%", dataKey: "humidity", formatter: (val) => `${val}%` },
		{ id: "pressure", label: "Pressure", unitLabel: "hPa", dataKey: "pressure", formatter: (val) => `${val} hPa` },
		{ id: "clouds", label: "Clouds", unitLabel: "%", dataKey: "clouds", formatter: (val) => `${val}%` },
		{ id: "visibility", label: "Visibility", unitLabel: "km", dataKey: "visibility", formatter: (val) => `${val} km` },
		{ id: "wet_bulb", label: "Heat Index", unitLabel: `°${unit}`, dataKey: "wet_bulb", formatter: (val) => `${val}°` },
	];

	const activeConfig = tabConfigs.find((c) => c.id === activeTab) || tabConfigs[0];

	const renderIcon = (tab: TabId, item: ChartDataPoint) => {
		switch (tab) {
			case "temperature":
				return <WeatherIcon iconCode={item.icon} className="size-8 object-contain" />;
			case "wind":
				return (
					<Navigation2
						className="size-5 text-foreground transition-transform"
						style={{ transform: `rotate(${item.wind_deg}deg)` }}
					/>
				);
			case "humidity":
				return <Droplets className="size-5 text-foreground" />;
			case "pressure":
				return <Gauge className="size-5 text-foreground" />;
			case "visibility":
				return <Eye className="size-5 text-foreground" />;
			case "wet_bulb":
				return <Thermometer className="size-5 text-foreground" />;
			case "clouds":
				return <Cloud className="size-5 text-foreground" />;
			default:
				return null;
		}
	};

	return (
		<Card className="w-full flex-1 min-w-0 border-border bg-card rounded-lg">
			<CardHeader className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="space-y-0.5">
					<CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
						Hourly forecast
					</CardTitle>
					<p className="font-mono text-xs text-muted-foreground">
						5-day outlook in 3-hour intervals
					</p>
				</div>

				{/* Chart Toggle & Scroll Buttons */}
				<div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
					<button
						type="button"
						onClick={() => setShowChart((v) => !v)}
						className={`h-8 px-3 text-xs font-mono border border-border flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-md w-full sm:w-auto ${showChart
							? "bg-secondary text-foreground font-medium"
							: "bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/60"
							}`}
						title="Toggle Forecast Chart"
					>
						<LineChartIcon className="size-3.5" />
						<span>{showChart ? "Hide chart" : "View chart"}</span>
					</button>

					<div className="flex items-center h-8 border border-border rounded-md w-full sm:w-auto overflow-hidden">
						<button
							type="button"
							onClick={() => scroll("left")}
							className="flex-1 sm:w-7 h-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
							aria-label="Scroll left"
						>
							<ChevronLeft className="size-3.5" />
						</button>
						<div className="h-4 w-px bg-border/60 shrink-0" />
						<button
							type="button"
							onClick={() => scroll("right")}
							className="flex-1 sm:w-7 h-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
							aria-label="Scroll right"
						>
							<ChevronRight className="size-3.5" />
						</button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-4 sm:p-5 pt-0 sm:pt-0 space-y-4">
				{/* Telemetry Metric Filter Tabs */}
				<div
					ref={tabsRef}
					className="flex gap-1.5 overflow-x-auto pt-2 pb-2 scrollbar-hide border-b border-border/60 touch-pan-x"
				>
					{tabConfigs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => handleTabChange(tab.id)}
							className={`px-3 py-1 text-xs font-mono whitespace-nowrap transition-colors cursor-pointer border rounded-md ${activeTab === tab.id
								? "bg-secondary text-foreground border-border font-medium"
								: "bg-background text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/60"
								}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Synoptic Area Chart */}
				{showChart && (
					<div className="border border-border bg-card/60 p-3 pt-4 rounded-lg">
						<div className="flex items-center justify-between font-mono text-xs text-muted-foreground px-2 mb-2">
							<span>{activeConfig.label} trend ({activeConfig.unitLabel})</span>
							<span>5-day outlook</span>
						</div>
						<div className="h-44 w-full">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
									<defs>
										<linearGradient id="monochromeGradient" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.20} />
											<stop offset="95%" stopColor="var(--foreground)" stopOpacity={0.0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="2 2" stroke="var(--border)" vertical={false} />
									<XAxis
										dataKey="time"
										stroke="var(--muted-foreground)"
										fontSize={10}
										tickLine={false}
										axisLine={{ stroke: "var(--border)" }}
										interval={3}
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
					</div>
				)}

				{/* 3-Hour Interval Scrub Deck */}
				<div
					ref={scrollRef}
					className="flex gap-2.5 overflow-x-auto scrollbar-hide w-full snap-x"
				>
					{chartData.map((item, i) => (
						<div
							key={i}
							className="flex flex-col items-center justify-between gap-3 p-3 border border-border bg-card hover:bg-muted/30 transition-colors shrink-0 min-w-[108px] snap-center rounded-lg"
						>
							{/* Header: Date & Time */}
							<div className="flex flex-col items-center gap-0.5 w-full border-b border-border/60 pb-2">
								<span className="font-mono text-[11px] text-muted-foreground">
									{item.date}
								</span>
								<span className="font-mono text-xs font-semibold text-foreground">
									{item.time}
								</span>
							</div>

							{/* Center: Condition & Metric Icon */}
							<div className="flex flex-col items-center gap-1.5 py-1">
								<div className="flex items-center justify-center size-8">
									{renderIcon(activeTab, item)}
								</div>
								{item.pop > 0 && (
									<span className="font-mono text-[10px] px-1.5 py-0.2 border border-border/60 bg-muted/40 text-foreground rounded">
										{item.pop}% rain
									</span>
								)}
							</div>

							{/* Footer: Value & Sub-reading */}
							<div className="flex flex-col items-center gap-0.5 w-full border-t border-border/60 pt-2 text-center">
								<span className="font-mono text-sm font-semibold text-foreground">
									{activeConfig.formatter(item[activeConfig.dataKey] as number)}
								</span>
								{activeTab === "temperature" && (
									<span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
										Feels {item.feels_like}°
									</span>
								)}
								{activeTab === "wind" && (
									<span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
										{getWindDirection(item.wind_deg)} {item.wind_deg}°
									</span>
								)}
								{activeTab === "humidity" && (
									<span className="font-mono text-[11px] text-muted-foreground">
										Humidity
									</span>
								)}
								{activeTab === "pressure" && (
									<span className="font-mono text-[11px] text-muted-foreground">
										Pressure
									</span>
								)}
								{activeTab === "clouds" && (
									<span className="font-mono text-[11px] text-muted-foreground">
										Coverage
									</span>
								)}
								{activeTab === "visibility" && (
									<span className="font-mono text-[11px] text-muted-foreground">
										Sightline
									</span>
								)}
								{activeTab === "wet_bulb" && (
									<span className="font-mono text-[11px] text-muted-foreground">
										Index
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
