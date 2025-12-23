import { Map, MapPin } from 'lucide-react';

interface MapZone {
  id: string;
  name: string;
  aqi: number;
  x: number;
  y: number;
  trend?: 'rising' | 'stable' | 'falling';
}

const mapZones: MapZone[] = [
  { id: '1', name: 'Downtown', aqi: 95, x: 45, y: 40, trend: 'rising' },
  { id: '2', name: 'Industrial', aqi: 156, x: 72, y: 35 },
  { id: '3', name: 'Residential', aqi: 42, x: 25, y: 55 },
  { id: '4', name: 'Highway', aqi: 128, x: 60, y: 65, trend: 'rising' },
  { id: '5', name: 'Park Area', aqi: 28, x: 35, y: 30 },
  { id: '6', name: 'Commercial', aqi: 78, x: 55, y: 52 },
];

function getZoneColor(aqi: number): string {
  if (aqi <= 50) return 'bg-aqi-safe';
  if (aqi <= 100) return 'bg-aqi-moderate';
  if (aqi <= 150) return 'bg-aqi-unhealthy-sensitive';
  if (aqi <= 200) return 'bg-aqi-unhealthy';
  return 'bg-aqi-very-unhealthy';
}

function getZoneRingColor(aqi: number): string {
  if (aqi <= 50) return 'ring-aqi-safe/30';
  if (aqi <= 100) return 'ring-aqi-moderate/30';
  if (aqi <= 150) return 'ring-aqi-unhealthy-sensitive/30';
  if (aqi <= 200) return 'ring-aqi-unhealthy/30';
  return 'ring-aqi-very-unhealthy/30';
}

export function AQIMap() {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.7s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AQI Map</h3>
      </div>

      {/* Map Container */}
      <div className="relative bg-secondary/30 rounded-xl overflow-hidden aspect-[4/3]">
        {/* Grid Pattern Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Simulated Roads */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <path d="M 0 50% L 100% 50%" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeDasharray="8 4" />
          <path d="M 50% 0 L 50% 100%" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeDasharray="8 4" />
          <path d="M 20% 20% L 80% 80%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="6 3" />
        </svg>

        {/* Map Zones */}
        {mapZones.map((zone, index) => (
          <div
            key={zone.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group animate-scale-in"
            style={{ 
              left: `${zone.x}%`, 
              top: `${zone.y}%`,
              animationDelay: `${0.8 + index * 0.1}s`
            }}
          >
            {/* Pulse Effect for Rising Trend */}
            {zone.trend === 'rising' && (
              <div className={`absolute inset-0 w-8 h-8 -m-1 rounded-full ${getZoneColor(zone.aqi)} animate-ping opacity-30`} />
            )}
            
            {/* Zone Marker */}
            <div 
              className={`relative w-6 h-6 rounded-full ${getZoneColor(zone.aqi)} ring-4 ${getZoneRingColor(zone.aqi)} flex items-center justify-center cursor-pointer transition-transform hover:scale-125`}
            >
              <span className="text-[8px] font-bold text-background">{zone.aqi}</span>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-popover border border-border rounded-lg px-2 py-1 shadow-xl whitespace-nowrap">
                <p className="text-xs font-medium text-foreground">{zone.name}</p>
                <p className="text-[10px] text-muted-foreground">AQI: {zone.aqi}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Your Location Marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-2">Legend</p>
        <div className="flex flex-wrap gap-3">
          {[
            { color: 'bg-aqi-safe', label: 'Good (0-50)' },
            { color: 'bg-aqi-moderate', label: 'Moderate (51-100)' },
            { color: 'bg-aqi-unhealthy-sensitive', label: 'Unhealthy (101-150)' },
            { color: 'bg-aqi-unhealthy', label: 'Very Unhealthy (151+)' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-aqi-unhealthy-sensitive animate-ping" />
          <span className="text-[10px] text-muted-foreground">Pulsing = AQI Rising</span>
        </div>
      </div>
    </div>
  );
}
