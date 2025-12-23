function predictGas({
  sensorValue,
  windFactor,
  distanceDecay,
  humidity,
  trafficMultiplier = 1,
}) {
  let value = sensorValue;

  // transport from sensor → user
  value *= windFactor * distanceDecay;

  // humidity traps gases slightly
  value *= 1 + humidity * 0.001;

  // traffic effect (NO2, Smoke)
  value *= trafficMultiplier;

  return Math.max(0, Math.round(value));
}

module.exports = { predictGas };
