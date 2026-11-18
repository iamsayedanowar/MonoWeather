export interface ForecastDayGroup<T> {
	dateKey: string;
	dayLabel: string;
	items: T[];
}

/**
 * Groups forecast items by their calendar date string and assigns user-friendly day labels:
 * - 1st day: "Today"
 * - 2nd day: "Tomorrow"
 * - 3rd+ day: item.dayName if available, else dateKey
 */
export function groupForecastsByDay<T extends { date: string; dayName?: string }>(
	items: T[]
): ForecastDayGroup<T>[] {
	const map = new Map<string, T[]>();

	for (const item of items) {
		const list = map.get(item.date);
		if (list) {
			list.push(item);
		} else {
			map.set(item.date, [item]);
		}
	}

	const groups: ForecastDayGroup<T>[] = [];
	let index = 0;

	for (const [dateKey, dayItems] of map.entries()) {
		let dayLabel = dateKey;
		if (index === 0) {
			dayLabel = "Today";
		} else if (index === 1) {
			dayLabel = "Tomorrow";
		} else if (dayItems[0]?.dayName) {
			dayLabel = dayItems[0].dayName;
		}

		groups.push({
			dateKey,
			dayLabel,
			items: dayItems,
		});

		index++;
	}

	return groups;
}
