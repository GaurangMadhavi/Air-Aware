const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

router.post("/token", auth, async (req, res) => {
  console.log("📥 /api/notifications/token HIT");
  console.log("🧾 req.user =", req.user);
  console.log("📦 body =", req.body);

  const { token } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    pushToken: token,
  });

  res.json({ success: true });
});


module.exports = router;
