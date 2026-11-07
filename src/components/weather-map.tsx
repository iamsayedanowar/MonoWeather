import {
	Map,
	MapMarker,
	MarkerContent,
	MarkerPopup,
	MarkerTooltip,
	MapControls,
} from "@/components/ui/map";
import { MapPin, Radar } from "lucide-react";

interface WeatherMapProps {
	lat: number;
	lon: number;
	city?: string;
}

export function WeatherMap({ lat, lon, city }: WeatherMapProps) {
	return (
		<div className="h-full min-h-[340px] lg:min-h-0 w-full rounded-lg overflow-hidden border border-border bg-card relative z-0 flex flex-col">
			{/* Top Bar */}
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card text-card-foreground text-xs font-mono select-none">
				<div className="flex items-center gap-2">
					<Radar className="size-3.5 text-muted-foreground" />
					<span className="font-medium text-foreground">
						Radar map
					</span>
				</div>
				<div className="text-muted-foreground text-[11px]">
					{lat.toFixed(4)}°N, {lon.toFixed(4)}°E
				</div>
			</div>

			{/* Map Frame */}
			<div className="relative flex-1 w-full min-h-[280px]">
				<Map center={[lon, lat]} zoom={11}>
					<MapControls showFullscreen showCompass showZoom position="top-right" />
					<MapMarker longitude={lon} latitude={lat}>
						<MarkerContent>
							<div className="relative flex size-4 items-center justify-center">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/75" />
								<div className="relative size-4 rounded-full border-2 border-background bg-foreground shadow-sm flex items-center justify-center">
									<div className="size-1.5 rounded-full bg-background" />
								</div>
							</div>
						</MarkerContent>
						{city && (
							<MarkerTooltip>
								<div className="font-mono text-xs">
									{city}
								</div>
							</MarkerTooltip>
						)}
						{city && (
							<MarkerPopup>
								<div className="space-y-1 font-mono text-xs">
									<p className="font-medium text-foreground flex items-center gap-1.5">
										<MapPin className="size-3" />
										{city}
									</p>
									<p className="text-muted-foreground text-[11px]">
										{lat.toFixed(4)}°N, {lon.toFixed(4)}°E
									</p>
								</div>
							</MarkerPopup>
						)}
					</MapMarker>
				</Map>

				{/* Bottom corner radar badge */}
				<div className="absolute bottom-2 left-2 pointer-events-none z-10 border border-border/80 bg-background/90 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-sm rounded">
					Interactive radar
				</div>
			</div>
		</div>
	);
}
