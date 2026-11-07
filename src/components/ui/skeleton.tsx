import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("animate-pulse rounded-[var(--radius)] bg-muted/70 border border-border/40", className)}
			{...props}
		/>
	);
}

export { Skeleton };
