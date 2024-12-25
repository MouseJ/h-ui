import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Форматирование размера в байтах
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  const units = t("storage.units") as unknown as string[];
  if (!Array.isArray(units)) {
    throw new Error("Локализация storage.units должна быть массивом");
  }

  if (bytes === -1) {
    return t("storage.unlimited");
  }
  if (bytes === 0) {
    return `0 ${units[0]}`;
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + units[i];
};

/**
 * Расчёт байтов из значения и единицы измерения
 */
export const calculateBytes = (value = 0, unit = "Байт"): number => {
  const units = t("storage.units") as unknown as string[];
  if (!Array.isArray(units)) {
    throw new Error("Локализация storage.units должна быть массивом");
  }

  const formattedUnit = unit.toUpperCase().trim();
  const unitToBytes = units.reduce((acc: Record<string, number>, curr: string, idx: number) => {
    acc[curr.toUpperCase()] = 1024 ** idx;
    return acc;
  }, {});

  if (!unitToBytes[formattedUnit]) {
    throw new Error(t("storage.error"));
  }

  if (value === -1) {
    return -1;
  }

  return value * unitToBytes[formattedUnit];
};

/**
 * Определение единицы измерения для хранения
 */
export const formatStorageUnit = (bytes: number): string => {
  const units = t("storage.units") as unknown as string[];
  if (!Array.isArray(units)) {
    throw new Error("Локализация storage.units должна быть массивом");
  }

  if (!bytes || bytes <= 0) {
    return units[0];
  }

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return units[i];
};
