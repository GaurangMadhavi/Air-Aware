const router = require("express").Router();
const { getAllSensorData } = require("../services/sheets.service");
const { getWeather } = require("../services/weather.service");
const { predictAQI } = require("../services/prediction.service");
const { distanceKm } = require("../utils/geo.utils");

/* -------------------------------------------------------
   KEEP ONLY LATEST SENSOR ROW PER LOCATION
------------------------------------------------------- */
function getLatestReadingsPerLocation(rows) {
  const map = {};

  rows.forEach((r) => {
    if (!r.Latitude || !r.Longitude || !r.Timestamp) return;

    const key = `${r.Latitude}_${r.Longitude}`;
    if (
      !map[key] ||
      new Date(r.Timestamp) > new Date(map[key].Timestamp)
    ) {
      map[key] = r;
    }
  });

  return Object.values(map);
}

/* -------------------------------------------------------
   AQI CALCULATION (DISTANCE-AWARE)
------------------------------------------------------- */
function computeUserAQI(nearestAQI, distanceKm, weather) {
  // Distance decay
  let distanceFactor = 1;
  if (distanceKm < 1) distanceFactor = 0.95;
  else if (distanceKm < 3) distanceFactor = 0.9;
  else if (distanceKm < 8) distanceFactor = 0.8;
  else distanceFactor = 0.65;

  // Wind factor
  let windFactor = 1;
  if (weather.windSpeed >= 6) windFactor = 0.8;
  else if (weather.windSpeed >= 3) windFactor = 0.9;

  // Humidity factor
  const humidityFactor = weather.humidity > 70 ? 1.05 : 1.0;

  const adjusted = Math.round(
    nearestAQI * distanceFactor * windFactor * humidityFactor
  );

  return Math.max(adjusted, Math.round(nearestAQI * 0.8));
}

/* -------------------------------------------------------
   GET NEAREST AQI
   /api/aqi/nearest?lat=xx&lon=yy
------------------------------------------------------- */
router.get("/nearest", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      message: "Latitude and longitude required",
    });
  }

  const rawSensors = await getAllSensorData();
  if (!rawSensors || rawSensors.length === 0) {
    return res.status(404).json({
      message: "No sensor data available",
    });
  }

  const sensors = getLatestReadingsPerLocation(rawSensors);

  let nearest = null;
  let minDistance = Infinity;

  sensors.forEach((s) => {
    const sLat = Number(s.Latitude);
    const sLon = Number(s.Longitude);
    if (isNaN(sLat) || isNaN(sLon)) return;

    const d = distanceKm(Number(lat), Number(lon), sLat, sLon);
    if (d < minDistance) {
      minDistance = d;
      nearest = s;
    }
  });

  if (!nearest) {
    return res.status(404).json({
      message: "No valid sensor found",
    });
  }

  const weather = await getWeather(lat, lon);

  /* -------------------------------------------------------
     FINAL AQI LOGIC (FIXED)
  ------------------------------------------------------- */
  let currentAQI;

  // ✅ SAME LOCATION → RAW SENSOR AQI (NO REDUCTION)
  if (minDistance < 0.1) {
    currentAQI = Number(nearest.AQI);
  } else {
    currentAQI = computeUserAQI(
      Number(nearest.AQI),
      minDistance,
      weather
    );
  }

  /* -------------------------------------------------------
     FORECAST (ONLY IF DISTANCE > 0)
  ------------------------------------------------------- */
  const hours = [2, 4, 6, 8, 10];
  const currentHour = new Date().getHours();

  const forecast = hours.map((h) => ({
    hour: `+${h}h`,
    aqi:
      minDistance < 0.1
        ? Number(nearest.AQI)
        : predictAQI({
            baseAQI: currentAQI,
            windSpeed: weather.windSpeed,
            humidity: weather.humidity,
            temperature: weather.temperature,
            hour: currentHour + h,
          }),
  }));

  /* -------------------------------------------------------
     FINAL RESPONSE
  ------------------------------------------------------- */
  res.json({
    currentAQI,
    timestamp: nearest.Timestamp,

    environment: {
      temperature: weather.temperature,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      pressure: weather.pressure,
      visibility: weather.visibility,
    },

    gases: {
      co2: Math.round(nearest.CO2),
      nh3: Math.round(nearest.NH3),
      no2: Math.round(nearest.NO2),
      smoke: Math.round(nearest.Smoke),
    },

    particulateMatter: {
      pm25: Math.round(nearest.PM2_5),
      pm10: Math.round(nearest.PM10),
    },

    forecast,
  });
});

module.exports = router;
