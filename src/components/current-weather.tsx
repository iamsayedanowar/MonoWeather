import { Card, CardContent, CardHeader } from "./ui/card";
import {
	Navigation2,
	Cloud,
	Thermometer,
	ArrowDown,
	ArrowUp,
	Droplets,
	Wind,
	Compass,
	Gauge,
	Eye,
	Sunrise,
	Sunset,
	Clock,
} from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { useUnitSettings } from "@/context/unit-settings-provider";
import { WeatherIcon } from "./weather-icon";

interface CurrentWeatherProps {
	data: WeatherData;
	locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
	const {
		weather: [currentWeather],
		main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
		wind: { speed, deg, gust },
		visibility,
		clouds: { all: cloudiness },
		sys: { sunrise, sunset, country },
		dt,
	} = data;

	const {
		formatTemp,
		getChartTemp,
		formatTime,
		getWindSpeed,
		windSpeedUnit,
		getPressure,
		pressureUnit,
		getDistance,
		distanceUnit,
	} = useUnitSettings();

	// Empirical formula for Wet-Bulb Temperature (Stull 2011)
	const getWetBulbTemperature = (T: number, rh: number) => {
		return (
			T * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
			Math.atan(T + rh) -
			Math.atan(rh - 1.676331) +
			0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
			4.686035
		);
	};

	const getWindDirection = (degree: number) => {
		const directions = [
			"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
			"S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
		];
		const index = Math.round(((degree % 360) + 360) % 360 / 22.5) % 16;
		return directions[index];
	};

	// Wind Beaufort Scale
	const getBeaufortDescription = (kmh: number) => {
		if (kmh < 2) return "Calm";
		if (kmh < 12) return "Light Breeze";
		if (kmh < 20) return "Gentle Breeze";
		if (kmh < 29) return "Moderate Wind";
		if (kmh < 39) return "Fresh Breeze";
		if (kmh < 50) return "Strong Wind";
		if (kmh < 62) return "High Wind";
		return "Gale Warning";
	};

	// Solar arc calculation
	const nowSeconds = Math.floor(Date.now() / 1000);
	const dayDuration = Math.max(1, sunset - sunrise);
	const dayElapsed = Math.min(Math.max(0, nowSeconds - sunrise), dayDuration);
	const dayProgressPercent = Math.round((dayElapsed / dayDuration) * 100);
	const remainingDaylightPercent = Math.max(0, 100 - dayProgressPercent);
	const isDay = nowSeconds >= sunrise && nowSeconds < sunset;

	const windKmh = Number((speed * 3.6).toFixed(1));
	const wetBulb = getWetBulbTemperature(temp, humidity);

	return (
		<Card className="w-full flex-1 border-border bg-card rounded-lg">
			<CardHeader className="p-4 sm:p-5 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-muted-foreground font-medium">
							Current conditions
						</span>
					</div>
					<div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
						<Clock className="size-3 text-muted-foreground" />
						<span>Updated {formatTime(dt)}</span>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
					<div>
						<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
							{locationName?.name || data.name}
						</h2>
						<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mt-0.5">
							{locationName?.state && <span>{locationName.state},</span>}
							<span>{locationName?.country || country}</span>
						</div>
					</div>

					<div className="inline-flex items-center px-2.5 py-1 border border-border bg-muted/40 text-xs font-medium text-foreground rounded-md self-start sm:self-auto capitalize">
						{currentWeather.main}
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-4 sm:p-5 pt-0 space-y-6">
				{/* Main Hero Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 pb-2">
					{/* Left: Temperature & Conditions */}
					<div className="md:col-span-8 flex flex-col justify-center">
						<div className="flex items-center gap-5">
							<span className="text-6xl sm:text-7xl font-mono font-semibold tracking-tighter text-foreground tabular-nums">
								{formatTemp(temp)}
							</span>
							<div className="space-y-1">
								<p className="text-sm font-medium capitalize text-foreground">
									{currentWeather.description}
								</p>
								<p className="text-xs text-muted-foreground font-mono">
									Feels like <span className="text-foreground font-medium">{formatTemp(feels_like)}</span>
								</p>
								<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground pt-0.5">
									<span className="flex items-center gap-1 text-foreground">
										<ArrowDown className="size-3 text-muted-foreground" />
										{formatTemp(temp_min)}
									</span>
									<span className="text-muted-foreground">
										Low / High
									</span>
									<span className="flex items-center gap-1 text-foreground">
										<ArrowUp className="size-3 text-muted-foreground" />
										{formatTemp(temp_max)}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right: Weather Icon Frame */}
					<div className="md:col-span-4 flex items-center justify-center sm:justify-end">
						<div className="p-3 border border-border/80 bg-muted/30 rounded-lg flex flex-col items-center justify-center min-w-[110px]">
							<WeatherIcon
								iconCode={currentWeather.icon}
								className="size-16 object-contain drop-shadow-none"
							/>
							<span className="text-xs text-muted-foreground capitalize mt-0.5">
								{currentWeather.main}
							</span>
						</div>
					</div>
				</div>

