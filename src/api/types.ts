export interface Coordinates {
	lat: number;
	lon: number;
}

export interface GeocodingResponse {
	name: string;
	local_names?: Record<string, string>;
	lat: number;
	lon: number;
	country: string;
	state?: string;
}

export interface WeatherCondition {
	id: number;
	main: string;
	description: string;
	icon: string;
}

export interface WeatherData {
	coord: Coordinates;
	weather: WeatherCondition[];
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level?: number;
		grnd_level?: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	sys: {
		sunrise: number;
		sunset: number;
		country: string;
	};
	clouds: {
		all: number;
	};
	name: string;
	dt: number;
}

export interface ForecastData {
	list: Array<{
		dt: number;
		main: WeatherData["main"];
		weather: WeatherData["weather"];
		wind: WeatherData["wind"];
		clouds: WeatherData["clouds"];
		dt_txt: string;
		pop: number;
		visibility: number;
	}>;
	city: {
		name: string;
		country: string;
		sunrise: number;
		sunset: number;
	};
}

export interface AirPollutionData {
	list: Array<{
		main: {
			aqi: number; // 1: Good, 2: Fair, 3: Moderate, 4: Poor, 5: Very Poor
		};
		components: {
			co: number;
			no: number;
			no2: number;
			o3: number;
			so2: number;
			pm2_5: number;
			pm10: number;
			nh3: number;
		};
		dt: number;
	}>;
}