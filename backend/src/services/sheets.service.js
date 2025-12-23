const axios = require("axios");
const { GOOGLE_SHEETS_URL } = require("../config/env");

exports.getAllSensorData = async () => {
  const res = await axios.get(GOOGLE_SHEETS_URL);
  return res.data.data;
};
