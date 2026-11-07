import { useParams, useSearchParams, Link } from "react-router-dom";
import {
	useWeatherQuery,
	useForecastQuery,
	useAirPollutionQuery,
	useReverseGeocodeQuery,
} from "@/hooks/use-weather";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { CurrentWeather } from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteButton } from "@/components/favorite-button";
import { AirPollution } from "@/components/air-pollution";
import { WeatherMap } from "@/components/weather-map";
import { Button } from "@/components/ui/button";

export function CityPage() {
	const [searchParams] = useSearchParams();
	const params = useParams();
	const lat = parseFloat(searchParams.get("lat") || "0");
	const lon = parseFloat(searchParams.get("lon") || "0");

	const coordinates = { lat, lon };

	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);
	const airPollutionQuery = useAirPollutionQuery(coordinates);
	const locationQuery = useReverseGeocodeQuery(coordinates);

	if (weatherQuery.error || forecastQuery.error || airPollutionQuery.error) {
		return (
			<div className="py-12 max-w-xl mx-auto space-y-4">
				<Alert variant="destructive" className="p-6 space-y-3">
					<div className="flex items-center gap-3">
						<AlertTriangle className="size-6 text-destructive shrink-0" />
						<div>
							<AlertTitle className="text-sm font-semibold font-mono">
								Location not found
							</AlertTitle>
							<AlertDescription className="text-xs mt-1">
								Could not load weather data for these coordinates.
							</AlertDescription>
						</div>
					</div>
					<div className="flex gap-3 pt-2">
						<Link to="/">
							<Button variant="outline" size="sm" className="font-mono text-xs">
								<ArrowLeft className="size-3.5 mr-1.5" />
								Back to Dashboard
							</Button>
						</Link>
					</div>
				</Alert>
			</div>
		);
	}

	if (!weatherQuery.data || !forecastQuery.data || !airPollutionQuery.data || !params.cityName) {
		return <WeatherSkeleton />;
	}

	const locationName = locationQuery.data?.[0];
	const displayName = locationName?.name || params.cityName;
	const isSyncing = weatherQuery.isFetching || forecastQuery.isFetching || airPollutionQuery.isFetching;

	return (
		<div className="space-y-6 min-w-0">
			{/* Breadcrumb Navigation & Controls */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
				<div className="space-y-0.5">
					<div className="flex items-center gap-2">
						<Link
							to="/"
							className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							<ArrowLeft className="size-3" />
							<span>Home</span>
						</Link>
						<span className="text-muted-foreground text-xs">/</span>
						<span className="text-xs font-medium text-foreground">
							{displayName}
						</span>
					</div>
					<p className="font-mono text-xs text-muted-foreground">
						{lat.toFixed(4)}°N, {lon.toFixed(4)}°E · Live
					</p>
				</div>

				<div className="flex items-center gap-2 w-full sm:w-auto">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							weatherQuery.refetch();
							forecastQuery.refetch();
							airPollutionQuery.refetch();
						}}
						disabled={isSyncing}
						className="font-mono text-xs flex-1 sm:flex-initial rounded-md"
						title="Refresh weather data"
					>
						<RefreshCw className={`size-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
						{isSyncing ? "Refreshing..." : "Refresh"}
					</Button>

					<FavoriteButton
						data={{
							...weatherQuery.data,
							name: displayName,
							state: locationName?.state,
						}}
						className="flex-1 sm:flex-initial rounded-md"
					/>
				</div>
			</div>

			{/* Main Grid: Telemetry Station + Cartography Radar */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
				<div className="lg:col-span-7 flex flex-col min-w-0">
					<CurrentWeather
						data={weatherQuery.data}
						locationName={
							locationName
								? { ...locationName, name: displayName }
								: {
										name: displayName,
										country: weatherQuery.data.sys.country,
										state: "",
										lat,
										lon,
								  }
						}
					/>
				</div>

				<div className="lg:col-span-5 flex flex-col min-w-0">
					<WeatherMap
						lat={lat}
						lon={lon}
						city={displayName}
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
