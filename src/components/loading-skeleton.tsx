import { Skeleton } from "./ui/skeleton";

function WeatherSkeleton() {
	return (
		<div className="space-y-6 min-w-0">
			{/* Top Header skeleton */}
			<div className="flex items-center justify-between border-b border-border/80 pb-3">
				<div className="space-y-2">
					<Skeleton className="h-4 w-48" />
					<Skeleton className="h-3 w-72" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</div>
			</div>

			{/* Main Grid: Weather Telemetry + Map */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
				{/* Current Weather Skeleton */}
				<div className="lg:col-span-7 border border-border bg-card p-5 space-y-6 rounded-lg">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-8 w-44 rounded-md" />
							<Skeleton className="h-3 w-32 rounded" />
						</div>
						<Skeleton className="size-16 rounded-lg" />
					</div>

					<div className="space-y-2">
						<Skeleton className="h-16 w-36 rounded-md" />
						<Skeleton className="h-3 w-56 rounded" />
					</div>

					{/* 8-Tile Grid skeleton */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton key={i} className="h-20 w-full rounded-lg" />
						))}
					</div>
				</div>

				{/* Map Skeleton */}
				<div className="lg:col-span-5 border border-border bg-card min-h-[380px] p-4 flex flex-col justify-between rounded-lg">
					<div className="flex justify-between items-center">
						<Skeleton className="h-4 w-32 rounded" />
						<Skeleton className="h-4 w-24 rounded" />
					</div>
					<div className="flex items-center justify-center">
						<div className="flex flex-col items-center gap-2 font-mono text-xs text-muted-foreground">
							<Skeleton className="size-10 rounded-full" />
							<span>Loading radar...</span>
						</div>
					</div>
					<Skeleton className="h-4 w-40 rounded" />
				</div>
			</div>

			{/* Forecast Skeleton Deck */}
			<div className="border border-border bg-card p-5 space-y-4 rounded-lg">
				<div className="flex justify-between items-center">
					<Skeleton className="h-5 w-48 rounded" />
					<Skeleton className="h-7 w-28 rounded-md" />
				</div>
				<Skeleton className="h-40 w-full rounded-md" />
				<div className="flex gap-3 overflow-hidden">
					{Array.from({ length: 7 }).map((_, i) => (
						<Skeleton key={i} className="h-28 min-w-[108px] shrink-0 rounded-lg" />
					))}
				</div>
			</div>

			{/* Air Quality Skeleton */}
			<div className="border border-border bg-card p-5 space-y-4 rounded-lg">
				<Skeleton className="h-5 w-60 rounded" />
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-24 w-full rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
}

export default WeatherSkeleton;
