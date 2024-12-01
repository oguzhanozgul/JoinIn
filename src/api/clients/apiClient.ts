import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
