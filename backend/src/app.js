const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const aqiRoutes = require("./routes/aqi.routes");
const reportRoutes = require("./routes/report.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/aqi", aqiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", require("./routes/notification.routes"));



app.get("/", (_, res) => res.send("Air-Aware Backend Running"));

module.exports = app;
