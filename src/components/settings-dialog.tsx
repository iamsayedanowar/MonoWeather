import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Settings,
	Thermometer,
	Clock,
	Wind,
	Gauge,
	Compass,
	Sun,
	Moon,
	Monitor,
} from "lucide-react";
import {
	useUnitSettings,
	WindSpeedUnit,
	PressureUnit,
	DistanceUnit,
} from "@/context/unit-settings-provider";
import { useTheme } from "@/context/theme-provider";

export function SettingsDialog() {
	const [open, setOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const {
		tempUnit,
		setTempUnit,
		timeFormat,
		setTimeFormat,
		windSpeedUnit,
		setWindSpeedUnit,
		pressureUnit,
		setPressureUnit,
		distanceUnit,
		setDistanceUnit,
	} = useUnitSettings();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="h-8 w-8 flex items-center justify-center border border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-md"
					title="Metric & Unit Settings"
					aria-label="Open settings"
				>
					<Settings className="size-4" />
				</button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md border-border bg-card max-h-[90vh] overflow-y-auto">
				<DialogHeader className="text-left pb-2 border-b border-border/60">
					<DialogTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
						<Settings className="size-4 text-muted-foreground" />
						Settings
					</DialogTitle>
					<DialogDescription>
						Configure your theme and unit preferences across all weather telemetry and forecasts.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 py-1">
					{/* Theme Toggle */}
					<div className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-muted/20">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-md bg-muted/50 border border-border/50 shrink-0">
								{theme === "dark" ? (
									<Moon className="size-4 text-foreground" />
								) : theme === "light" ? (
									<Sun className="size-4 text-foreground" />
								) : (
									<Monitor className="size-4 text-foreground" />
								)}
							</div>
							<div>
								<p className="text-xs font-semibold text-foreground">Theme</p>
								<p className="text-[11px] text-muted-foreground font-mono">Appearance mode</p>
							</div>
						</div>
						<div className="w-full grid grid-cols-3 border border-border bg-muted/40 p-0.5 rounded-md">
							<button
								type="button"
								onClick={() => setTheme("light")}
								className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
									theme === "light"
										? "bg-background text-foreground shadow-sm border border-border/80"
										: "text-muted-foreground hover:text-foreground border border-transparent"
								}`}
							>
								<Sun className="size-3" />
								Light
							</button>
							<button
								type="button"
								onClick={() => setTheme("dark")}
								className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
									theme === "dark"
										? "bg-background text-foreground shadow-sm border border-border/80"
										: "text-muted-foreground hover:text-foreground border border-transparent"
								}`}
							>
								<Moon className="size-3" />
								Dark
							</button>
							<button
								type="button"
								onClick={() => setTheme("system")}
								className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
									theme === "system"
										? "bg-background text-foreground shadow-sm border border-border/80"
										: "text-muted-foreground hover:text-foreground border border-transparent"
								}`}
							>
								<Monitor className="size-3" />
								System
							</button>
						</div>
					</div>

					{/* 1. Temperature Toggle */}
					<div className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-muted/20">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-md bg-muted/50 border border-border/50 shrink-0">
								<Thermometer className="size-4 text-foreground" />
							</div>
							<div>
								<p className="text-xs font-semibold text-foreground">Temperature</p>
								<p className="text-[11px] text-muted-foreground font-mono">Degrees scale</p>
							</div>
						</div>
						<div className="w-full grid grid-cols-2 border border-border bg-muted/40 p-0.5 rounded-md">
							<button
								type="button"
								onClick={() => setTempUnit("C")}
								className={`flex items-center justify-center py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
									tempUnit === "C"
										? "bg-background text-foreground shadow-sm border border-border/80"
										: "text-muted-foreground hover:text-foreground border border-transparent"
								}`}
							>
								Celsius (°C)
							</button>
							<button
								type="button"
								onClick={() => setTempUnit("F")}
								className={`flex items-center justify-center py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
									tempUnit === "F"
										? "bg-background text-foreground shadow-sm border border-border/80"
										: "text-muted-foreground hover:text-foreground border border-transparent"
								}`}
							>
								Fahrenheit (°F)
							</button>
						</div>
					</div>

					{/* 2. Time Format Toggle */}
					<div className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-muted/20">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-md bg-muted/50 border border-border/50 shrink-0">
								<Clock className="size-4 text-foreground" />
							</div>
							<div>
								<p className="text-xs font-semibold text-foreground">Time Format</p>
								<p className="text-[11px] text-muted-foreground font-mono">Clock display</p>
							</div>
						</div>
						<div className="w-full grid grid-cols-2 border border-border bg-muted/40 p-0.5 rounded-md">
							<button
								type="button"
								onClick={() => setTimeFormat("12h")}
								className={`flex items-center justify-center py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
									timeFormat === "12h"
										? "bg-background text-foreground shadow-sm border border-border/80"
										: "text-muted-foreground hover:text-foreground border border-transparent"
								}`}
							>
								12-hour
							</button>
							<button
								type="button"
								onClick={() => setTimeFormat("24h")}
								className={`flex items-center justify-center py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
									timeFormat === "24h"
										? "bg-background text-foreground shadow-sm border border-border/80"
										: "text-muted-foreground hover:text-foreground border border-transparent"
								}`}
							>
								24-hour
							</button>
						</div>
					</div>

					{/* 3. Wind Speed Toggle */}
					<div className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-muted/20">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-md bg-muted/50 border border-border/50 shrink-0">
								<Wind className="size-4 text-foreground" />
							</div>
							<div>
								<p className="text-xs font-semibold text-foreground">Wind Speed</p>
								<p className="text-[11px] text-muted-foreground font-mono">Velocity unit</p>
							</div>
						</div>
						<div className="w-full grid grid-cols-4 border border-border bg-muted/40 p-0.5 rounded-md">
							{(["km/h", "mph", "m/s", "knots"] as WindSpeedUnit[]).map((unit) => (
								<button
									key={unit}
									type="button"
									onClick={() => setWindSpeedUnit(unit)}
									className={`flex items-center justify-center py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
										windSpeedUnit === unit
											? "bg-background text-foreground shadow-sm border border-border/80"
											: "text-muted-foreground hover:text-foreground border border-transparent"
									}`}
								>
									{unit}
								</button>
							))}
						</div>
					</div>

					{/* 4. Atmospheric Pressure Toggle */}
					<div className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-muted/20">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-md bg-muted/50 border border-border/50 shrink-0">
								<Gauge className="size-4 text-foreground" />
							</div>
							<div>
								<p className="text-xs font-semibold text-foreground">Atmospheric Pressure</p>
								<p className="text-[11px] text-muted-foreground font-mono">Barometric unit</p>
							</div>
						</div>
						<div className="w-full grid grid-cols-2 border border-border bg-muted/40 p-0.5 rounded-md">
							{(["hPa", "psi"] as PressureUnit[]).map((unit) => (
								<button
									key={unit}
									type="button"
									onClick={() => setPressureUnit(unit)}
									className={`flex items-center justify-center py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
										pressureUnit === unit
											? "bg-background text-foreground shadow-sm border border-border/80"
											: "text-muted-foreground hover:text-foreground border border-transparent"
									}`}
								>
									{unit === "hPa" ? "hpa" : "psi"}
								</button>
							))}
						</div>
					</div>

					{/* 5. Distance Toggle */}
					<div className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-muted/20">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-md bg-muted/50 border border-border/50 shrink-0">
								<Compass className="size-4 text-foreground" />
							</div>
							<div>
								<p className="text-xs font-semibold text-foreground">Distance</p>
								<p className="text-[11px] text-muted-foreground font-mono">Visibility & range</p>
							</div>
						</div>
						<div className="w-full grid grid-cols-2 border border-border bg-muted/40 p-0.5 rounded-md">
							{(["km", "mph"] as DistanceUnit[]).map((unit) => (
								<button
									key={unit}
									type="button"
									onClick={() => setDistanceUnit(unit)}
									className={`flex items-center justify-center py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
										distanceUnit === unit
											? "bg-background text-foreground shadow-sm border border-border/80"
											: "text-muted-foreground hover:text-foreground border border-transparent"
									}`}
								>
									{unit}
								</button>
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
