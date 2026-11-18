import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		target: "esnext",
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("maplibre-gl")) {
							return "vendor-map";
						}
						if (id.includes("recharts")) {
							return "vendor-charts";
						}
						if (id.includes("react-dom") || id.includes("react-router-dom") || id.includes("/react/")) {
							return "vendor-react";
						}
						if (id.includes("@tanstack")) {
							return "vendor-query";
						}
						if (id.includes("@radix-ui") || id.includes("cmdk")) {
							return "vendor-ui";
						}
					}
				},
			},
		},
	},
});
