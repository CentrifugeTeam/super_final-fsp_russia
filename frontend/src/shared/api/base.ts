import axios from "axios";

const API_BASE_URL = "https://centrifugo.tech/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});