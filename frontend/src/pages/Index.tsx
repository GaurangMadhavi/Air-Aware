import { useEffect, useState } from "react";
import { AQICard } from "@/components/AQICard";
import { CriticalityBanner } from "@/components/CriticalityBanner";
import { GasConcentrationCard } from "@/components/GasConcentrationCard";
import { PredictionCard } from "@/components/PredictionCard";
import { PMDistributionCard } from "@/components/PMDistributionCard";

import { Wind, Droplets, Thermometer, Eye, Gauge } from "lucide-react";
import { getNearestAQI, updateLiveLocation } from "@/services/api";

const Index = () => {
  const [aqi, setAQI] = useState(0);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState("Detecting location...");
  const [lastUpdated, setLastUpdated] = useState("—");
  const [dataTime, setDataTime] = useState("—");

  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [pressure, setPressure] = useState<number | null>(null);

  const [gasData, setGasData] = useState<any>(null);
  const [pmDataRaw, setPMData] = useState<any>(null);

  /* ---------------------------------------------------
     🔄 AQI FETCH + AUTO REFRESH (30 SECONDS)
     🔔 ALSO UPDATES LIVE LOCATION FOR ALERTS
  --------------------------------------------------- */
  useEffect(() => {
    let interval: number;

    const fetchAQI = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          setLoading(true);

          /* 🔔 UPDATE USER LOCATION IN DB (FOR ALERTS) */
          if (localStorage.getItem("token")) {
            updateLiveLocation(
              pos.coords.latitude,
              pos.coords.longitude
            ).catch(() => {});
          }

          /* 🌫️ FETCH AQI FOR LIVE GPS LOCATION */
          const res = await getNearestAQI(
            pos.coords.latitude,
            pos.coords.longitude
          );

          setAQI(res.data.currentAQI);
          setForecast(res.data.forecast);

          setTemperature(res.data.environment.temperature);
          setHumidity(res.data.environment.humidity);
          setWindSpeed(res.data.environment.windSpeed);
          setPressure(res.data.environment.pressure);

          setGasData(res.data.gases);
          setPMData(res.data.particulateMatter);

          setLastUpdated(new Date().toLocaleTimeString());
          setDataTime(new Date(res.data.timestamp).toLocaleString());
        } catch (err) {
          console.error("❌ AQI fetch failed", err);
        } finally {
          setLoading(false);
        }
      });
    };

    /* INITIAL FETCH */
    fetchAQI();

    /* AUTO REFRESH EVERY 30 SECONDS */
    interval = window.setInterval(fetchAQI, 30000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------------------------------------------
     📍 USER LOCATION NAME (REVERSE GEOCODING)
  --------------------------------------------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        const address = data.address || {};
        const detailedLocation = [
          address.neighbourhood,
          address.suburb,
          address.city || address.town || address.village,
        ]
          .filter(Boolean)
          .join(", ");

        setUserLocation(detailedLocation || "Your Location");
      } catch {
        setUserLocation(
          `Lat ${latitude.toFixed(3)}, Lng ${longitude.toFixed(3)}`
        );
      }
    });
  }, []);

  /* ---------------------------------------------------
     UI DATA
  --------------------------------------------------- */
  const gasReadings = [
    {
      name: "Carbon Dioxide",
      formula: "CO₂",
      value: gasData?.co2 ?? 0,
      unit: "PPM",
      maxSafe: 1000,
      icon: <Droplets className="w-4 h-4" />,
    },
    {
      name: "Ammonia",
      formula: "NH₃",
      value: gasData?.nh3 ?? 0,
      unit: "PPM",
      maxSafe: 50,
      icon: <Wind className="w-4 h-4" />,
    },
    {
      name: "Nitrogen Oxides",
      formula: "NOₓ",
      value: gasData?.no2 ?? 0,
      unit: "PPM",
      maxSafe: 100,
      icon: <Thermometer className="w-4 h-4" />,
    },
    {
      name: "Smoke / VOCs",
      formula: "VOC",
      value: gasData?.smoke ?? 0,
      unit: "PPM",
      maxSafe: 300,
      icon: <Eye className="w-4 h-4" />,
    },
  ];

  const pmData = [
    {
      name: "PM2.5",
      value: pmDataRaw?.pm25 ?? 0,
      color: "hsl(var(--aqi-moderate))",
      description: "Fine particulate matter < 2.5μm",
      level: `${pmDataRaw?.pm25 ?? 0} μg/m³`,
      healthImpact: "Can penetrate deep into lungs",
    },
    {
      name: "PM10",
      value: pmDataRaw?.pm10 ?? 0,
      color: "hsl(var(--aqi-good))",
      description: "Coarse particulate matter < 10μm",
      level: `${pmDataRaw?.pm10 ?? 0} μg/m³`,
      healthImpact: "May cause respiratory irritation",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <AQICard
            aqi={aqi}
            location={userLocation}
            lastUpdated={`Time: ${lastUpdated} | Data: ${dataTime}`}
          />

          <CriticalityBanner aqi={aqi} />

          {/* WEATHER CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Thermometer />, label: temperature != null ? `${temperature}°C` : "—", sub: "Temperature" },
              { icon: <Droplets />, label: humidity != null ? `${humidity}%` : "—", sub: "Humidity" },
              { icon: <Wind />, label: windSpeed != null ? `${windSpeed} m/s` : "—", sub: "Wind Speed" },
              { icon: <Gauge />, label: pressure != null ? `${pressure} hPa` : "—", sub: "Air Pressure" },
            ].map((w) => (
              <div key={w.sub} className="glass-card flex flex-col items-center p-4 rounded-xl">
                {w.icon}
                <p className="font-bold">{w.label}</p>
                <p className="text-xs">{w.sub}</p>
              </div>
            ))}
          </div>

          <PMDistributionCard data={pmData} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <GasConcentrationCard readings={gasReadings} />
          <PredictionCard predictions={forecast} />
        </div>
      </div>
    </div>
  );
};

export default Index;
