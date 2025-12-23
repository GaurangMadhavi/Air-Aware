import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
});

export const getNearestAQI = (lat:number, lon:number) =>
  API.get(`/api/aqi/nearest?lat=${lat}&lon=${lon}`);
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

export const registerUser = (data: any) =>
  API.post("/api/auth/register", data);

export const loginUser = (data: any) =>
  API.post("/api/auth/login", data);

export const getCommunityReports = () =>
  API.get("/api/reports/community");

export const getMyReports = () =>
  API.get("/api/reports/my", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const createReport = (data: any) =>
  API.post("/api/reports", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const deleteReport = (id: string) =>
  API.delete(`/api/reports/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const updateLiveLocation = (lat: number, lon: number) =>
  API.put(
    "/api/user/location",
    { latitude: lat, longitude: lon },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
