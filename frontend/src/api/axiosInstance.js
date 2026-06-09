import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bms-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle API responses globally
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    console.error("API Error:", {
      status,
      url: error.config?.url,
      message: error.response?.data,
    });

    if (status === 401) {
      console.warn("Unauthorized request detected.");
    }

    return Promise.reject(error);
  },
);

export default api;
