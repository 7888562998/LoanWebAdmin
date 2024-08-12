import axios from "axios";
import { getCookie } from "../commonFunctions/common";
import { baseUrl } from "../env/env";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseUrl, // Set the base URL for all requests
  
});

// Add an interceptor to dynamically update headers for each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("user-token"); // Get token before each request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
