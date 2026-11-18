import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { WeatherDashboard } from "./pages/weather-dashboard";
import { Layout } from "./components/layout";
import { ThemeProvider } from "./context/theme-provider";
import { UnitSettingsProvider } from "./context/unit-settings-provider";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/scroll-to-top";
import WeatherSkeleton from "./components/loading-skeleton";

// Lazy-load sub-routes and legal pages to minimize initial bundle payload
const CityPage = lazy(() =>
	import("./pages/city-page").then((m) => ({ default: m.CityPage }))
);
const PrivacyPolicyPage = lazy(() =>
	import("./pages/legal/privacy-policy").then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsAndConditionsPage = lazy(() =>
	import("./pages/legal/terms-and-conditions").then((m) => ({ default: m.TermsAndConditionsPage }))
);
const DisclaimerPage = lazy(() =>
	import("./pages/legal/disclaimer").then((m) => ({ default: m.DisclaimerPage }))
);

// Lazy-load ReactQueryDevtools only in development
const ReactQueryDevtools = import.meta.env.DEV
	? lazy(() =>
			import("@tanstack/react-query-devtools").then((d) => ({
				default: d.ReactQueryDevtools,
			}))
	  )
	: null;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 MINUTES
			gcTime: 10 * 60 * 1000, // 10 MINUTES
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<ScrollToTop />
				<UnitSettingsProvider>
					<ThemeProvider defaultTheme="dark">
						<Layout>
							<Suspense fallback={<WeatherSkeleton />}>
								<Routes>
									<Route path="/" element={<WeatherDashboard />} />
									<Route path="/city/:cityName" element={<CityPage />} />
									<Route path="/privacy" element={<PrivacyPolicyPage />} />
									<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
									<Route path="/terms" element={<TermsAndConditionsPage />} />
									<Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
									<Route path="/disclaimer" element={<DisclaimerPage />} />
									<Route path="/legal" element={<PrivacyPolicyPage />} />
									<Route path="*" element={<Navigate to="/" replace />} />
								</Routes>
							</Suspense>
						</Layout>
						<Toaster richColors />
					</ThemeProvider>
				</UnitSettingsProvider>
			</BrowserRouter>
			{ReactQueryDevtools && (
				<Suspense fallback={null}>
					<ReactQueryDevtools initialIsOpen={false} />
				</Suspense>
			)}
		</QueryClientProvider>
	);
}

export default App;
