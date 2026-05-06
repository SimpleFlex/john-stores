import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ── Debug: log the baseURL being used on app start
console.log(
  "[axios] baseURL:",
  import.meta.env.VITE_API_URL || "http://localhost:5000/api",
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // ── Debug: log every outgoing request so you can see the full URL
  console.log(
    "[axios] →",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    // ── Debug: log every successful response
    console.log(
      "[axios] ✓",
      response.status,
      response.config.url,
      response.data,
    );
    return response;
  },
  (error) => {
    // ── Enhanced error logging
    console.error("[axios] ✗", error.response?.status, error.config?.url);
    console.error(
      "[axios] error detail:",
      error.response?.data?.message || error.message,
    );
    return Promise.reject(error);
  },
);

export default api;