				{/* 8-Tile Telemetry Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
					{/* Humidity */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Humidity</span>
							<Droplets className="size-3.5 text-muted-foreground" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground">
							{humidity}%
						</div>
						<p className="text-xs text-muted-foreground">
							{humidity > 65 ? "High moisture" : humidity < 30 ? "Dry air" : "Comfortable"}
						</p>
					</div>

					{/* Wind Velocity */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Wind speed</span>
							<Wind className="size-3.5 text-muted-foreground" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground">
							{getWindSpeed(speed)} <span className="text-xs font-normal text-muted-foreground font-sans">{windSpeedUnit}</span>
						</div>
						<p className="text-xs text-muted-foreground truncate">
							{getBeaufortDescription(windKmh)}
						</p>
					</div>

					{/* Wind Gust */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Peak gust</span>
							<Navigation2 className="size-3.5 text-muted-foreground rotate-45" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground">
							{getWindSpeed(gust || speed)} <span className="text-xs font-normal text-muted-foreground font-sans">{windSpeedUnit}</span>
						</div>
						<p className="text-xs text-muted-foreground">
							Max recorded
						</p>
					</div>

					{/* Compass Direction */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Direction</span>
							<Compass className="size-3.5 text-muted-foreground" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground flex items-center gap-2">
							<span>{deg}° {getWindDirection(deg)}</span>
							<Navigation2
								className="size-3.5 text-foreground transition-transform shrink-0"
								style={{ transform: `rotate(${deg}deg)` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							From {getWindDirection(deg)}
						</p>
					</div>

					{/* Barometric Pressure */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Pressure</span>
							<Gauge className="size-3.5 text-muted-foreground" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground">
							{getPressure(pressure)} <span className="text-xs font-normal text-muted-foreground font-sans">{pressureUnit}</span>
						</div>
						<p className="text-xs text-muted-foreground">
							{pressure > 1013 ? "High (clear)" : "Low (rain likely)"}
						</p>
					</div>

					{/* Visibility */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Visibility</span>
							<Eye className="size-3.5 text-muted-foreground" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground">
							{getDistance(visibility)} <span className="text-xs font-normal text-muted-foreground font-sans">{distanceUnit}</span>
						</div>
						<p className="text-xs text-muted-foreground">
							{visibility >= 10000 ? "Clear view" : "Haze / fog"}
						</p>
					</div>

					{/* Cloud Cover */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Cloud cover</span>
							<Cloud className="size-3.5 text-muted-foreground" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground">
							{cloudiness}%
						</div>
						<p className="text-xs text-muted-foreground">
							{cloudiness > 70 ? "Overcast" : cloudiness > 30 ? "Partly cloudy" : "Clear sky"}
						</p>
					</div>

					{/* Thermodynamic Wet Bulb */}
					<div className="border border-border bg-card/60 p-3.5 space-y-1 rounded-lg">
						<div className="flex items-center justify-between text-muted-foreground">
							<span className="text-xs">Heat index</span>
							<Thermometer className="size-3.5 text-muted-foreground" />
						</div>
						<div className="font-mono text-lg font-semibold text-foreground">
							{getChartTemp(wetBulb).toFixed(1)}°
						</div>
						<p className="text-xs text-muted-foreground">
							Wet-bulb rating
						</p>
					</div>
				</div>

				{/* Solar Cycle & Ephemeris Bar */}
				<div className="border border-border p-3.5 sm:p-4 bg-muted/20 space-y-2.5 rounded-lg">
					{/* Above the bar: Sunrise & Sunset */}
					<div className="flex items-center justify-between font-mono text-xs">
						<div className="flex items-center gap-1.5 text-foreground font-medium">
							<Sunrise className="size-3.5 text-muted-foreground shrink-0" />
							<span>Sunrise {formatTime(sunrise)}</span>
						</div>
						<div className="flex items-center gap-1.5 text-foreground font-medium">
							<Sunset className="size-3.5 text-muted-foreground shrink-0" />
							<span>Sunset {formatTime(sunset)}</span>
						</div>
					</div>

					{/* Progress Track */}
					<div className="h-1.5 w-full bg-muted/60 border border-border rounded-full overflow-hidden">
						<div
							className="h-full bg-foreground rounded-full transition-all duration-300"
							style={{ width: `${dayProgressPercent}%` }}
						/>
					</div>

					{/* Below the bar: Remaining daylight status */}
					<div className="flex items-center justify-center font-mono text-[11px] text-muted-foreground">
						<span className="px-2 py-0.5 bg-card/60 border border-border rounded">
							{isDay ? `Daylight: ${remainingDaylightPercent}% remaining` : "Nighttime"}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
