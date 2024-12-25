import i18n from "@/lang/index"; // Импорт локализации

/**
 * Преобразует временную метку (timestamp) в отформатированную строку даты и времени (YYYY-MM-DD HH:mm:ss)
 * @param timestamp Временная метка
 * @returns Строка с отформатированной датой и временем
 */
export const timestampToDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Рассчитывает разницу во времени между текущим моментом и временной меткой
 * @param timestamp Временная метка
 * @returns Строка, описывающая оставшееся время
 */
export const calculateTimeDifference = (timestamp: number): string => {
  const now = Date.now();
  const diff = timestamp - now;

  if (diff <= 0) {
    return i18n.global.t("time.now"); // Используем локализованный текст
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} ${i18n.global.t("time.days")}`);
  }
  if (remainingHours > 0) {
    parts.push(`${remainingHours} ${i18n.global.t("time.hours")}`);
  }
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes} ${i18n.global.t("time.minutes")}`);
  }
  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds} ${i18n.global.t("time.seconds")}`);
  }

  return parts.join(" ");
};

/**
 * Получает временную метку на час вперёд
 * @returns Временная метка на час вперёд
 */
export const getHourLater = (): number => {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  return date.getTime();
};

/**
 * Получает временную метку на день вперёд
 * @returns Временная метка на день вперёд
 */
export const getDayLater = (): number => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.getTime();
};

/**
 * Получает временную метку на неделю вперёд
 * @returns Временная метка на неделю вперёд
 */
export const getWeekLater = (): number => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.getTime();
};

/**
 * Получает временную метку на месяц вперёд
 * @returns Временная метка на месяц вперёд
 */
export const getMonthLater = (): number => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.getTime();
};

/**
 * Получает временную метку на год вперёд
 * @returns Временная метка на год вперёд
 */
export const getYearLater = (): number => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.getTime();
};
