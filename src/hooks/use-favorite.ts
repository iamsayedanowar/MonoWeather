// src/hooks/use-favorites.ts
import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

export interface FavoriteCity {
	id: string;
	name: string;
	lat: number;
	lon: number;
	country: string;
	state?: string;
	addedAt: number;
}

export function useFavorites() {
	const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
		"favorites",
		[]
	);
	const queryClient = useQueryClient();

	const favoritesQuery = useQuery({
		queryKey: ["favorites"],
		queryFn: () => favorites,
		initialData: favorites,
		staleTime: Infinity, // Since we're managing the data in localStorage
	});

	const addFavorite = useMutation({
		mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
			const newFavorite: FavoriteCity = {
				...city,
				id: `${city.lat}-${city.lon}`,
				addedAt: Date.now(),
			};

			// Prevent duplicates
			const exists = favorites.some((fav) => fav.id === newFavorite.id);
			if (exists) return favorites;

			const newFavorites = [...favorites, newFavorite];
			setFavorites(newFavorites);
			return newFavorites;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});

	const removeFavorite = useMutation({
		mutationFn: async (cityId: string) => {
			const newFavorites = favorites.filter((city) => city.id !== cityId);
			setFavorites(newFavorites);
			return newFavorites;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});

	const favoriteKeySet = useMemo(() => {
		const set = new Set<string>();
		for (const fav of favorites) {
			set.add(`${fav.lat.toFixed(4)},${fav.lon.toFixed(4)}`);
		}
		return set;
	}, [favorites]);

	const isFavorite = useCallback(
		(lat: number, lon: number) => favoriteKeySet.has(`${lat.toFixed(4)},${lon.toFixed(4)}`),
		[favoriteKeySet]
	);

	return {
		favorites: favoritesQuery.data ?? [],
		addFavorite,
		removeFavorite,
		isFavorite,
	};
}