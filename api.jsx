// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7032/api",
});

// Add token to every request if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).token; // assuming your backend returns { userId, fullName, role, token }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
