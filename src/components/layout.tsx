import { useState, useEffect, type PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "./header";

function PlatformStatus() {
	const queryClient = useQueryClient();
	const [lastSynced, setLastSynced] = useState<string>("Just now");
	const [isHealthy, setIsHealthy] = useState<boolean>(true);

	useEffect(() => {
		const updateStatus = () => {
			const queries = queryClient.getQueryCache().getAll();
			const hasError = queries.some((q) => q.state.status === "error");
			setIsHealthy(!hasError);

			const latest = queries.reduce(
				(max, q) => Math.max(max, q.state.dataUpdatedAt || 0),
				0
			);

			if (!latest) {
				setLastSynced("Just now");
				return;
			}

			const diffSec = Math.floor((Date.now() - latest) / 1000);
			if (diffSec < 60) {
				setLastSynced("Just now");
			} else {
				const diffMin = Math.floor(diffSec / 60);
				setLastSynced(`${diffMin} min${diffMin > 1 ? "s" : ""} ago`);
			}
		};

		updateStatus();
		const interval = setInterval(updateStatus, 15000);
		const unsubscribe = queryClient.getQueryCache().subscribe(() => {
			updateStatus();
		});

		return () => {
			clearInterval(interval);
			unsubscribe();
		};
	}, [queryClient]);

	return (
		<div className="space-y-2">
			<h4 className="font-mono text-xs text-foreground font-medium">
				System status
			</h4>
			<div className="border border-border bg-card p-3 space-y-1.5 rounded-lg text-xs font-mono">
				<div className="flex justify-between items-center">
					<span className="text-muted-foreground">API feed:</span>
					<span className="text-foreground flex items-center gap-1.5">
						<span
							className={`h-1.5 w-1.5 rounded-full animate-pulse ${isHealthy ? "bg-emerald-500" : "bg-amber-500"}`}
						/>
						{isHealthy ? "Operational" : "Degraded"}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-muted-foreground">Last updated:</span>
					<span className="text-foreground">{lastSynced}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-muted-foreground">Privacy:</span>
					<span className="text-foreground">Client-side only</span>
				</div>
			</div>
		</div>
	);
}

export function Layout({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
			<Header />

			<main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl min-w-0">
				{children}
			</main>

			<footer className="border-t border-border bg-card/60 backdrop-blur-sm mt-16">
				<div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-border/80">
						{/* Station Overview */}
						<div className="space-y-2.5 sm:col-span-2 lg:col-span-1">
							<div className="flex items-center gap-2">
								<span className="font-mono text-xs font-semibold tracking-wide text-foreground">
									MonoWeather
								</span>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Live weather telemetry, interactive radar, and air quality monitoring for locations worldwide.
							</p>
							<div className="pt-1 font-mono text-[11px] text-muted-foreground flex items-center gap-2">
								<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
								<span>Live data feeds active</span>
							</div>
						</div>

						{/* Ingestion Channels / Data Sources */}
						<div className="space-y-2">
							<h4 className="font-mono text-xs font-medium text-foreground">
								Data sources
							</h4>
							<ul className="space-y-1.5 text-xs text-muted-foreground">
								<li>
									<span className="hover:text-foreground transition-colors cursor-default">OpenWeather API</span>
								</li>
								<li>
									<span className="hover:text-foreground transition-colors cursor-default">MapLibre GL</span>
								</li>
							</ul>
						</div>

						{/* Legal & Compliance */}
						<div className="space-y-2">
							<h4 className="font-mono text-xs font-medium text-foreground">
								Legal
							</h4>
							<ul className="space-y-1.5 text-xs text-muted-foreground">
								<li>
									<Link to="/privacy" className="hover:text-foreground transition-colors">
										Privacy policy
									</Link>
								</li>
								<li>
									<Link to="/terms" className="hover:text-foreground transition-colors">
										Terms of service
									</Link>
								</li>
								<li>
									<Link to="/disclaimer" className="hover:text-foreground transition-colors">
										Disclaimer
									</Link>
								</li>
							</ul>
						</div>

						{/* System Status & SLA */}
						<PlatformStatus />
					</div>

					{/* Bottom Legal & Monospace metadata */}
					<div className="pt-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 text-xs text-muted-foreground">
						{/* Left: Copyright & Developer */}
						<div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
							<span>© {new Date().getFullYear()} MonoWeather</span>
							<span>•</span>
							<span>
								Built by{" "}
								<a
									href="https://sayedanowar.netlify.app/"
									target="_blank"
									rel="noreferrer noopener"
									className="text-foreground hover:underline transition-colors"
								>
									Sayed Anowar
								</a>
							</span>
						</div>

						{/* Middle: Legal Quick Links & GitHub */}
						<div className="flex flex-wrap items-center justify-center gap-3">
							<Link to="/privacy" className="hover:text-foreground transition-colors">
								Privacy
							</Link>
							<span>•</span>
							<Link to="/terms" className="hover:text-foreground transition-colors">
								Terms
							</Link>
							<span>•</span>
							<Link to="/disclaimer" className="hover:text-foreground transition-colors">
								Disclaimer
							</Link>
							<span>•</span>
							<a
								href="https://github.com/iamsayedanowar"
								target="_blank"
								rel="noreferrer noopener"
								className="hover:text-foreground transition-colors"
							>
								GitHub
							</a>
						</div>

						{/* End / Right: Version */}
						<div className="flex items-center justify-center md:justify-end gap-3 font-mono text-[11px]">
							<span className="px-1.5 py-0.5 border border-border rounded text-[10px] bg-muted/40">
								v2.4.0
							</span>
							<span>Zero tracking</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
