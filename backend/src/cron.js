// const cron = require("node-cron");
// const User = require("./models/User");
// const { sendSMS, sendWhatsApp } = require("./services/notify.service");
// const { sendEmail } = require("./services/email.service");
// const { getWeather } = require("./services/weather.service");
// const { getAllSensorData } = require("./services/sheets.service");
// const { distanceKm } = require("./utils/geo.utils");
// const { predictAQI } = require("./services/prediction.service");
// const { sendPushNotification } = require("./services/firebase.service");
// const Notification = require("./models/Notification");



// /* 🔁 Runs every 1 minute */
// cron.schedule("*/1 * * * *", async () => {
//   console.log("🔔 AQI alert job running");
  
//   try {
//     const users = await User.find({
//       $or: [
//         { notifySMS: true },
//         { notifyWhatsApp: true },
//         { notifyEmail: true },
//       ],
//     });

//     if (!users.length) return;

//     const sensors = await getAllSensorData();
//     if (!sensors || !sensors.length) return;

//     for (const user of users) {
//       /* ---------------- SAFETY CHECKS ---------------- */

//       // ❌ Skip if GPS missing
//       if (user.latitude == null || user.longitude == null) continue;

//       // ❌ Skip stale GPS (>30 min old)
//       if (
//         user.lastLocationUpdatedAt &&
//         Date.now() - new Date(user.lastLocationUpdatedAt).getTime() >
//           30 * 60 * 1000
//       ) {
//         console.log(`⏭️ Skipping ${user.phone} (stale GPS)`);
//         continue;
//       }

//       /* ---------------- NEAREST SENSOR ---------------- */

//       let nearest = null;
//       let minDistance = Infinity;

//       sensors.forEach((s) => {
//         const d = distanceKm(
//           user.latitude,
//           user.longitude,
//           Number(s.Latitude),
//           Number(s.Longitude)
//         );
//         if (d < minDistance) {
//           minDistance = d;
//           nearest = s;
//         }
//       });

//       if (!nearest) continue;

//       /* ---------------- WEATHER (USER LOCATION) ---------------- */

//       const weather = await getWeather(user.latitude, user.longitude);

//       const currentAQI = predictAQI({
//         baseAQI: Number(nearest.AQI),
//         windSpeed: weather.windSpeed,
//         humidity: weather.humidity,
//         temperature: weather.temperature,
//         hour: new Date().getHours(),
//       });

//       const nextAQI = predictAQI({
//         baseAQI: Number(nearest.AQI),
//         windSpeed: weather.windSpeed,
//         humidity: weather.humidity,
//         temperature: weather.temperature,
//         hour: new Date().getHours() + 1,
//       });

//       const unhealthy = currentAQI >= user.aqiThreshold;
//       const risingFast = nextAQI - currentAQI >= 15;

//       if (!unhealthy && !risingFast) continue;

//       const message = unhealthy
//         ? `🚨 AQI Unhealthy (${currentAQI})\nAvoid outdoor activity and wear a mask.`
//         : `⚠️ AQI may worsen soon (${currentAQI} → ${nextAQI}). Take precautions.`;

//       /* ---------------- NOTIFICATIONS ---------------- */
//       // 🔔 PUSH NOTIFICATION
//       try {
//         if (user.pushToken) {
//           await sendPushNotification(
//             user.pushToken,
//             "Air Quality Alert",
//             message
//           );
//         }
//       } catch (e) {
//         console.error("❌ Push failed:", e.message);
//       }


//       // WhatsApp (best-effort)
//       try {
//         if (user.notifyWhatsApp) {
//           await sendWhatsApp(user.phone, message);
//         }
//       } catch (e) {
//         console.error("❌ WhatsApp failed:", e.message);
//       }

//       // SMS (best-effort)
//       try {
//         if (user.notifySMS) {
//           await sendSMS(user.phone, message);
//         }
//       } catch (e) {
//         console.error("❌ SMS failed:", e.message);
//       }

//       // ✅ EMAIL ALWAYS ATTEMPTED
//       if (user.notifyEmail && user.email) {
//         try {
//           await sendEmail(user.email, "Air Quality Alert", message);
//         } catch (e) {
//           console.error("❌ Email failed:", e.message);
//         }
//       }
//     }
//   } catch (err) {
//     console.error("❌ Cron error:", err.message);
//   }

// });







const cron = require("node-cron");
const User = require("./models/User");
const Notification = require("./models/Notification");

const { sendSMS, sendWhatsApp } = require("./services/notify.service");
const { sendEmail } = require("./services/email.service");
const { sendPushNotification } = require("./services/firebase.service");

const { getWeather } = require("./services/weather.service");
const { getAllSensorData } = require("./services/sheets.service");
const { distanceKm } = require("./utils/geo.utils");
const { predictAQI } = require("./services/prediction.service");

/* -------------------------------------------------------
   ✅ KEEP ONLY LATEST SENSOR ROW PER LOCATION
------------------------------------------------------- */
function getLatestReadingsPerLocation(rows) {
  const map = {};

  rows.forEach((r) => {
    if (!r.Latitude || !r.Longitude || !r.Timestamp) return;

    const key = `${r.Latitude}_${r.Longitude}`;

    if (
      !map[key] ||
      new Date(r.Timestamp) > new Date(map[key].Timestamp)
    ) {
      map[key] = r;
    }
  });

  return Object.values(map);
}

