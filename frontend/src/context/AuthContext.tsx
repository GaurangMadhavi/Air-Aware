import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { requestFCMToken } from "@/lib/firebase";

export interface User {
  phone: string;
}

interface AuthContextType {
  user: User | null;
  register: (
    phone: string,
    email: string,
    password: string,
    latitude: number,
    longitude: number
  ) => Promise<{ success: boolean; message?: string }>;
  login: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (phone) setUser({ phone });
  }, []);

  /* ---------------- REGISTER ---------------- */
  const register = async (
    phone: string,
    email: string,
    password: string,
    latitude: number,
    longitude: number
  ) => {
    try {
      // 1️⃣ Register
      await API.post("/api/auth/register", {
        phone,
        email,
        password,
        latitude,
        longitude,
      });

      // 2️⃣ Auto login
      const res = await API.post("/api/auth/login", { phone, password });

      const jwt = res.data.token;

      localStorage.setItem("token", jwt);
      localStorage.setItem("phone", phone);
      setUser({ phone });

      // 3️⃣ Save FCM token (AFTER login)
      try {
        const fcmToken = await requestFCMToken();
        if (fcmToken) {
          await API.post(
            "/api/notifications/token",
            { token: fcmToken },
            {
              headers: { Authorization: `Bearer ${jwt}` },
            }
          );
          console.log("✅ FCM token saved after register");
        }
      } catch (e) {
        console.warn("⚠️ Failed to save FCM token:", e);
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (phone: string, password: string) => {
    try {
      // 1️⃣ Login
      const res = await API.post("/api/auth/login", { phone, password });

      const jwt = res.data.token;

      localStorage.setItem("token", jwt);
      localStorage.setItem("phone", phone);
      setUser({ phone });

      // 2️⃣ Save FCM token (AFTER login)
      try {
        const fcmToken = await requestFCMToken();
        if (fcmToken) {
          await API.post(
            "/api/notifications/token",
            { token: fcmToken },
            {
              headers: { Authorization: `Bearer ${jwt}` },
            }
          );
          console.log("✅ FCM token saved after login");
        }
      } catch (e) {
        console.warn("⚠️ Failed to save FCM token:", e);
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
