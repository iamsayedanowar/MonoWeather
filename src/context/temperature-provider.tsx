import { createContext, useContext, useState, PropsWithChildren } from "react";

type Unit = "C" | "F";

interface TemperatureContextType {
	unit: Unit;
	setUnit: (unit: Unit) => void;
	formatTemp: (tempInCelsius: number) => string;
	getChartTemp: (tempInCelsius: number) => number;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export function TemperatureProvider({ children }: PropsWithChildren) {
	const [unit, setUnit] = useState<Unit>("C");

	const getChartTemp = (tempInCelsius: number) => {
		if (unit === "F") {
			return (tempInCelsius * 9) / 5 + 32;
		}
		return tempInCelsius;
	};

	const formatTemp = (tempInCelsius: number) => {
		const temp = getChartTemp(tempInCelsius);
		return `${Math.round(temp)}°`;
	};

	return (
		<TemperatureContext.Provider value={{ unit, setUnit, formatTemp, getChartTemp }}>
			{children}
		</TemperatureContext.Provider>
	);
}

export function useTemperature() {
	const context = useContext(TemperatureContext);
	if (context === undefined) {
		throw new Error("useTemperature must be used within a TemperatureProvider");
	}
	return context;
}
