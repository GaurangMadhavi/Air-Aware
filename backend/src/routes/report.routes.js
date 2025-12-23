const router = require("express").Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth.middleware");

/**
 * 🌍 Community reports (public)
 */
router.get("/community", async (_, res) => {
  const reports = await Report.find({ isPublic: true })
    .sort({ createdAt: -1 });
  res.json(reports);
});

/**
 * 👤 My reports
 */
router.get("/my", auth, async (req, res) => {
  const reports = await Report.find({ userId: req.user.id })
    .sort({ createdAt: -1 });
  res.json(reports);
});

/**
 * ➕ Create report
 */
router.post("/", auth, async (req, res) => {
  const report = await Report.create({
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    isPublic: true,
  });
  res.json(report);
});

/**
 * ❌ Delete own report only
 */
router.delete("/:id", auth, async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  if (report.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await report.deleteOne();
  res.json({ success: true });
});

module.exports = router;
