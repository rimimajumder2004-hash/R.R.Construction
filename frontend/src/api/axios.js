import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Remove the response interceptor entirely — AuthContext handles 401 already
// No window.location.href, no localStorage, nothing

export default api;
