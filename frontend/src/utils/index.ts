/**
 * Проверяет, содержит ли элемент указанный класс
 * @param {HTMLElement} ele Элемент DOM
 * @param {string} cls Имя класса
 * @returns {boolean} Возвращает true, если класс найден, иначе false
 */
export function hasClass(ele: HTMLElement, cls: string): boolean {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Добавляет класс к элементу
 * @param {HTMLElement} ele Элемент DOM
 * @param {string} cls Имя класса
 */
export function addClass(ele: HTMLElement, cls: string): void {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Удаляет класс из элемента
 * @param {HTMLElement} ele Элемент DOM
 * @param {string} cls Имя класса
 */
export function removeClass(ele: HTMLElement, cls: string): void {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * Проверяет, является ли путь внешним (ссылкой на внешний ресурс)
 * @param {string} path Путь для проверки
 * @returns {boolean} Возвращает true, если путь является внешним, иначе false
 */
export function isExternal(path: string): boolean {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}
