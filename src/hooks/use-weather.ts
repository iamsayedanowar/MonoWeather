import { useQuery } from "@tanstack/react-query";
import { weatherAPI } from "@/api/weather";
import type { Coordinates } from "@/api/types";

const DEFAULT_COORDINATES: Coordinates = { lat: 0, lon: 0 };

export const WEATHER_KEYS = {
	weather: (coords: Coordinates) => ["weather", coords] as const,
	forecast: (coords: Coordinates) => ["forecast", coords] as const,
	airPollution: (coords: Coordinates) => ["air-pollution", coords] as const,
	location: (coords: Coordinates) => ["location", coords] as const,
	search: (query: string) => ["location-search", query] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates | null) {
	return useQuery({
		queryKey: WEATHER_KEYS.weather(coordinates ?? DEFAULT_COORDINATES),
		queryFn: () =>
			coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
		enabled: !!coordinates,
	});
}

export function useForecastQuery(coordinates: Coordinates | null) {
	return useQuery({
		queryKey: WEATHER_KEYS.forecast(coordinates ?? DEFAULT_COORDINATES),
		queryFn: () => (coordinates ? weatherAPI.getForecast(coordinates) : null),
		enabled: !!coordinates,
	});
}

export function useAirPollutionQuery(coordinates: Coordinates | null) {
	return useQuery({
		queryKey: WEATHER_KEYS.airPollution(coordinates ?? DEFAULT_COORDINATES),
		queryFn: () =>
			coordinates ? weatherAPI.getAirPollution(coordinates) : null,
		enabled: !!coordinates,
	});
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
	return useQuery({
		queryKey: WEATHER_KEYS.location(coordinates ?? DEFAULT_COORDINATES),
		queryFn: () =>
			coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
		enabled: !!coordinates,
	});
}

export function useLocationSearch(query: string) {
	return useQuery({
		queryKey: WEATHER_KEYS.search(query),
		queryFn: () => weatherAPI.searchLocations(query),
		enabled: query.trim().length >= 3,
		staleTime: 60 * 1000,
	});
}