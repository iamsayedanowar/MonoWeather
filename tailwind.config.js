/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
	return ({ opacityValue }) => {
		if (opacityValue !== undefined) {
			return `color-mix(in oklch, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
		}
		return `var(${variableName})`;
	};
}

export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", "'Google Sans'", "sans-serif"],
				serif: ["var(--font-serif)", "Merriweather", "Georgia", "serif"],
				mono: ["var(--font-mono)", "'JetBrains Mono'", "monospace"],
				"open-sans": ["var(--font-open-sans)", "'Open Sans'", "sans-serif"],
			},
			borderRadius: {
				none: "0px",
				sm: "calc(var(--radius) - 4px)",
				md: "calc(var(--radius) - 2px)",
				lg: "var(--radius)",
				xl: "calc(var(--radius) + 4px)",
				full: "9999px",
			},
			colors: {
				background: withOpacity("--background"),
				foreground: withOpacity("--foreground"),
				card: {
					DEFAULT: withOpacity("--card"),
					foreground: withOpacity("--card-foreground"),
				},
				popover: {
					DEFAULT: withOpacity("--popover"),
					foreground: withOpacity("--popover-foreground"),
				},
				primary: {
					DEFAULT: withOpacity("--primary"),
					foreground: withOpacity("--primary-foreground"),
				},
				secondary: {
					DEFAULT: withOpacity("--secondary"),
					foreground: withOpacity("--secondary-foreground"),
				},
				muted: {
					DEFAULT: withOpacity("--muted"),
					foreground: withOpacity("--muted-foreground"),
				},
				accent: {
					DEFAULT: withOpacity("--accent"),
					foreground: withOpacity("--accent-foreground"),
				},
				destructive: {
					DEFAULT: withOpacity("--destructive"),
					foreground: withOpacity("--destructive-foreground"),
				},
				border: withOpacity("--border"),
				input: withOpacity("--input"),
				ring: withOpacity("--ring"),
				chart: {
					"1": withOpacity("--chart-1"),
					"2": withOpacity("--chart-2"),
					"3": withOpacity("--chart-3"),
					"4": withOpacity("--chart-4"),
					"5": withOpacity("--chart-5"),
				},
				sidebar: {
					DEFAULT: withOpacity("--sidebar"),
					foreground: withOpacity("--sidebar-foreground"),
					primary: withOpacity("--sidebar-primary"),
					"primary-foreground": withOpacity("--sidebar-primary-foreground"),
					accent: withOpacity("--sidebar-accent"),
					"accent-foreground": withOpacity("--sidebar-accent-foreground"),
					border: withOpacity("--sidebar-border"),
					ring: withOpacity("--sidebar-ring"),
				},
			},
			boxShadow: {
				"2xs": "var(--shadow-2xs)",
				xs: "var(--shadow-xs)",
				sm: "var(--shadow-sm)",
				DEFAULT: "var(--shadow)",
				md: "var(--shadow-md)",
				lg: "var(--shadow-lg)",
				xl: "var(--shadow-xl)",
				"2xl": "var(--shadow-2xl)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
