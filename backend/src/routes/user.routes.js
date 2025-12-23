const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

/* 🔔 UPDATE LIVE LOCATION (GPS) */
router.put("/location", auth, async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({ message: "Latitude & longitude required" });
  }

  await User.findByIdAndUpdate(req.user.id, {
    latitude,
    longitude,
    lastLocationUpdatedAt: new Date(),
  });

  res.json({ success: true });
});

module.exports = router;
