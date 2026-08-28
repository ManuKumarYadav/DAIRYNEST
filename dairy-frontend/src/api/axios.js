import axios from "axios";
import { API_BASE_URL } from "./config";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
