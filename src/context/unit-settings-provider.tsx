import { createContext, useContext, PropsWithChildren } from "react";
import { format as formatFns } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type TempUnit = "C" | "F";
export type TimeFormatUnit = "12h" | "24h";
export type WindSpeedUnit = "km/h" | "mph" | "m/s" | "knots";
export type PressureUnit = "hPa" | "psi";
export type DistanceUnit = "km" | "mph";

export interface UnitSettings {
	tempUnit: TempUnit;
	timeFormat: TimeFormatUnit;
	windSpeedUnit: WindSpeedUnit;
	pressureUnit: PressureUnit;
	distanceUnit: DistanceUnit;
}

const DEFAULT_SETTINGS: UnitSettings = {
	tempUnit: "C",
	timeFormat: "24h",
	windSpeedUnit: "km/h",
	pressureUnit: "hPa",
	distanceUnit: "km",
};

interface UnitSettingsContextType extends UnitSettings {
	// Setter methods
	setTempUnit: (unit: TempUnit) => void;
	setTimeFormat: (format: TimeFormatUnit) => void;
	setWindSpeedUnit: (unit: WindSpeedUnit) => void;
	setPressureUnit: (unit: PressureUnit) => void;
	setDistanceUnit: (unit: DistanceUnit) => void;

	// Backward compatibility with useTemperature()
	unit: TempUnit;
	setUnit: (unit: TempUnit) => void;

	// Conversion & formatting helpers
	formatTemp: (tempInCelsius: number) => string;
	getChartTemp: (tempInCelsius: number) => number;
	formatTime: (date: Date | number, mode?: "short" | "full" | "withSeconds") => string;
	getWindSpeed: (speedMps: number) => number;
	formatWindSpeed: (speedMps: number) => string;
	getPressure: (pressureHpa: number) => number;
	formatPressure: (pressureHpa: number) => string;
	getDistance: (meters: number) => number;
	formatDistance: (meters: number) => string;
}

const UnitSettingsContext = createContext<UnitSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "monoweather_unit_settings";

export function UnitSettingsProvider({ children }: PropsWithChildren) {
	const [settings, setSettings] = useLocalStorage<UnitSettings>(STORAGE_KEY, DEFAULT_SETTINGS);

	// Ensure all fields exist in case of partial cached data
	const currentSettings: UnitSettings = {
		tempUnit: settings?.tempUnit || DEFAULT_SETTINGS.tempUnit,
		timeFormat: settings?.timeFormat || DEFAULT_SETTINGS.timeFormat,
		windSpeedUnit: settings?.windSpeedUnit || DEFAULT_SETTINGS.windSpeedUnit,
		pressureUnit: settings?.pressureUnit || DEFAULT_SETTINGS.pressureUnit,
		distanceUnit: settings?.distanceUnit || DEFAULT_SETTINGS.distanceUnit,
	};

	const setTempUnit = (unit: TempUnit) => {
		setSettings((prev) => ({ ...prev, tempUnit: unit }));
	};

	const setTimeFormat = (format: TimeFormatUnit) => {
		setSettings((prev) => ({ ...prev, timeFormat: format }));
	};

	const setWindSpeedUnit = (unit: WindSpeedUnit) => {
		setSettings((prev) => ({ ...prev, windSpeedUnit: unit }));
	};

	const setPressureUnit = (unit: PressureUnit) => {
		setSettings((prev) => ({ ...prev, pressureUnit: unit }));
	};

	const setDistanceUnit = (unit: DistanceUnit) => {
		setSettings((prev) => ({ ...prev, distanceUnit: unit }));
	};

	// Temperature helpers
	const getChartTemp = (tempInCelsius: number): number => {
		if (currentSettings.tempUnit === "F") {
			return (tempInCelsius * 9) / 5 + 32;
		}
		return tempInCelsius;
	};

	const formatTemp = (tempInCelsius: number): string => {
		const temp = getChartTemp(tempInCelsius);
		return `${Math.round(temp)}°`;
	};

	// Time helpers
	const formatTime = (
		dateInput: Date | number,
		mode: "short" | "full" | "withSeconds" = "short"
	): string => {
		const d = typeof dateInput === "number" ? new Date(dateInput * (dateInput < 1e11 ? 1000 : 1)) : dateInput;
		const is12h = currentSettings.timeFormat === "12h";

		if (mode === "withSeconds") {
			return formatFns(d, is12h ? "hh:mm:ss a" : "HH:mm:ss");
		}
		if (mode === "full") {
			return formatFns(d, is12h ? "MMM d, h:mm a" : "MMM d, HH:mm");
		}
		return formatFns(d, is12h ? "h:mm a" : "HH:mm");
	};

	// Wind speed helpers (OpenWeather API sends m/s)
	const getWindSpeed = (speedMps: number): number => {
		switch (currentSettings.windSpeedUnit) {
			case "mph":
				return Number((speedMps * 2.236936).toFixed(1));
			case "m/s":
				return Number(speedMps.toFixed(1));
			case "knots":
				return Number((speedMps * 1.943844).toFixed(1));
			case "km/h":
			default:
				return Number((speedMps * 3.6).toFixed(1));
		}
	};

	const formatWindSpeed = (speedMps: number): string => {
		const val = getWindSpeed(speedMps);
		return `${val} ${currentSettings.windSpeedUnit}`;
	};

	// Pressure helpers (OpenWeather API sends hPa)
	const getPressure = (pressureHpa: number): number => {
		if (currentSettings.pressureUnit === "psi") {
			return Number((pressureHpa * 0.01450377).toFixed(2));
		}
		return Math.round(pressureHpa);
	};

	const formatPressure = (pressureHpa: number): string => {
		const val = getPressure(pressureHpa);
		return `${val} ${currentSettings.pressureUnit}`;
	};

	// Distance helpers (OpenWeather API sends visibility in meters)
	const getDistance = (meters: number): number => {
		if (currentSettings.distanceUnit === "mph") {
			// Miles conversion
			return Number(((meters / 1000) * 0.621371).toFixed(1));
		}
		// Kilometers
		return Number((meters / 1000).toFixed(1));
	};

	const formatDistance = (meters: number): string => {
		const val = getDistance(meters);
		return `${val} ${currentSettings.distanceUnit}`;
	};

	const value: UnitSettingsContextType = {
		...currentSettings,
		setTempUnit,
		setTimeFormat,
		setWindSpeedUnit,
		setPressureUnit,
		setDistanceUnit,

		// Backward compatibility
		unit: currentSettings.tempUnit,
		setUnit: setTempUnit,

		formatTemp,
		getChartTemp,
		formatTime,
		getWindSpeed,
		formatWindSpeed,
		getPressure,
		formatPressure,
		getDistance,
		formatDistance,
	};

	return (
		<UnitSettingsContext.Provider value={value}>
			{children}
		</UnitSettingsContext.Provider>
	);
}

export function useUnitSettings() {
	const context = useContext(UnitSettingsContext);
	if (context === undefined) {
		throw new Error("useUnitSettings must be used within a UnitSettingsProvider");
	}
	return context;
}

// Keep useTemperature as an alias for backward compatibility
export function useTemperature() {
	return useUnitSettings();
}

