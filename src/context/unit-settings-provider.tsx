import { createContext, useContext, useMemo, useCallback, type PropsWithChildren } from "react";
import { format as formatFns } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { convertPressure, PRESSURE_UNITS, type PressureUnit } from "@/lib/pressure";

export type TempUnit = "C" | "F";
export type TimeFormatUnit = "12h" | "24h";
export type WindSpeedUnit = "km/h" | "mph" | "m/s" | "knots";
export type { PressureUnit };
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
	const currentSettings: UnitSettings = useMemo(() => ({
		tempUnit: settings?.tempUnit || DEFAULT_SETTINGS.tempUnit,
		timeFormat: settings?.timeFormat || DEFAULT_SETTINGS.timeFormat,
		windSpeedUnit: settings?.windSpeedUnit || DEFAULT_SETTINGS.windSpeedUnit,
		pressureUnit:
			settings?.pressureUnit && PRESSURE_UNITS.includes(settings.pressureUnit)
				? settings.pressureUnit
				: DEFAULT_SETTINGS.pressureUnit,
		distanceUnit: settings?.distanceUnit || DEFAULT_SETTINGS.distanceUnit,
	}), [settings]);

	const setTempUnit = useCallback((unit: TempUnit) => {
		setSettings((prev) => ({ ...prev, tempUnit: unit }));
	}, [setSettings]);

	const setTimeFormat = useCallback((format: TimeFormatUnit) => {
		setSettings((prev) => ({ ...prev, timeFormat: format }));
	}, [setSettings]);

	const setWindSpeedUnit = useCallback((unit: WindSpeedUnit) => {
		setSettings((prev) => ({ ...prev, windSpeedUnit: unit }));
	}, [setSettings]);

	const setPressureUnit = useCallback((unit: PressureUnit) => {
		setSettings((prev) => ({ ...prev, pressureUnit: unit }));
	}, [setSettings]);

	const setDistanceUnit = useCallback((unit: DistanceUnit) => {
		setSettings((prev) => ({ ...prev, distanceUnit: unit }));
	}, [setSettings]);

	// Temperature helpers
	const getChartTemp = useCallback((tempInCelsius: number): number => {
		if (currentSettings.tempUnit === "F") {
			return (tempInCelsius * 9) / 5 + 32;
		}
		return tempInCelsius;
	}, [currentSettings.tempUnit]);

	const formatTemp = useCallback((tempInCelsius: number): string => {
		const temp = getChartTemp(tempInCelsius);
		return `${Math.round(temp)}°`;
	}, [getChartTemp]);

	// Time helpers
	const formatTime = useCallback((
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
	}, [currentSettings.timeFormat]);

	// Wind speed helpers (OpenWeather API sends m/s)
	const getWindSpeed = useCallback((speedMps: number): number => {
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
	}, [currentSettings.windSpeedUnit]);

	const formatWindSpeed = useCallback((speedMps: number): string => {
		const val = getWindSpeed(speedMps);
		return `${val} ${currentSettings.windSpeedUnit}`;
	}, [getWindSpeed, currentSettings.windSpeedUnit]);

	// Pressure helpers (OpenWeather API sends hPa)
	const getPressure = useCallback((pressureHpa: number): number => {
		return convertPressure(pressureHpa, currentSettings.pressureUnit);
	}, [currentSettings.pressureUnit]);

	const formatPressure = useCallback((pressureHpa: number): string => {
		const val = getPressure(pressureHpa);
		return `${val} ${currentSettings.pressureUnit}`;
	}, [getPressure, currentSettings.pressureUnit]);

	// Distance helpers (OpenWeather API sends visibility in meters)
	const getDistance = useCallback((meters: number): number => {
		if (currentSettings.distanceUnit === "mph") {
			// Miles conversion
			return Number(((meters / 1000) * 0.621371).toFixed(1));
		}
		// Kilometers
		return Number((meters / 1000).toFixed(1));
	}, [currentSettings.distanceUnit]);

	const formatDistance = useCallback((meters: number): string => {
		const val = getDistance(meters);
		return `${val} ${currentSettings.distanceUnit}`;
	}, [getDistance, currentSettings.distanceUnit]);

	const value: UnitSettingsContextType = useMemo(() => ({
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
	}), [
		currentSettings,
		setTempUnit,
		setTimeFormat,
		setWindSpeedUnit,
		setPressureUnit,
		setDistanceUnit,
		formatTemp,
		getChartTemp,
		formatTime,
		getWindSpeed,
		formatWindSpeed,
		getPressure,
		formatPressure,
		getDistance,
		formatDistance,
	]);

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

