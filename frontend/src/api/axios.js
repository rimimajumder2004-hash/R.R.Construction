import axios from "axios";
import BASE_URL from "../config"; // add this import

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // change this line
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
