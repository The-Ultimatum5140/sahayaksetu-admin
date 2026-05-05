import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // optional (future-safe)
});

//  REQUEST INTERCEPTOR (ROLE-BASED TOKEN)
API.interceptors.request.use(
  (config) => {
    console.log("interceptors running")
    if (!config.headers) config.headers = {};

    const url = config.url || "";

    // ADMIN ROUTES
    if (url.includes("/api/admin")) {
      const aToken = localStorage.getItem("aToken");
      if (aToken) {
        config.headers.Authorization = `Bearer ${aToken}`;
      }
    }

    // ✅ DOCTOR ROUTES
    else if (url.includes("/api/doctor")) {
      const dToken = localStorage.getItem("dToken");
      if (dToken) {
        config.headers.Authorization = `Bearer ${dToken}`;
      }
    }

    // ✅ USER ROUTES (optional future)
    else if (url.includes("/api/user")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

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
