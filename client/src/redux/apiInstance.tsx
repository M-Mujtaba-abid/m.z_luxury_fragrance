import axios from "axios";



const API = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://eccomerce-web-server-side.onrender.com",
  withCredentials: true,
});

export default API;
