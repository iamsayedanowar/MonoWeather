import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-provider";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="h-8 w-8 flex items-center justify-center border border-border bg-background hover:bg-secondary text-foreground transition-colors cursor-pointer rounded-md"
			title={isDark ? "Switch to light theme" : "Switch to dark theme"}
			aria-label="Toggle theme"
		>
			{isDark ? (
				<Sun className="size-3.5 transition-transform duration-200 rotate-0 text-foreground" />
			) : (
				<Moon className="size-3.5 transition-transform duration-200 rotate-0 text-foreground" />
			)}
		</button>
	);
}
