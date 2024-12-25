import { createI18n } from "vue-i18n";
import { useAppStore } from "@/store/modules/app";

const appStore = useAppStore();
// Локализация
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";
import ruLocale from "./package/ru"; 

const messages = {
  "zh-cn": {
    ...zhCnLocale,
  },
  en: {
    ...enLocale,
  },
  ru: {
    ...ruLocale,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages: messages,
  globalInjection: true,
});

export default i18n;
