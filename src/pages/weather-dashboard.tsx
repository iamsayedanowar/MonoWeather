import {
	useForecastQuery,
	useReverseGeocodeQuery,
	useWeatherQuery,
	useAirPollutionQuery,
} from "@/hooks/use-weather";
import { Link } from "react-router-dom";
import { CurrentWeather } from "../components/current-weather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
	MapPin,
	AlertTriangle,
	RefreshCw,
	MapPinOff,
	LocateFixed,
	ArrowRight,
} from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteCities } from "@/components/favorite-cities";
import { AirPollution } from "@/components/air-pollution";
import { WeatherMap } from "@/components/weather-map";

const DEFAULT_STATIONS = [
	{ name: "New Delhi", country: "India", lat: 28.6138954, lon: 77.2090057, tag: "Subtropical" },
	{ name: "Moscow", country: "Russia", lat: 55.7505412, lon: 37.6174782, tag: "Continental" },
	{ name: "Washington, D.C.", country: "United States", lat: 38.8950368, lon: -77.0365427, tag: "Temperate" },
	{ name: "London", country: "United Kingdom", lat: 51.5074456, lon: -0.1277653, tag: "Maritime" },
	{ name: "Paris", country: "France", lat: 48.8534951, lon: 2.3483915, tag: "Oceanic" },
	{ name: "Beijing", country: "China", lat: 39.9057136, lon: 116.3912972, tag: "Continental" },
];

