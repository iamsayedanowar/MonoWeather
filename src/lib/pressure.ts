export type PressureUnit = "hPa" | "psi" | "mmHg";

export const PRESSURE_UNITS: PressureUnit[] = ["hPa", "psi", "mmHg"];

/**
 * Converts barometric pressure from hPa (OpenWeather default) to the specified unit.
 *
 * - hPa: rounded to nearest integer
 * - psi: 2 decimal places (1 hPa ≈ 0.01450377 psi)
 * - mmHg: rounded to nearest integer (1 hPa ≈ 0.750062 mmHg)
 */
export function convertPressure(pressureHpa: number, unit: PressureUnit): number {
	switch (unit) {
		case "psi":
			return Number((pressureHpa * 0.01450377).toFixed(2));
		case "mmHg":
			return Math.round(pressureHpa * 0.750062);
		case "hPa":
		default:
			return Math.round(pressureHpa);
	}
}
