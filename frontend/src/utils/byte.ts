import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Форматирование размера в байтах
 * @param bytes Количество байтов
 * @param decimals Количество десятичных знаков, по умолчанию 2
 * @returns Строка с отформатированным размером
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === -1) {
    return t("storage.unlimited"); // Используем локализованное "Неограниченно"
  }
  if (bytes === 0) {
    return `0 ${t("storage.units")[0]}`; // "0 байт"
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = t("storage.units"); // Получаем массив единиц измерения из локализации
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Рассчитать количество байтов из значения и единицы измерения
 * @param value Значение
 * @param unit Единица измерения
 * @returns Количество байтов
 */
export const calculateBytes = (value = 0, unit = "байт"): number => {
  const formattedUnit = unit.toUpperCase().trim();
  const sizes = t("storage.units").map((u: string) => u.toUpperCase());

  const unitToBytes = sizes.reduce((acc: Record<string, number>, curr: string, idx: number) => {
    acc[curr] = 1024 ** idx;
    return acc;
  }, {});

  if (!unitToBytes[formattedUnit]) {
    throw new Error(t("storage.error")); // Локализованное сообщение об ошибке
  }

  if (value === -1) {
    return -1;
  }

  return value * unitToBytes[formattedUnit];
};

/**
 * Форматирование значения хранения
 * @param bytes Количество байтов
 * @param decimals Количество десятичных знаков, по умолчанию 2
 * @returns Число, отформатированное для хранения
 */
export const formatStorageCapacity = (bytes: number, decimals = 2): number => {
  if (!bytes || bytes <= 0) {
    return bytes;
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
};

/**
 * Определить единицу измерения для хранения
 * @param bytes Количество байтов
 * @returns Строка с единицей измерения
 */
export const formatStorageUnit = (bytes: number): string => {
  if (!bytes || bytes <= 0) {
    return t("storage.units")[0]; // "байт"
  }

  const k = 1024;
  const sizes = t("storage.units");
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return sizes[i];
};
