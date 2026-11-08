import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import { WeatherDashboard } from "./pages/weather-dashboard";
import { Layout } from "./components/layout";
import { ThemeProvider } from "./context/theme-provider";
import { UnitSettingsProvider } from "./context/unit-settings-provider";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CityPage } from "./pages/city-page";
import { ScrollToTop } from "./components/scroll-to-top";
import { PrivacyPolicyPage } from "./pages/legal/privacy-policy";
import { TermsAndConditionsPage } from "./pages/legal/terms-and-conditions";
import { DisclaimerPage } from "./pages/legal/disclaimer";

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
						</Layout>
						<Toaster richColors />
					</ThemeProvider>
				</UnitSettingsProvider>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
