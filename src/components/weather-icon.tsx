interface WeatherIconProps {
    iconCode: string;
    className?: string;
}

export function WeatherIcon({ iconCode, className = "h-10 w-10" }: WeatherIconProps) {
    return (
        <img 
            src={`/icons/${iconCode}.svg`} 
            alt={`Weather icon ${iconCode}`} 
            className={`object-contain ${className}`}
        />
    );
}
