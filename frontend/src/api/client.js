import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const baseURL =
  import.meta.env.DEV &&
  (!configuredBaseUrl || /blackholeinfiverse\.com/i.test(configuredBaseUrl))
    ? "http://localhost:8080"
    : configuredBaseUrl || "http://localhost:8080";

const client = axios.create({
  baseURL,
  withCredentials: true
});

export default client;
