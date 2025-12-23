const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/aqi/nearest";

async function getAQIForUserLocation(lat, lon) {
  const res = await axios.get(
    `${BASE_URL}?lat=${lat}&lon=${lon}`
  );
  return res.data;
}

module.exports = { getAQIForUserLocation };
