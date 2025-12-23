function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function bearingBetweenPoints(lat1, lon1, lat2, lon2) {
  const dLon = degreesToRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(degreesToRadians(lat2));
  const x =
    Math.cos(degreesToRadians(lat1)) * Math.sin(degreesToRadians(lat2)) -
    Math.sin(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.cos(dLon);

  return (Math.atan2(y, x) * 180) / Math.PI + 360;
}

function windInfluenceFactor(windDir, sensorLat, sensorLon, userLat, userLon) {
  const bearing = bearingBetweenPoints(
    sensorLat,
    sensorLon,
    userLat,
    userLon
  );

  const diff = Math.abs(windDir - bearing);
  const angle = diff > 180 ? 360 - diff : diff;

  // 0° = perfect alignment, 180° = opposite
  return Math.max(0, Math.cos(degreesToRadians(angle)));
}

module.exports = { windInfluenceFactor };
