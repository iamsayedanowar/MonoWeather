import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeatherData } from "@/api/types";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
	data: WeatherData & { state?: string };
	className?: string;
}

export function FavoriteButton({ data, className }: FavoriteButtonProps) {
	const { addFavorite, removeFavorite, isFavorite } = useFavorites();
	const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

	const handleToggleFavorite = () => {
		if (isCurrentlyFavorite) {
			removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
			toast.info(`Removed ${data.name} from favorites`);
		} else {
			addFavorite.mutate({
				name: data.name,
				lat: data.coord.lat,
				lon: data.coord.lon,
				country: data.sys.country,
				state: data.state,
			});
			toast.success(`Saved ${data.name} to favorites`);
		}
	};

	return (
		<Button
			variant={isCurrentlyFavorite ? "default" : "outline"}
			size="sm"
			onClick={handleToggleFavorite}
			className={cn(
				"font-mono text-xs cursor-pointer rounded-md",
				isCurrentlyFavorite
					? "bg-foreground text-background hover:bg-foreground/90 border-foreground"
					: "hover:bg-secondary text-foreground",
				className
			)}
			title={isCurrentlyFavorite ? "Remove from favorites" : "Save to favorites"}
			aria-label={isCurrentlyFavorite ? "Remove from favorites" : "Save to favorites"}
		>
			<Star className="size-3.5 sm:mr-1.5" />
			<span className="hidden sm:inline">{isCurrentlyFavorite ? "Saved" : "Save"}</span>
		</Button>
	);
}
