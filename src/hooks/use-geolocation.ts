import { useState, useEffect } from "react";
import type { Coordinates } from "@/api/types";

interface GeolocationState {
	coordinates: Coordinates | null;
	error: string | null;
	isLoading: boolean;
}

export function useGeolocation() {
	const [locationData, setLocationData] = useState<GeolocationState>({
		coordinates: null,
		error: null,
		isLoading: true,
	});

	const getLocation = () => {
		setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

		if (!navigator.geolocation) {
			setLocationData({
				coordinates: null,
				error: "Geolocation not supported",
				isLoading: false,
			});
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocationData({
					coordinates: {
						lat: position.coords.latitude,
						lon: position.coords.longitude,
					},
					error: null,
					isLoading: false,
				});
			},
			(error) => {
				let errorMessage: string;

				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage = "Location access denied";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage = "Location unavailable";
						break;
					case error.TIMEOUT:
						errorMessage = "Location request timed out";
						break;
					default:
						errorMessage = "Location detection failed";
				}

				setLocationData({
					coordinates: null,
					error: errorMessage,
					isLoading: false,
				});
			},
			{
				enableHighAccuracy: true,
			}
		);
	};

	// Get location on component mount
	useEffect(() => {
		getLocation();
	}, []);

	return {
		...locationData,
		getLocation, // Expose method to manually refresh location
	};
}