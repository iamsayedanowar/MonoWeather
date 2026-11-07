import { useTemperature } from "@/context/temperature-provider";

export function TemperatureToggle() {
	const { unit, setUnit } = useTemperature();

	return (
		<div className="h-8 flex items-center border border-border bg-muted/40 p-0.5 rounded-md">
			<button
				type="button"
				onClick={() => setUnit("C")}
				className={`h-full flex items-center justify-center px-2.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
					unit === "C"
						? "bg-background text-foreground shadow-sm border border-border/80"
						: "text-muted-foreground hover:text-foreground border border-transparent"
				}`}
				title="Switch to Celsius"
			>
				°C
			</button>
			<button
				type="button"
				onClick={() => setUnit("F")}
				className={`h-full flex items-center justify-center px-2.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-sm ${
					unit === "F"
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
