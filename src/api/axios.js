import axios from "axios";

const api = axios.create({
  // Must include /api and use https in production (Vercel)
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach the admin session token (if any) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server says the session is gone/expired, clear it and go to login.
// (Wrong-PIN 401s from the login/setup calls are left alone.)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthCall = url.includes("/admin/login") || url.includes("/admin/setup");
    if (err.response?.status === 401 && localStorage.getItem("adminToken") && !isAuthCall) {
      ["adminToken", "adminName", "adminRole", "adminExpires"].forEach((k) => localStorage.removeItem(k));
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
