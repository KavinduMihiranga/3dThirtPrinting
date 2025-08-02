import axios from "axios";
import config from "@/config";

const token = localStorage.getItem("iap-token");

const instance = axios.create({
  baseURL: config.BASE_URL + "/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

export default instance;