/* -------------------------------------------------------
   🔁 RUNS EVERY 1 MINUTE
------------------------------------------------------- */
cron.schedule("*/1 * * * *", async () => {
  console.log("🔔 AQI alert job running");

  try {
    /* ---------------- USERS ---------------- */
    const users = await User.find({
      $or: [
        { notifySMS: true },
        { notifyWhatsApp: true },
        { notifyEmail: true },
      ],
    });

    if (!users.length) {
      console.log("ℹ️ No users with notifications enabled");
      return;
    }

    /* ---------------- SENSOR DATA ---------------- */
    const rawSensors = await getAllSensorData();
    if (!rawSensors || !rawSensors.length) {
      console.log("⚠️ No sensor data available");
      return;
    }

    const sensors = getLatestReadingsPerLocation(rawSensors);

    /* ---------------- LOOP USERS ---------------- */
    for (const user of users) {
      /* ---- SAFETY CHECKS ---- */
      if (user.latitude == null || user.longitude == null) {
        console.log(`⏭️ ${user.phone} skipped (no GPS)`);
        continue;
      }

      if (
        user.lastLocationUpdatedAt &&
        Date.now() - new Date(user.lastLocationUpdatedAt).getTime() >
          30 * 60 * 1000
      ) {
        console.log(`⏭️ ${user.phone} skipped (stale GPS)`);
        continue;
      }

      /* ---- FIND NEAREST SENSOR ---- */
      let nearest = null;
      let minDistance = Infinity;

      sensors.forEach((s) => {
        const d = distanceKm(
          user.latitude,
          user.longitude,
          Number(s.Latitude),
          Number(s.Longitude)
        );

        if (d < minDistance) {
          minDistance = d;
          nearest = s;
        }
      });

      if (!nearest) continue;

      console.log(
        `📡 Sensor AQI=${nearest.AQI} | Distance=${minDistance.toFixed(2)} km | Time=${nearest.Timestamp}`
      );

      /* ---- WEATHER AT USER LOCATION ---- */
      const weather = await getWeather(user.latitude, user.longitude);

      /* ---- AQI CALCULATION (CRITICAL FIX) ---- */
      let currentAQI;
      let nextAQI;

      if (minDistance < 0.1) {
        // ✅ SAME LOCATION → EXACT SENSOR AQI
        currentAQI = Number(nearest.AQI);
        nextAQI = Number(nearest.AQI);
      } else {
        // 🌫️ DIFFERENT LOCATION → PREDICTED AQI
        currentAQI = predictAQI({
          baseAQI: Number(nearest.AQI),
          windSpeed: weather.windSpeed,
          humidity: weather.humidity,
          temperature: weather.temperature,
          hour: new Date().getHours(),
        });

        nextAQI = predictAQI({
          baseAQI: Number(nearest.AQI),
          windSpeed: weather.windSpeed,
          humidity: weather.humidity,
          temperature: weather.temperature,
          hour: new Date().getHours() + 1,
        });
      }

      /* ---- DECISION LOGIC ---- */
      const unhealthy = currentAQI >= user.aqiThreshold;
      const risingFast = nextAQI - currentAQI >= 15;

      if (!unhealthy && !risingFast) {
        console.log(`✅ AQI safe for ${user.phone} (${currentAQI})`);
        continue;
      }

      /* ---- MESSAGE ---- */
      const message = unhealthy
        ? `🚨 AQI Unhealthy (${currentAQI})\nAvoid outdoor activity and wear a mask.`
        : `⚠️ AQI rising (${currentAQI} → ${nextAQI}). Take precautions.`;

      /* ---- STORE IN-APP NOTIFICATION ---- */
      await Notification.create({
        user: user._id,
        title: "Air Quality Alert",
        body: message,
      });

      /* ---- PUSH NOTIFICATION ---- */
      try {
        if (user.pushToken) {
          await sendPushNotification(
            user.pushToken,
            "Air Quality Alert",
            message
          );
        }
      } catch (e) {
        console.error("❌ Push failed:", e.message);
      }

      /* ---- WHATSAPP ---- */
      try {
        if (user.notifyWhatsApp) {
          await sendWhatsApp(user.phone, message);
        }
      } catch (e) {
        console.error("❌ WhatsApp failed:", e.message);
      }

      /* ---- SMS ---- */
      try {
        if (user.notifySMS) {
          await sendSMS(user.phone, message);
        }
      } catch (e) {
        console.error("❌ SMS failed:", e.message);
      }

      /* ---- EMAIL (ALWAYS ATTEMPTED) ---- */
      if (user.notifyEmail && user.email) {
        try {
          await sendEmail(user.email, "Air Quality Alert", message);
        } catch (e) {
          console.error("❌ Email failed:", e.message);
        }
      }

      console.log(`✅ Alerts sent to ${user.phone}`);
    }
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
