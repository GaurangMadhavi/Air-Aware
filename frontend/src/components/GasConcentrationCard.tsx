import { Activity, Flame, Wind, CloudFog } from 'lucide-react';

interface GasReading {
  name: string;
  formula: string;
  value: number;
  unit: string;
  maxSafe: number;
  icon: React.ReactNode;
}

interface GasConcentrationCardProps {
  readings: GasReading[];
}

function getIntensityColor(value: number, maxSafe: number): string {
  const ratio = value / maxSafe;
  if (ratio < 0.5) return 'bg-aqi-safe';
  if (ratio < 0.8) return 'bg-aqi-moderate';
  if (ratio < 1) return 'bg-aqi-unhealthy-sensitive';
  return 'bg-aqi-unhealthy';
}

function getIntensityLabel(value: number, maxSafe: number): string {
  const ratio = value / maxSafe;
  if (ratio < 0.5) return 'Low';
  if (ratio < 0.8) return 'Moderate';
  if (ratio < 1) return 'High';
  return 'Critical';
}

export function GasConcentrationCard({ readings }: GasConcentrationCardProps) {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Gas Concentrations</h3>
        <span className="ml-auto text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
          MQ-135 Sensor
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {readings.map((gas, index) => {
          const intensityColor = getIntensityColor(gas.value, gas.maxSafe);
          const intensityLabel = getIntensityLabel(gas.value, gas.maxSafe);
          const percentage = Math.min((gas.value / gas.maxSafe) * 100, 100);

          return (
            <div 
              key={gas.formula}
              className="bg-secondary/50 rounded-xl p-3 animate-fade-in"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                    {gas.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{gas.name}</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{gas.formula}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl font-bold font-mono text-foreground">{gas.value}</span>
                  <span className="text-xs text-muted-foreground">{gas.unit}</span>
                </div>
                
                {/* Intensity Bar */}
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${intensityColor} rounded-full transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <p className={`text-xs mt-1 font-medium ${
                  intensityLabel === 'Low' ? 'text-aqi-safe' :
                  intensityLabel === 'Moderate' ? 'text-aqi-moderate' :
                  intensityLabel === 'High' ? 'text-aqi-unhealthy-sensitive' :
                  'text-aqi-unhealthy'
                }`}>
                  {intensityLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const defaultGasReadings: GasReading[] = [
  { name: 'Carbon Dioxide', formula: 'CO₂', value: 412, unit: 'PPM', maxSafe: 1000, icon: <CloudFog className="w-4 h-4" /> },
  { name: 'Ammonia', formula: 'NH₃', value: 18, unit: 'PPM', maxSafe: 50, icon: <Wind className="w-4 h-4" /> },
  { name: 'Nitrogen Oxides', formula: 'NOₓ', value: 45, unit: 'PPM', maxSafe: 100, icon: <Activity className="w-4 h-4" /> },
  { name: 'Smoke / VOCs', formula: 'VOC', value: 85, unit: 'PPM', maxSafe: 300, icon: <Flame className="w-4 h-4" /> },
];
