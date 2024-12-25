import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { setupStore } from "@/store";
import { setupDirective } from "@/directive";

import "@/permission"; // Файл управления доступом и разрешениями

// Локальные SVG-иконки
import "virtual:svg-icons-register";

// Интернационализация (i18n)
import i18n from "@/lang/index";

// Стили
import "element-plus/theme-chalk/dark/css-vars.css"; // Тёмная тема для Element Plus
import "@/styles/index.scss"; // Пользовательские стили
import "uno.css"; // Стили на основе UnoCSS

const app = createApp(App);

// Регистрация пользовательских директив
setupDirective(app);

// Регистрация управления состоянием (Vuex/Pinia)
setupStore(app);

// Подключение маршрутов и локализации, затем монтирование приложения
app.use(router).use(i18n).mount("#app");
