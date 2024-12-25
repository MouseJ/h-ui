// Системные настройки
interface DefaultSettings {
  /**
   * Заголовок системы
   */
  title: string;

  /**
   * Отображение настроек
   */
  showSettings: boolean;

  /**
   * Отображение вкладок навигации
   */
  tagsView: boolean;

  /**
   * Фиксированная шапка
   */
  fixedHeader: boolean;

  /**
   * Отображение логотипа в боковой панели
   */
  sidebarLogo: boolean;

  /**
   * Макет навигации
   */
  layout: string;

  /**
   * Цвет темы
   */
  themeColor: string;

  /**
   * Режим темы
   * dark: тёмный
   * light: светлый
   */
  theme: string;

  /**
   * Размер интерфейса
   */
  size: string;

  /**
   * Язык интерфейса
   * ru: Русский
   * zh-cn: Китайский
   * en: Английский
   */
  language: string;
}

const defaultSettings: DefaultSettings = {
  title: "VPN Management Panel",
  showSettings: true,
  tagsView: true,
  fixedHeader: false,
  sidebarLogo: true,
  layout: "left",
  themeColor: "#409EFF",
  /**
   * Режим темы
   * dark: тёмный
   * light: светлый
   */
  theme: "dark",
  size: "default", // default | large | small
  language: "ru", // ru | zh-cn | en
};

export default defaultSettings;
