import { useUnitSettings } from "@/context/unit-settings-provider";

export function TemperatureToggle() {
	const { tempUnit, setTempUnit } = useUnitSettings();

	return (
		<div className="h-8 flex items-center border border-border bg-muted/40 p-0.5 rounded-md">
			<button
				type="button"
				onClick={() => setTempUnit("C")}
				className={`h-full flex items-center justify-center px-2.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
					tempUnit === "C"
						? "bg-background text-foreground shadow-sm border border-border/80"
						: "text-muted-foreground hover:text-foreground border border-transparent"
				}`}
				title="Switch to Celsius"
			>
				°C
			</button>
			<button
				type="button"
				onClick={() => setTempUnit("F")}
				className={`h-full flex items-center justify-center px-2.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
					tempUnit === "F"
						? "bg-background text-foreground shadow-sm border border-border/80"
						: "text-muted-foreground hover:text-foreground border border-transparent"
				}`}
				title="Switch to Fahrenheit"
			>
				°F
			</button>
		</div>
	);
}
