const axios = require("axios");

async function getWeather(lat, lon) {
  try {
    const res = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    const data = res.data;

    // 🔍 DEBUG (REMOVE LATER IF YOU WANT)
    console.log("🌦 OpenWeather RAW:", {
      wind: data.wind,
      main: data.main,
    });

    return {
      temperature: Number(data.main?.temp) || 0,
      humidity: Number(data.main?.humidity) || 0,

      // ✅ WIND (THIS WAS WRONG EARLIER)
      windSpeed: Number(data.wind?.speed) || 0,       // m/s
      windDirection: Number(data.wind?.deg) || 0,     // degrees

      // ✅ PRESSURE (THIS WAS MISSING)
      pressure: Number(data.main?.pressure) || 0,     

      // extra climate info (used for ML later)
      cloudCover: Number(data.clouds?.all) || 0,
    };
  } catch (err) {
    console.error("❌ Weather API error:", err.message);
    return {
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      windDirection: 0,
      pressure: 0,
      cloudCover: 0,
    };
  }
}

module.exports = { getWeather };
