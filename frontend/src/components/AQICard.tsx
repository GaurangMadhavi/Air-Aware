import { getAQIInfo } from '@/lib/aqi-utils';
import { MapPin, Wind } from 'lucide-react';

interface AQICardProps {
  aqi: number;
  location: string;
  lastUpdated: string;
}

export function AQICard({ aqi, location, lastUpdated }: AQICardProps) {
  const aqiInfo = getAQIInfo(aqi);

  const sliderPercent = Math.max(0, Math.min((aqi / 500) * 100, 100));

  return (
    <div className={`glass-card p-6 ${aqiInfo.glowClass} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wind className="w-4 h-4" />
          <span className="text-xs">Updated {lastUpdated}</span>
        </div>
      </div>

      {/* AQI Number */}
      <div className="text-center">
        <span
          className={`text-8xl font-black tracking-tight ${aqiInfo.colorClass}`}
        >
          {aqi}
        </span>

        <div
          className={`mt-4 inline-flex items-center px-4 py-2 rounded-full ${aqiInfo.bgClass}/20 border border-current/20 ${aqiInfo.colorClass}`}
        >
          <span className="text-sm font-semibold">{aqiInfo.label}</span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {aqiInfo.description}
        </p>
      </div>

      {/* AQI Slider */}
      <div className="mt-6">
        <div className="relative h-2 rounded-full overflow-hidden bg-secondary">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, hsl(var(--aqi-safe)), hsl(var(--aqi-moderate)), hsl(var(--aqi-unhealthy-sensitive)), hsl(var(--aqi-unhealthy)), hsl(var(--aqi-very-unhealthy)), hsl(var(--aqi-hazardous)))',
            }}
          />

          {/* ✅ Correctly aligned slider thumb */}
          <div
            className="absolute top-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-background shadow-lg transition-all duration-500"
            style={{
              left: `${sliderPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>500</span>
        </div>
      </div>
    </div>
  );
}
