import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { X, Loader2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { WeatherIcon } from "./weather-icon";
import { useUnitSettings } from "@/context/unit-settings-provider";

interface FavoriteCityTabletProps {
	id: string;
	name: string;
	lat: number;
	lon: number;
	onRemove: (id: string) => void;
	isDragActive: () => boolean;
}

function FavoriteCityTablet({
	id,
	name,
	lat,
	lon,
	onRemove,
	isDragActive,
}: FavoriteCityTabletProps) {
	const navigate = useNavigate();
	const { data: weather, isLoading } = useWeatherQuery({ lat, lon });
	const { formatTemp } = useUnitSettings();

	const handleClick = () => {
		if (isDragActive()) return;
		navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
	};

	return (
		<div
			onClick={handleClick}
			className="group relative flex min-w-[240px] max-w-[280px] shrink-0 cursor-pointer items-center justify-between gap-3 border border-border bg-card p-3 hover:bg-muted/40 transition-colors select-none rounded-lg"
			role="button"
			tabIndex={0}
		>
			<button
				type="button"
				className="absolute right-1.5 top-1.5 h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all border border-border/60 bg-background rounded-md cursor-pointer z-10"
				onClick={(e) => {
					e.stopPropagation();
					onRemove(id);
					toast.info(`Removed ${name} from saved cities`);
				}}
				title="Remove from saved cities"
			>
				<X className="size-3" />
			</button>

			{isLoading ? (
				<div className="flex h-10 w-full items-center justify-center font-mono text-xs text-muted-foreground gap-2">
					<Loader2 className="size-3.5 animate-spin" />
					<span>Loading...</span>
				</div>
			) : weather ? (
				<>
					<div className="flex items-center gap-2.5 truncate">
						<div className="size-8 p-0.5 border border-border/80 bg-muted/20 rounded flex items-center justify-center shrink-0">
							<WeatherIcon
								iconCode={weather.weather[0].icon}
								className="size-6 object-contain"
							/>
						</div>
						<div className="truncate">
							<p className="font-medium text-xs text-foreground truncate">{name}</p>
							<p className="font-mono text-[10px] text-muted-foreground">
								{weather.sys.country} · {lat.toFixed(1)}°, {lon.toFixed(1)}°
							</p>
						</div>
					</div>

					<div className="text-right shrink-0 pr-1">
						<p className="font-mono text-base font-semibold text-foreground tabular-nums">
							{formatTemp(weather.main.temp)}
						</p>
						<p className="text-[10px] capitalize text-muted-foreground truncate max-w-[80px]">
							{weather.weather[0].main}
						</p>
					</div>
				</>
			) : null}
		</div>
	);
}

export function FavoriteCities() {
	const { favorites, removeFavorite } = useFavorites();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const dragStartX = useRef(0);
	const dragScrollLeft = useRef(0);
	const hasDragged = useRef(false);

	const updateScrollBounds = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const { scrollLeft, scrollWidth, clientWidth } = el;
		setCanScrollLeft(scrollLeft > 2);
		setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
	}, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		updateScrollBounds();
		el.addEventListener("scroll", updateScrollBounds, { passive: true });
		window.addEventListener("resize", updateScrollBounds);

		const resizeObserver = new ResizeObserver(updateScrollBounds);
		resizeObserver.observe(el);

		return () => {
			el.removeEventListener("scroll", updateScrollBounds);
			window.removeEventListener("resize", updateScrollBounds);
			resizeObserver.disconnect();
		};
	}, [updateScrollBounds, favorites.length]);

	// Mouse wheel horizontal scrolling
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const handleWheel = (e: WheelEvent) => {
			if (e.deltaY !== 0) {
				const maxScroll = el.scrollWidth - el.clientWidth;
				if (maxScroll > 0) {
					if (
						(e.deltaY > 0 && el.scrollLeft < maxScroll) ||
						(e.deltaY < 0 && el.scrollLeft > 0)
					) {
						e.preventDefault();
						el.scrollLeft += e.deltaY;
					}
				}
			}
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, []);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const offset = direction === "left" ? -280 : 280;
			scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
		}
	};

	// Drag-to-scroll handlers
	const handleMouseDown = (e: React.MouseEvent) => {
		const el = scrollRef.current;
		if (!el) return;
		setIsDragging(true);
		hasDragged.current = false;
		dragStartX.current = e.pageX - el.offsetLeft;
		dragScrollLeft.current = el.scrollLeft;
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !scrollRef.current) return;
		const el = scrollRef.current;
		const x = e.pageX - el.offsetLeft;
		const walk = (x - dragStartX.current) * 1.2;
		if (Math.abs(walk) > 5) {
			hasDragged.current = true;
		}
		el.scrollLeft = dragScrollLeft.current - walk;
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		setTimeout(() => {
			hasDragged.current = false;
		}, 50);
	};

	if (!favorites.length) {
		return null;
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="font-mono text-xs text-muted-foreground font-medium flex items-center gap-1.5">
					<Bookmark className="size-3 text-foreground" />
					Saved cities ({favorites.length})
				</h2>
				<div className="flex items-center border border-border rounded-md overflow-hidden">
					<button
						type="button"
						onClick={() => scroll("left")}
						disabled={!canScrollLeft}
						className="h-6 w-6 flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
						aria-label="Scroll left"
						title="Scroll left"
					>
						<ChevronLeft className="size-3.5" />
					</button>
					<div className="h-3.5 w-px bg-border/60" />
					<button
						type="button"
						onClick={() => scroll("right")}
						disabled={!canScrollRight}
						className="h-6 w-6 flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
						aria-label="Scroll right"
						title="Scroll right"
					>
						<ChevronRight className="size-3.5" />
					</button>
				</div>
			</div>

			<div
				ref={scrollRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				className={`flex gap-2.5 overflow-x-auto pb-1 pt-0.5 w-full scrollbar-hide touch-pan-x ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"
					}`}
				style={{
					WebkitOverflowScrolling: "touch",
				}}
			>
				{favorites.map((city) => (
					<FavoriteCityTablet
						key={city.id}
						{...city}
						onRemove={(id) => removeFavorite.mutate(id)}
						isDragActive={() => hasDragged.current}
					/>
				))}
			</div>
		</div>
	);
}
