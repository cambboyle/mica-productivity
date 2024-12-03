import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Include /api prefix
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default api;
