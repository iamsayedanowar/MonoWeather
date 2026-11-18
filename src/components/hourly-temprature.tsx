import { useState, useRef, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { useUnitSettings } from "@/context/unit-settings-provider";
import { groupForecastsByDay } from "@/lib/forecast-groups";
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
import type { ChartDataPoint, ActiveTabConfig, TabId } from "./hourly-temperature-chart";

const HourlyTemperatureChart = lazy(() =>
	import("./hourly-temperature-chart").then((m) => ({ default: m.HourlyTemperatureChart }))
);

const calculateWetBulb = (T: number, RH: number): number => {
	return (
		T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
		Math.atan(T + RH) -
		Math.atan(RH - 1.676331) +
		0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
		4.686035
	);
};

const WIND_DIRECTIONS = [
	"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
	"S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
];

const getWindDirection = (degree: number) => {
	const index = Math.round(((degree % 360) + 360) % 360 / 22.5) % 16;
	return WIND_DIRECTIONS[index];
};

interface HourlyTemperatureProps {
	data: ForecastData;
}

type TimeRange = "24h" | "5d";

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
	const {
		getChartTemp,
		tempUnit,
		formatTime,
		getWindSpeed,
		windSpeedUnit,
		getPressure,
		pressureUnit,
		getDistance,
		distanceUnit,
	} = useUnitSettings();
	const [activeTab, setActiveTab] = useState<TabId>("temperature");
	const [showChart, setShowChart] = useState<boolean>(false);
	const [timeRange, setTimeRange] = useState<TimeRange>(() =>
		typeof window !== "undefined" && window.innerWidth < 640 ? "24h" : "5d"
	);
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
			// Prevent default page scroll whenever cursor is over the cards
			e.preventDefault();

			const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
			const multiplier = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? el.clientWidth : 1;
			const delta = rawDelta * multiplier;
			if (delta !== 0) {
				el.scrollLeft += delta;
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
			const maxScroll = el.scrollWidth - el.clientWidth;
			if (maxScroll > 0) {
				e.preventDefault();
				const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
				const multiplier = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? el.clientWidth : 1;
				const delta = rawDelta * multiplier;
				if (delta !== 0) {
					el.scrollLeft += delta;
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

	const chartData: ChartDataPoint[] = useMemo(() => {
		return data.list.map((item, index) => {
			const date = new Date(item.dt * 1000);
			return {
				time: formatTime(date, "short"),
				fullTime: formatTime(date, "full"),
				date: format(date, "d MMM"),
				dayName: format(date, "EEEE"),
				shortDate: index === 0 ? "Today" : format(date, "d MMM"),
				temp: Math.round(getChartTemp(item.main.temp)),
				feels_like: Math.round(getChartTemp(item.main.feels_like)),
				humidity: item.main.humidity,
				pop: Math.round((item.pop ?? 0) * 100),
				wind_speed: getWindSpeed(item.wind.speed),
				wind_gust: getWindSpeed(item.wind.gust || item.wind.speed),
				wind_deg: item.wind.deg,
				visibility: getDistance(item.visibility),
				wet_bulb: Math.round(getChartTemp(calculateWetBulb(item.main.temp, item.main.humidity))),
				pressure: getPressure(item.main.pressure),
				clouds: item.clouds.all,
				icon: item.weather[0].icon,
				description: item.weather[0].description,
			};
		});
	}, [data.list, formatTime, getChartTemp, getWindSpeed, getDistance, getPressure]);

	const displayData = useMemo(() => {
		return timeRange === "24h" ? chartData.slice(0, 8) : chartData;
	}, [chartData, timeRange]);

	const dayGroups = useMemo(() => {
		return groupForecastsByDay(chartData);
	}, [chartData]);

	const xTicks = useMemo(() => {
		if (!displayData.length) return [];
		if (timeRange === "24h") {
			return displayData.filter((_, i) => i % 2 === 0).map((d) => d.fullTime);
		}
		return displayData.filter((_, i) => i % 8 === 0).map((d) => d.fullTime);
	}, [displayData, timeRange]);

	const fullTimeToLabelMap = useMemo(() => {
		const map = new Map<string, string>();
		for (const pt of displayData) {
			map.set(pt.fullTime, timeRange === "24h" ? pt.time : pt.shortDate);
		}
		return map;
	}, [displayData, timeRange]);

	const formatXTick = useCallback(
		(fullTime: string) => fullTimeToLabelMap.get(fullTime) || fullTime,
		[fullTimeToLabelMap]
	);

	const tabConfigs: ActiveTabConfig[] = useMemo(() => [
		{ id: "temperature", label: "Temperature", unitLabel: `°${tempUnit}`, dataKey: "temp", formatter: (val) => `${val}°` },
		{ id: "wind", label: "Wind", unitLabel: windSpeedUnit, dataKey: "wind_speed", formatter: (val) => `${val} ${windSpeedUnit}` },
		{ id: "humidity", label: "Humidity", unitLabel: "%", dataKey: "humidity", formatter: (val) => `${val}%` },
		{ id: "pressure", label: "Pressure", unitLabel: pressureUnit, dataKey: "pressure", formatter: (val) => `${val} ${pressureUnit}` },
		{ id: "clouds", label: "Clouds", unitLabel: "%", dataKey: "clouds", formatter: (val) => `${val}%` },
		{ id: "visibility", label: "Visibility", unitLabel: distanceUnit, dataKey: "visibility", formatter: (val) => `${val} ${distanceUnit}` },
		{ id: "wet_bulb", label: "Heat Index", unitLabel: `°${tempUnit}`, dataKey: "wet_bulb", formatter: (val) => `${val}°` },
	], [tempUnit, windSpeedUnit, pressureUnit, distanceUnit]);

	const activeConfig = tabConfigs.find((c) => c.id === activeTab) || tabConfigs[0];

	const renderIcon = (tab: TabId, item: ChartDataPoint) => {
		switch (tab) {
			case "temperature":
				return <WeatherIcon iconCode={item.icon} className="size-8 object-contain" />;
			case "wind":
				return (
					<Navigation2
						className="size-5 text-foreground transition-transform"
						style={{ transform: `rotate(${(item.wind_deg + 180) % 360}deg)` }}
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
		<Card className="w-full flex-1 min-w-0 border-border bg-card rounded-lg content-visibility-auto">
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
							<span className="truncate">
								{activeConfig.label} trend ({activeConfig.unitLabel})
							</span>
							<div className="flex items-center gap-1 shrink-0 ml-2">
								<button
									type="button"
									onClick={() => setTimeRange("24h")}
									className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer border ${
										timeRange === "24h"
											? "bg-secondary text-foreground border-border font-medium"
											: "bg-background text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/60"
									}`}
								>
									24h
								</button>
								<button
									type="button"
									onClick={() => setTimeRange("5d")}
									className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer border ${
										timeRange === "5d"
											? "bg-secondary text-foreground border-border font-medium"
											: "bg-background text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/60"
									}`}
								>
									5d
								</button>
							</div>
						</div>
						<Suspense
							fallback={
								<div className="h-44 w-full flex items-center justify-center font-mono text-xs text-muted-foreground">
									Loading chart telemetry...
								</div>
							}
						>
							<HourlyTemperatureChart
								displayData={displayData}
								activeConfig={activeConfig}
								xTicks={xTicks}
								formatXTick={formatXTick}
							/>
						</Suspense>
					</div>
				)}

				{/* 3-Hour Interval Scrub Deck */}
				<div
					ref={scrollRef}
					className="flex overflow-x-auto scrollbar-hide w-full snap-x pb-1 overscroll-contain"
				>
					{dayGroups.map((group, groupIndex) => (
						<div key={group.dateKey} className="flex items-start shrink-0">
							<div className="flex flex-col shrink-0">
								{/* Sticky Day Header */}
								<div className="sticky left-0 z-10 self-start mb-2 pointer-events-none">
									<span className="font-mono text-xs font-semibold text-foreground bg-secondary/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-border/60 inline-flex items-center shadow-xs">
										{group.dayLabel}
									</span>
								</div>

								{/* Cards for this day */}
								<div className="flex gap-2.5">
									{group.items.map((item, i) => (
										<div
											key={`${group.dateKey}-${item.time}-${i}`}
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
												<div className="h-5 shrink-0 flex items-center justify-center">
													{item.pop > 0 && (
														<span className="font-mono text-[10px] leading-none px-1.5 py-0.5 border border-border/60 bg-muted/40 text-foreground rounded whitespace-nowrap">
															{item.pop}% rain
														</span>
													)}
												</div>
												<div className="flex items-center justify-center size-8 shrink-0">
													{renderIcon(activeTab, item)}
												</div>
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
							</div>

							{/* Separator between days */}
							{groupIndex < dayGroups.length - 1 && (
								<div className="w-px self-stretch bg-border/60 mx-2.5 shrink-0 my-0.5" />
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
