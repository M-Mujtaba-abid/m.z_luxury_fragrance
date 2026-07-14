import axios from "axios";



const API = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://m-z-luxury-fragrance.vercel.app",
  withCredentials: true,
});

export default API;
