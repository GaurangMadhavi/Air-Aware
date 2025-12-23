import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => {
        console.log("✅ Firebase SW registered:", reg.scope);
      })
      .catch((err) => {
        console.error("❌ Firebase SW registration failed:", err);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
