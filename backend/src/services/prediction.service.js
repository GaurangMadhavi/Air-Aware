function trafficFactor(hour) {
  if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21)) {
    return 1.15; // peak traffic
  }
  return 1.0;
}

function predictAQI({ baseAQI, windSpeed, humidity, temperature, hour }) {
  let aqi = baseAQI;

  // wind disperses pollution
  aqi *= Math.max(0.85, 1 - windSpeed * 0.03);

  // humidity traps particles
  aqi *= 1 + humidity * 0.002;

  // heat increases secondary pollutants
  if (temperature > 30) aqi *= 1.05;

  // traffic impact
  aqi *= trafficFactor(hour);

  return Math.round(aqi);
}

module.exports = { predictAQI };
