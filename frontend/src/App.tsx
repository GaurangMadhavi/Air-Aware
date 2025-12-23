import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ReportsProvider } from "./context/ReportsContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import axios from "axios";
import { requestFCMToken } from "@/lib/firebase";

const queryClient = new QueryClient();

function FCMInitializer() {
  useEffect(() => {
    const initFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const token = await requestFCMToken();
        console.log("✅ FCM Token:", token);

        const jwt = localStorage.getItem("token");
        if (!token || !jwt) return;

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/notifications/token`,
          { token },
          { headers: { Authorization: `Bearer ${jwt}` } }
        );

        console.log("📡 FCM token saved to backend");
      } catch (err) {
        console.error("❌ Failed to save FCM token", err);
      }
    };

    initFCM();
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ReportsProvider>
        <AuthProvider>
          <NotificationProvider>
            <FCMInitializer />
            <Toaster />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </ReportsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
