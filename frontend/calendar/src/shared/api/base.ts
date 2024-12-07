import axios from "axios";

const API_URL = "https://centrifugo.tech/calendar/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

export default api;
