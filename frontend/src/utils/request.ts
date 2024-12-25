import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAccountStoreHook } from "@/store/modules/account";
import { useI18n } from "vue-i18n";

// Создаём axios экземпляр
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// Подключаем локализацию
const { t } = useI18n();

// Перехватчик запросов
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accountStore = useAccountStoreHook();
    if (accountStore.token) {
      config.headers.Authorization = accountStore.token; // Добавляем токен в заголовки
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data;

    if (code === 20000) {
      return response.data;
    }

    // Обработка бинарных данных (например, для экспорта файлов)
    if (response.data instanceof ArrayBuffer || response.data instanceof Blob) {
      return response;
    }

    // Локализованное сообщение об ошибке
    ElMessage.error(message || t("system.error"));
    return Promise.reject(new Error(message || t("system.error")));
  },
  (error: any) => {
    if (error.response?.data) {
      const { code, msg } = error.response.data;

      // Если токен истёк, просим пользователя снова войти
      if (code === "A0230") {
        ElMessageBox.confirm(
          t("auth.sessionExpired"),
          t("auth.tip"),
          {
            confirmButtonText: t("auth.confirm"),
            type: "warning",
          }
        ).then(() => {
          localStorage.clear();
          window.location.href = "/";
        });
      } else {
        ElMessage.error(msg || t("system.error"));
      }
    } else {
      ElMessage.error(t("system.networkError"));
    }
    return Promise.reject(error.message);
  }
);

// Экспорт axios экземпляра
export default service;
