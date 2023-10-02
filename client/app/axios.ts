import axios from "axios";

const instance = axios.create({
  baseURL: process.env.url
});

instance.defaults.withCredentials = true; //Enable sending credentials (e.g., cookies)

instance.interceptors.request.use((config) => {
  config.headers["Access-Control-Allow-Origin"] = process.env.url; // Set the specific origin
  return config;
});

export default instance;