import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherDetailsProps {
	data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
	const { sys } = data;

	// Format time using date-fns
	const formatTime = (timestamp: number) => {
		return format(new Date(timestamp * 1000), "h:mm a");
	};

	const details = [
		{
			title: "Sunrise",
			value: formatTime(sys.sunrise),
			icon: Sunrise,
			color: "text-orange-500",
		},
		{
			title: "Sunset",
			value: formatTime(sys.sunset),
			icon: Sunset,
			color: "text-blue-500",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Sunrise & Sunset
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-6 sm:grid-cols-2">
					{details.map((detail) => (
						<div
							key={detail.title}
							className="flex items-center gap-3 rounded-lg border p-4"
						>
							<detail.icon className={`h-5 w-5 ${detail.color}`} />
							<div>
								<p className="text-sm font-medium leading-none">
									{detail.title}
								</p>
								<p className="text-sm text-muted-foreground">{detail.value}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}