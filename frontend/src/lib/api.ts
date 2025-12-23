export interface SensorReading {
  timestamp: string;

  location_name?: string;
  latitude?: number;
  longitude?: number;

  temperature?: number;
  humidity?: number;

  co2?: number;
  nh3?: number;
  no2?: number;
  smoke?: number;

  pm25?: number;
  pm10?: number;

  aqi?: number;
  aqi_status?: string;
}


export async function fetchLatestReading(): Promise<SensorReading | null> {
  try {
    const base =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${base}/api/air-quality/latest`);
    if (!res.ok) return null;

    const json = await res.json();

    // ✅ FLATTEN BACKEND RESPONSE
    const mapped: SensorReading = {
      timestamp: json.timestamp,

      location_name: json.location?.name,
      latitude: json.location?.latitude,
      longitude: json.location?.longitude,

      temperature: json.environment?.temperature,
      humidity: json.environment?.humidity,

      co2: json.gases?.co2,
      nh3: json.gases?.nh3,
      no2: json.gases?.no2,
      smoke: json.gases?.smoke,

      pm25: json.particulateMatter?.pm25,
      pm10: json.particulateMatter?.pm10,

      aqi: json.aqi?.value,
      aqi_status: json.aqi?.status,
    };

    return mapped;
  } catch (err) {
    console.error("fetchLatestReading failed", err);
    return null;
  }
}
