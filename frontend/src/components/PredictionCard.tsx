import {
  TrendingUp,
  CloudSun,
  Wind,
  Thermometer,
  Droplets,
  Car,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getAQIInfo } from "@/lib/aqi-utils";

/* ---------------- TYPES ---------------- */
interface PredictionData {
  hour: string; // "+2h", "+4h", etc. (from backend)
  aqi: number;
}

interface PredictionCardProps {
  predictions?: PredictionData[];
}

/* ---------------- COMPONENT ---------------- */
export function PredictionCard({ predictions }: PredictionCardProps) {
  /* -------- SAFETY GUARD -------- */
  if (!predictions || predictions.length === 0) {
    return (
      <div className="glass-card p-5 text-muted-foreground animate-fade-in">
        Loading air quality prediction…
      </div>
    );
  }

  /* -------- REMOVE "Now" IF PRESENT -------- */
  const futurePredictions = predictions.filter(
    (p) => p.hour !== "Now"
  );

  if (futurePredictions.length === 0) return null;

  /* -------- TREND -------- */
  const trend =
    futurePredictions[futurePredictions.length - 1].aqi >
    futurePredictions[0].aqi
      ? "rising"
      : "falling";

  /* -------- UI -------- */
  return (
    <div className="glass-card p-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Air Quality Prediction
          </h3>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            trend === "rising"
              ? "bg-aqi-unhealthy/20 text-aqi-unhealthy"
              : "bg-aqi-safe/20 text-aqi-safe"
          }`}
        >
          {trend === "rising" ? "↑ Rising" : "↓ Improving"}
        </span>
      </div>

      {/* Mini AQI Chart */}
      <div className="h-32 mt-2 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={futurePredictions}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "hsl(var(--muted-foreground))",
              }}
              dy={5}
            />
            <YAxis hide domain={[0, 300]} />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const aqi = payload[0].value as number;
                  const info = getAQIInfo(aqi);
                  return (
                    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl">
                      <p
                        className={`text-lg font-bold ${info.colorClass}`}
                      >
                        {aqi}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {info.label}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="aqi"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#aqiGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Prediction Cards */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-1 px-1">
        {futurePredictions.slice(0, 6).map((pred, index) => {
          const info = getAQIInfo(pred.aqi);
          return (
            <div
              key={pred.hour}
              className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl ${
                index === 0
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-secondary/50"
              }`}
            >
              <span className="text-xs text-muted-foreground">
                {pred.hour}
              </span>
              <span
                className={`text-lg font-bold font-mono ${info.colorClass}`}
              >
                {pred.aqi}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${info.bgClass} mt-1`}
              />
            </div>
          );
        })}
      </div>

      {/* Prediction Factors */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-2">
          Prediction factors:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: <Wind className="w-3 h-3" />, label: "Wind Speed & Direction" },
            { icon: <Thermometer className="w-3 h-3" />, label: "Temperature" },
            { icon: <Droplets className="w-3 h-3" />, label: "Humidity" },
            { icon: <CloudSun className="w-3 h-3" />, label: "Climatic Conditions" },
            { icon: <Car className="w-3 h-3" />, label: "Traffic Congestion" },
          ].map((factor) => (
            <span
              key={factor.label}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded-full text-xs text-muted-foreground"
            >
              {factor.icon}
              {factor.label}
            </span>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/60 mt-2">
          Predictions generated using sensor data, weather, wind & traffic influence
        </p>
      </div>
    </div>
  );
}
