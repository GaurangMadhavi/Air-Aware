import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

interface PMData {
  name: string;
  value: number;
  color: string;
  description: string;
  level: string;
  healthImpact: string;
}

interface PMDistributionCardProps {
  data?: PMData[];
}

const defaultPMData: PMData[] = [
  { 
    name: 'PM2.5', 
    value: 45, 
    color: 'hsl(var(--aqi-moderate))', 
    description: 'Fine particulate matter < 2.5μm',
    level: '45 μg/m³',
    healthImpact: 'Can penetrate deep into lungs'
  },
  { 
    name: 'PM10', 
    value: 32, 
    color: 'hsl(var(--aqi-good))', 
    description: 'Coarse particulate matter < 10μm',
    level: '32 μg/m³',
    healthImpact: 'May cause respiratory irritation'
  },
  { 
    name: 'O₃', 
    value: 15, 
    color: 'hsl(var(--primary))', 
    description: 'Ground-level ozone',
    level: '15 ppb',
    healthImpact: 'Can trigger asthma symptoms'
  },
  { 
    name: 'NO₂', 
    value: 8, 
    color: 'hsl(var(--aqi-unhealthy))', 
    description: 'Nitrogen dioxide from combustion',
    level: '8 ppb',
    healthImpact: 'Irritates airways'
  },
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
      />
    </g>
  );
};

export const PMDistributionCard = ({ data = defaultPMData }: PMDistributionCardProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedPollutant, setSelectedPollutant] = useState<PMData | null>(null);

  const handlePieClick = (_: any, index: number) => {
    setSelectedPollutant(data[index]);
  };

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-sm font-semibold text-primary mb-3">PM Distribution</h3>
      
      <div className="flex gap-4">
        {/* Chart */}
        <div className="h-[180px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--primary))',
                }}
                formatter={(value: number, name: string) => [
                  <span className="text-primary">{value}%</span>, 
                  <span className="text-muted-foreground">{name}</span>
                ]}
                labelStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-primary/80">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detail Panel */}
        {selectedPollutant && (
          <div className="flex-1 p-3 rounded-lg bg-card/50 border border-border/50 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: selectedPollutant.color }}
              />
              <h4 className="font-bold text-primary">{selectedPollutant.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{selectedPollutant.description}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Level:</span>
                <span className="text-primary font-medium">{selectedPollutant.level}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Share:</span>
                <span className="text-primary font-medium">{selectedPollutant.value}%</span>
              </div>
            </div>
            <p className="text-xs text-aqi-moderate mt-2 italic">{selectedPollutant.healthImpact}</p>
            <button 
              onClick={() => setSelectedPollutant(null)}
              className="mt-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              ✕ Close
            </button>
          </div>
        )}
      </div>

      {!selectedPollutant && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Click on a segment for details
        </p>
      )}
    </div>
  );
};
