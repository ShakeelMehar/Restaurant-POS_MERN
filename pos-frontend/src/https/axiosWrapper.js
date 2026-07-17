import axios from "axios";
import { enqueueSnackbar } from "notistack";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { ...defaultHeader },
});

axiosWrapper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for capturing Zod validation errors
axiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400 && error.response.data?.errors) {
      error.response.data.errors.forEach((err) => {
        const fieldName = err.field.split(".").pop();
        // Capitalize the field name for better readability
        const formattedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        enqueueSnackbar(`${formattedField}: ${err.message}`, { variant: "error" });
      });
    }
    return Promise.reject(error);
  }
);
