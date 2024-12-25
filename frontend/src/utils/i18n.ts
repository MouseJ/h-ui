// Перевод router.meta.title, используется в breadcrumb, sidebar и tagsview
import i18n from "@/lang/index";

/**
 * Перевод заголовка маршрута с использованием i18n
 * @param title Название маршрута (ключ для перевода)
 * @returns Переведённое название маршрута или оригинальное название, если перевода нет
 */
export function translateRouteTitleI18n(title: any): string {
  // Проверяем, существует ли ключ в локализации
  const hasKey = i18n.global.te("route." + title);
  if (hasKey) {
    // Возвращаем переведённое значение
    return i18n.global.t("route." + title);
  }
  // Если перевода нет, возвращаем оригинальное название
  return title;
}
