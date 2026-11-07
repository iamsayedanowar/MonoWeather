import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind, Navigation2Icon } from "lucide-react";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { useTemperature } from "@/context/temperature-provider";
import { WeatherIcon } from "./weather-icon";

interface WeatherForecastProps {
	data: ForecastData;
}

interface DailyForecast {
	date: number;
	temp: number;
	temp_min: number;
	temp_max: number;
	humidity: number;
	wind: number;
	wind_deg: number;
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	};
}

export function WeatherForecast({ data }: WeatherForecastProps) {
	// Group forecast by day and get daily min/max
	const dailyForecasts = data.list.reduce((acc, forecast) => {
		const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

		if (!acc[date]) {
			acc[date] = {
				temp: forecast.main.temp,
				temp_min: forecast.main.temp_min,
				temp_max: forecast.main.temp_max,
				humidity: forecast.main.humidity,
				wind: forecast.wind.speed,
				wind_deg: forecast.wind.deg,
				weather: forecast.weather[0],
				date: forecast.dt,
			};
		} else {
			acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
			acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
		}

		return acc;
	}, {} as Record<string, DailyForecast>);

	// Get next 5 days
	const nextDays = Object.values(dailyForecasts).slice(1, 6);

	const { formatTemp } = useTemperature();

	// Convert wind degree to direction
	const getWindDirection = (degree: number) => {
		const directions = [
			"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
			"S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
		];
		const index =
			Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 22.5) % 16;
		return directions[index];
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>5-Day Forecast</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{nextDays.map((day) => (
						<div
							key={day.date}
							className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
						>
							<div className="flex items-center gap-2">
								<WeatherIcon
									iconCode={day.weather.icon}
									className="h-10 w-10 shrink-0"
								/>
								<div>
									<p className="font-medium whitespace-nowrap">
										{format(new Date(day.date * 1000), "EEE, MMM d")}
									</p>
									<p className="text-sm text-muted-foreground capitalize">
										{day.weather.description}
									</p>
								</div>
							</div>

							<div className="flex flex-col items-center justify-center gap-1">
								<span className="font-bold text-lg">{formatTemp(day.temp)}</span>
								<div className="flex justify-center gap-2 text-xs">
									<span className="flex items-center text-blue-500">
										<ArrowDown className="mr-1 h-3 w-3" />
										{formatTemp(day.temp_min)}
									</span>
									<span className="flex items-center text-red-500">
										<ArrowUp className="mr-1 h-3 w-3" />
										{formatTemp(day.temp_max)}
									</span>
								</div>
							</div>

							<div className="flex flex-col items-end justify-center gap-1">
								<span className="flex items-center gap-1">
									<Droplets className="h-4 w-4 text-blue-500" />
									<span className="text-sm">{day.humidity}%</span>
								</span>
								<span className="flex items-center gap-1">
									<Wind className="h-4 w-4 text-blue-500" />
									<span className="text-sm whitespace-nowrap">{(day.wind * 3.6).toFixed(1)} km/h</span>
									<Navigation2Icon
										className="h-3 w-3 text-blue-500"
										style={{ transform: `rotate(${day.wind_deg}deg)` }}
									/>
									<span className="text-sm whitespace-nowrap">
										({day.wind_deg}°{getWindDirection(day.wind_deg)})
									</span>
								</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}