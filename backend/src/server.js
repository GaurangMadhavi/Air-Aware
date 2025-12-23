const app = require("./app");
const connectDB = require("./config/db");

// 🔔 START CRON JOBS (ADD THIS LINE)
require("./cron");

connectDB();

const { PORT } = require("./config/env");
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
