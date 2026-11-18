import test from "node:test";
import assert from "node:assert/strict";
import { convertPressure, PRESSURE_UNITS, type PressureUnit } from "../src/lib/pressure.ts";

test("PRESSURE_UNITS contains hPa, psi, mmHg", () => {
	const expected: PressureUnit[] = ["hPa", "psi", "mmHg"];
	assert.deepStrictEqual(PRESSURE_UNITS, expected);
});

test("convertPressure converts hPa correctly", () => {
	assert.strictEqual(convertPressure(1013.25, "hPa"), 1013);
	assert.strictEqual(convertPressure(1013.7, "hPa"), 1014);
});

test("convertPressure converts psi correctly (2 decimal places)", () => {
	// 1013.25 * 0.01450377 = 14.6959... -> 14.70
	assert.strictEqual(convertPressure(1013.25, "psi"), 14.70);
	// 1000 * 0.01450377 = 14.50377 -> 14.50
	assert.strictEqual(convertPressure(1000, "psi"), 14.50);
});

test("convertPressure converts mmHg correctly (rounded to nearest integer)", () => {
	// 1013.25 hPa is standard 760 mmHg
	// 1013.25 * 0.750062 = 760.0003... -> 760
	assert.strictEqual(convertPressure(1013.25, "mmHg"), 760);
	// 1000 * 0.750062 = 750.062 -> 750
	assert.strictEqual(convertPressure(1000, "mmHg"), 750);
	// 980 * 0.750062 = 735.06 -> 735
	assert.strictEqual(convertPressure(980, "mmHg"), 735);
});
