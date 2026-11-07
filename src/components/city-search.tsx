import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Search, Loader2, Clock, Star, Trash2 } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorite";

export function CitySearch() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const { data: locations, isLoading } = useLocationSearch(query);
	const { favorites } = useFavorites();
	const { history, clearHistory, addToHistory } = useSearchHistory();

	// Global keyboard shortcut (Cmd+K / Ctrl+K / /)
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const handleSelect = (value: string) => {
		const [latStr, lonStr] = value.split("|");
		const lat = parseFloat(latStr);
		const lon = parseFloat(lonStr);

		const originalLocation =
			locations?.find((l) => Math.abs(l.lat - lat) < 0.001 && Math.abs(l.lon - lon) < 0.001) ||
			favorites.find((f) => Math.abs(f.lat - lat) < 0.001 && Math.abs(f.lon - lon) < 0.001) ||
			history.find((h) => Math.abs(h.lat - lat) < 0.001 && Math.abs(h.lon - lon) < 0.001);

		if (!originalLocation) return;

		addToHistory.mutate({
			query,
			name: originalLocation.name,
			lat,
			lon,
			country: originalLocation.country,
			state: originalLocation.state || undefined,
		});

		setOpen(false);
		navigate(`/city/${originalLocation.name}?lat=${lat}&lon=${lon}`);
	};

	return (
		<>
			<Button
				variant="outline"
				size="icon"
				className="h-8 w-8 cursor-pointer rounded-md hover:bg-secondary text-foreground"
				onClick={() => setOpen(true)}
				title="Search city or airport (⌘K)"
				aria-label="Search city or airport"
			>
				<Search className="size-3.5" />
			</Button>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<Command className="rounded-lg">
					<CommandInput
						placeholder="Search city, airport, or coordinates..."
						value={query}
						onValueChange={setQuery}
					/>
					<CommandList>
						{query.length > 2 && !isLoading && locations?.length === 0 && (
							<CommandEmpty>No matching cities found.</CommandEmpty>
						)}

						{/* Favorites Section */}
						{favorites.length > 0 && (
							<CommandGroup heading="Saved cities">
								{favorites.map((city) => (
									<CommandItem
										key={city.id}
										value={`${city.lat}|${city.lon}|${city.name}|${city.country}|${city.state || ""}`}
										onSelect={handleSelect}
										className="flex items-center justify-between py-2 text-xs"
									>
										<div className="flex items-center gap-2 truncate">
											<Star className="h-3.5 w-3.5 text-foreground shrink-0 fill-foreground" />
											<span className="font-medium text-foreground">{city.name}</span>
											{city.state && (
												<span className="text-muted-foreground">{city.state},</span>
											)}
											<span className="text-muted-foreground">{city.country}</span>
										</div>
										<span className="font-mono text-[11px] text-muted-foreground shrink-0">
											{city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}

						{/* Search History Section */}
						{history.length > 0 && (
							<CommandGroup>
								<div className="flex items-center justify-between px-2 py-1 border-b border-border/40 mb-1">
									<span className="text-xs font-mono text-muted-foreground">
										Recent searches
									</span>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											clearHistory.mutate();
										}}
										className="text-xs font-mono text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer"
									>
										<Trash2 className="size-3" />
										Clear
									</button>
								</div>
								{history.map((item) => (
									<CommandItem
										key={item.id}
										value={`${item.lat}|${item.lon}|${item.name}|${item.country}|${item.state || ""}`}
										onSelect={handleSelect}
										className="flex items-center justify-between py-2 text-xs"
									>
										<div className="flex items-center gap-2 truncate">
											<Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
											<span className="font-medium text-foreground">{item.name}</span>
											{item.state && (
												<span className="text-muted-foreground">{item.state},</span>
											)}
											<span className="text-muted-foreground">{item.country}</span>
										</div>
										<span className="font-mono text-[10px] text-muted-foreground shrink-0">
											{format(item.searchedAt, "HH:mm")}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}

						{/* Search Results */}
						{locations && locations.length > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup heading="Matching Cities">
									{isLoading && (
										<div className="flex items-center justify-center p-4">
											<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
										</div>
									)}
									{locations?.map((location) => (
										<CommandItem
											key={`${location.lat}-${location.lon}`}
											value={`${location.lat}|${location.lon}|${location.name}|${location.country}|${location.state || ""}`}
											onSelect={handleSelect}
											className="flex items-center justify-between py-2 text-xs"
										>
											<div className="flex items-center gap-2 truncate">
												<Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
												<span className="font-medium text-foreground">{location.name}</span>
												{location.state && (
													<span className="text-muted-foreground">{location.state},</span>
												)}
												<span className="text-muted-foreground font-mono text-[11px] uppercase">
													{location.country}
												</span>
											</div>
											<span className="font-mono text-[10px] text-muted-foreground shrink-0">
												{location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</CommandDialog>
		</>
	);
}
