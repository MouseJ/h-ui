import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAccountStoreHook } from "@/store/modules/account";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accountStore = useAccountStoreHook();
    if (accountStore.token) {
      config.headers.Authorization = accountStore.token;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data;
    if (code === 20000) {
      return response.data;
    }
    if (response.data instanceof ArrayBuffer || response.data instanceof Blob) {
      return response;
    }
    ElMessage.error(message || "System Error");
    return Promise.reject(new Error(message || "Error"));
  },
  (error: any) => {
    if (error.response?.data) {
      const { code, msg } = error.response.data;
      if (code === "A0230") {
        ElMessageBox.confirm(
          "Current session expired. Please log in again.",
          "Notice",
          {
            confirmButtonText: "OK",
            type: "warning",
          }
        ).then(() => {
          localStorage.clear();
          window.location.href = "/";
        });
      } else {
        ElMessage.error(msg || "System Error");
      }
    } else {
      ElMessage.error("Network Error");
    }
    return Promise.reject(error.message);
  }
);

export default service;
