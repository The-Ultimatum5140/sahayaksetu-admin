import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // optional (future-safe)
});

//  REQUEST INTERCEPTOR (ROLE-BASED TOKEN)
API.interceptors.request.use((config) => {
  console.log("🔥 interceptor running");

  if (!config.headers) config.headers = {};

  const aToken = localStorage.getItem("aToken");

  if (aToken) {
    config.headers.Authorization = `Bearer ${aToken}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (AUTO LOGOUT)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    if (status === 401) {
      console.log("Unauthorized → Logging out");

      // Admin logout
      if (url.includes("/api/admin")) {
        localStorage.removeItem("aToken");
        window.location.href = "/admin-login";
      }

      // Doctor logout
      else if (url.includes("/api/doctor")) {
        localStorage.removeItem("dToken");
        window.location.href = "/doctor-login";
      }

      //  User logout
      else {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default API;
