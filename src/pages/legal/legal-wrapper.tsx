import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileText, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalWrapperProps extends PropsWithChildren {
	activeTab: "privacy" | "terms" | "disclaimer";
	title: string;
	subtitle: string;
	lastUpdated: string;
	docCode: string;
}

export function LegalWrapper({
	activeTab,
	title,
	subtitle,
	lastUpdated,
	docCode,
	children,
}: LegalWrapperProps) {
	const tabs = [
		{
			id: "privacy",
			name: "Privacy policy",
			href: "/privacy",
			icon: ShieldCheck,
			tag: "Zero-tracking",
		},
		{
			id: "terms",
			name: "Terms of service",
			href: "/terms",
			icon: FileText,
			tag: "Terms",
		},
		{
			id: "disclaimer",
			name: "Disclaimer",
			href: "/disclaimer",
			icon: AlertTriangle,
			tag: "Advisory",
		},
	];

	return (
		<div className="space-y-8 max-w-5xl mx-auto py-2">
			{/* Top Bar: Back Link & Observatory Breadcrumb */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
				<div className="flex items-center gap-2">
					<Link to="/">
						<Button variant="outline" size="sm" className="gap-1.5 font-mono text-xs rounded-md">
							<ArrowLeft className="size-3.5" />
							<span>Dashboard</span>
						</Button>
					</Link>
					<span className="text-border">/</span>
					<div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
						<span>Legal documentation</span>
					</div>
				</div>

				<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground self-start sm:self-auto">
					<span className="px-2 py-0.5 border border-border bg-card rounded">
						{docCode}
					</span>
					<span className="px-2 py-0.5 border border-border bg-muted/40 text-foreground rounded">
						{lastUpdated}
					</span>
				</div>
			</div>

			{/* Main Document Header */}
			<div className="space-y-2">
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-sans">
					{title}
				</h1>
				<p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
					{subtitle}
				</p>
			</div>

			{/* Tab Navigation Pill Bar */}
			<div className="border border-border bg-card/60 p-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 font-mono rounded-lg">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return (
						<Link
							key={tab.id}
							to={tab.href}
							className={`flex items-center justify-between px-3.5 py-2 text-xs transition-colors border rounded-sm ${isActive
								? "bg-foreground text-background border-foreground font-medium shadow-sm"
								: "bg-background/50 text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/60"
								}`}
						>
							<div className="flex items-center gap-2 truncate">
								<Icon className={`size-3.5 shrink-0 ${isActive ? "text-background" : "text-muted-foreground"}`} />
								<span className="truncate">{tab.name}</span>
							</div>
							<span
								className={`text-[10px] px-1.5 py-0.5 border rounded hidden md:inline-block ${isActive
									? "border-background/40 bg-background/20 text-background"
									: "border-border/60 bg-muted/40 text-muted-foreground"
									}`}
							>
								{tab.tag}
							</span>
						</Link>
					);
				})}
			</div>

			{/* Document Content */}
			<div className="space-y-8">
				{children}
			</div>

			{/* Bottom Assistance & Cross-Reference Box */}
			<div className="border border-border bg-card p-6 space-y-4 font-mono text-xs rounded-lg">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
					<div className="space-y-1">
						<h4 className="text-foreground font-semibold text-sm flex items-center gap-2">
							<span>Legal questions & contact</span>
						</h4>
						<p className="text-muted-foreground text-xs normal-case">
							Have questions, reports of discrepancies, or privacy questions regarding the platform?
						</p>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<a
							href="https://sayedanowar.netlify.app/"
							target="_blank"
							rel="noreferrer noopener"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground transition-colors text-xs rounded-md"
						>
							<span>Sayed Anowar</span>
							<ExternalLink className="size-3" />
						</a>
						<a
							href="https://github.com/iamsayedanowar"
							target="_blank"
							rel="noreferrer noopener"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground transition-colors text-xs rounded-md"
						>
							<span>GitHub</span>
							<ExternalLink className="size-3" />
						</a>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
					<div className="flex items-center gap-2">
						<span>Jump to:</span>
						{tabs
							.filter((t) => t.id !== activeTab)
							.map((t, idx, arr) => (
								<span key={t.id} className="flex items-center gap-2">
									<Link to={t.href} className="text-foreground hover:underline">
										{t.name}
									</Link>
									{idx < arr.length - 1 && <span>·</span>}
								</span>
							))}
					</div>
					<span>Version 2.4.0 · Client-side architecture</span>
				</div>
			</div>
		</div>
	);
}

