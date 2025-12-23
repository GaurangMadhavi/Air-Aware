Installation & Setup

## Project info

AirAware is a smart, location-aware air quality intelligence web app that transforms raw pollution data into real-time AQI, short-term predictions, interactive heatmaps, and automated health alerts. By combining sensor readings with weather conditions like wind and humidity, AirAware predicts how air quality will change at a user’s exact location and proactively notifies them via SMS or WhatsApp before conditions worsen.

## Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB (local or cloud)

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Notifications 

The user will receive alert notification when the aqi value crosses threshold value and alsi when the aqi value drastically rises by +15. The user will receive alert on SMS (registered mobile number),WhatsApp (some condition for that is already mentioned when user regisrters into the app),Email id the user registered with,also in-app and push notification from app.


## Backend (local integration)

This repo now includes a small Express backend in `/backend` that fetches the latest sensor reading from the provided Google Sheets Apps Script and exposes it at `/api/latest`.

To run locally:

1. Start the backend:

```bash
cd backend
npm install
node src/server.js
```

2. In the frontend Then run the frontend as usual:

```bash
# in frontend/
npm install
npm run dev
```


🎥 Demo Video:  
https://github.com/alphanumeric0905/air-aware/releases/tag/v1.0


The frontend `Index` page fetches `/api/latest` and will display the latest AQI, gases, PM and weather fields from the sheet.



