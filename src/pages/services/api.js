import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};

  const url = config.url || "";

  // ADMIN
  if (url.includes("/api/admin")) {
    const aToken = localStorage.getItem("aToken");

    if (aToken) {
      config.headers.Authorization = `Bearer ${aToken}`;
    }
  }

  // DOCTOR
  else if (url.includes("/api/doctor")) {
    const dToken = localStorage.getItem("dToken");

    if (dToken) {
      config.headers.Authorization = `Bearer ${dToken}`;
    }
  }

  return config;
});

export default API;