export function WeatherDashboard() {
	const {
		coordinates,
		error: locationError,
		isLoading: locationLoading,
		getLocation,
	} = useGeolocation();

	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);
	const locationQuery = useReverseGeocodeQuery(coordinates);
	const airPollutionQuery = useAirPollutionQuery(coordinates);

	// Function to refresh all data feeds
	const handleRefresh = () => {
		getLocation();
		if (coordinates) {
			weatherQuery.refetch();
			forecastQuery.refetch();
			locationQuery.refetch();
			airPollutionQuery.refetch();
		}
	};

	if (locationLoading) {
		return <WeatherSkeleton />;
	}

	if (locationError || !coordinates) {
		return (
			<div className="space-y-8 py-4 max-w-4xl mx-auto min-w-0">
				<FavoriteCities />

				<Alert variant={locationError ? "destructive" : "default"} className="space-y-4 p-6 border border-border rounded-lg">
					<div className="flex items-start gap-3">
						{locationError ? (
							<MapPinOff className="size-5 text-destructive shrink-0 mt-0.5" />
						) : (
							<MapPin className="size-5 text-foreground shrink-0 mt-0.5" />
						)}
						<div className="space-y-1">
							<AlertTitle className="text-sm text-destructive font-semibold">
								{locationError ? "Location access needed" : "Location required"}
							</AlertTitle>
							<AlertDescription className="text-xs text-muted-foreground leading-relaxed">
								{locationError
									? `${locationError}. Enable location permissions in your browser, or select a city below.`
									: "Enable location access to view live weather for your area."}
							</AlertDescription>
						</div>
					</div>

					<div className="pt-2 flex items-center gap-3">
						<Button
							variant="outline"
							onClick={getLocation}
							className="font-mono text-xs rounded-md"
						>
							<LocateFixed className="size-3.5 mr-2" />
							{locationError ? "Retry location" : "Enable location"}
						</Button>
					</div>
				</Alert>

				{/* Quick Benchmark Stations Grid */}
				<div className="space-y-3">
					<div className="flex items-center justify-between border-b border-border/80 pb-2">
						<h3 className="text-xs font-medium text-foreground flex items-center gap-2">
							Popular cities
						</h3>
						<span className="font-mono text-[11px] text-muted-foreground">
							Live forecasts
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{DEFAULT_STATIONS.map((station) => (
							<Link
								key={station.name}
								to={`/city/${station.name}?lat=${station.lat}&lon=${station.lon}`}
								className="group p-4 border border-border bg-card hover:bg-muted/40 transition-colors flex flex-col justify-between gap-3 rounded-lg"
							>
								<div className="flex items-start justify-between">
									<div>
										<p className="font-medium text-sm text-foreground group-hover:text-foreground transition-colors">
											{station.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{station.country}
										</p>
									</div>
									<ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground transition-transform" />
								</div>

								<div className="pt-2 border-t border-border/60 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
									<span>{station.tag}</span>
									<span>{station.lat.toFixed(1)}°, {station.lon.toFixed(1)}°</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		);
	}

	const locationName = locationQuery.data?.[0];

	if (weatherQuery.error || forecastQuery.error || airPollutionQuery.error) {
		return (
			<div className="py-12 max-w-xl mx-auto">
				<Alert variant="destructive" className="space-y-4 p-6">
					<div className="flex items-center gap-3">
						<AlertTriangle className="size-6 text-destructive shrink-0" />
						<div>
							<AlertTitle className="text-sm font-semibold font-mono">
								Unable to load weather
							</AlertTitle>
							<AlertDescription className="text-xs mt-1">
								Could not connect to weather services. Please check your network and try again.
							</AlertDescription>
						</div>
					</div>

					<Button
						variant="outline"
						onClick={handleRefresh}
						className="font-mono text-xs uppercase"
					>
						<RefreshCw className="size-3.5 mr-2" />
						Retry
					</Button>
				</Alert>
			</div>
		);
	}

	if (!weatherQuery.data || !forecastQuery.data || !airPollutionQuery.data) {
		return <WeatherSkeleton />;
	}

	const isSyncing = weatherQuery.isFetching || forecastQuery.isFetching || airPollutionQuery.isFetching;

	return (
		<div className="space-y-6 min-w-0">
			{/* Bookmarked stations shelf */}
			<FavoriteCities />

			{/* Station Header */}
			<div className="flex items-center justify-between gap-3 border-b border-border/80 pb-3">
				<div className="space-y-0.5 min-w-0">
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-foreground">
							Local weather
						</span>
					</div>
					<p className="font-mono text-xs text-muted-foreground truncate">
						{coordinates.lat.toFixed(4)}°N, {coordinates.lon.toFixed(4)}°E
					</p>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<Button
						variant="outline"
						size="sm"
						onClick={getLocation}
						disabled={locationLoading}
						className="font-mono text-xs h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-2.5 rounded-md"
						title="Update GPS location"
						aria-label="Update GPS location"
					>
						<LocateFixed className="size-3.5 sm:mr-1.5" />
						<span className="hidden sm:inline">Locate</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={isSyncing}
						className="font-mono text-xs h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-2.5 rounded-md"
						title="Refresh weather data"
						aria-label="Refresh weather data"
					>
						<RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""} sm:mr-1.5`} />
						<span className="hidden sm:inline">{isSyncing ? "Refreshing..." : "Refresh"}</span>
					</Button>
				</div>
			</div>

			{/* Main Grid: Telemetry Card + Cartography Radar */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
				<div className="lg:col-span-7 flex flex-col min-w-0">
					<CurrentWeather
						data={weatherQuery.data}
						locationName={locationName}
					/>
				</div>

				<div className="lg:col-span-5 flex flex-col min-w-0">
					<WeatherMap
						lat={weatherQuery.data.coord.lat}
						lon={weatherQuery.data.coord.lon}
						city={locationName?.name || weatherQuery.data.name}
					/>
				</div>
			</div>

			{/* 5-Day & Hourly Synoptic Forecast Deck */}
			<div className="min-w-0">
				<HourlyTemperature data={forecastQuery.data} />
			</div>

			{/* Atmospheric Chemistry & Air Quality Spectrometry */}
			<div className="min-w-0">
				<AirPollution data={airPollutionQuery.data} />
			</div>
		</div>
	);
}
