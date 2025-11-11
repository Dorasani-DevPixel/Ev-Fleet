import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL1 || "https://evbackend-m56s.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_KEY}`,
  },
});

export default api;
