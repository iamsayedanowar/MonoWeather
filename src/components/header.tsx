import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";
import { SettingsDialog } from "./settings-dialog";
import { useTheme } from "@/context/theme-provider";

export function Header() {
	const { resolvedTheme } = useTheme();
	const [timeString, setTimeString] = useState<string>("");

	useEffect(() => {
		const update = () => {
			const now = new Date();
			const utc = now.toUTCString().slice(17, 25);
			setTimeString(utc);
		};
		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
			<div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 max-w-7xl">
				{/* Brand Identification */}
				<div className="flex items-center gap-6">
					<Link to="/" className="flex items-center gap-2.5 group">
						<div className="relative flex items-center justify-center">
							<img
								src={resolvedTheme === "dark" ? "/logo.svg" : "/logo2.svg"}
								alt="MonoWeather Home"
								className="h-8 w-auto object-contain transition-opacity group-hover:opacity-85"
							/>
						</div>
					</Link>

					{/* Live telemetry indicator */}
					<div className="hidden sm:flex items-center pl-4 border-l border-border/80">
						<span className="font-mono text-xs text-muted-foreground">
							UTC {timeString || "00:00:00"}
						</span>
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-2.5 sm:gap-3">
					<CitySearch />
					<div className="h-4 w-px bg-border/60 hidden sm:block" />
					<SettingsDialog />
				</div>
			</div>
		</header>
	);
}
