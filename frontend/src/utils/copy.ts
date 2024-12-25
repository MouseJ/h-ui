/**
 * Поверхностное копирование, игнорирует значения null, поддерживает вложенные объекты
 * @param target Целевой объект
 * @param source Источник данных
 */
export const assignWith = <T>(target: T, source: Partial<T>): void => {
  if (source === null || typeof source !== "object") {
    return;
  }

  for (const key in source) {
    if (source[key] !== null) {
      if (typeof source[key] === "object") {
        if (!target[key]) {
          // Если ключ отсутствует в целевом объекте, создаём пустой объект или массив
          target[key] = (Array.isArray(source[key]) ? [] : {}) as T[Extract<
            keyof T,
            string
          >];
        }
        // Рекурсивное копирование вложенных объектов
        assignWith(target[key] as any, source[key] as any);
      } else {
        // Присваиваем значение
        target[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }
};

/**
 * Глубокое копирование, игнорирует значения null, поддерживает вложенные объекты
 * @param source Источник данных
 * @returns Новый объект или массив
 */
export const deepCopy = <T>(source: Partial<T>): T => {
  if (source === null || typeof source !== "object") {
    return source; // Если источник не объект или null, возвращаем его как есть
  }

  if (Array.isArray(source)) {
    // Копируем массив
    const arrCopy = [] as any[];
    source.forEach((item, index) => {
      arrCopy[index] = deepCopy(item); // Рекурсивное копирование элементов массива
    });
    return arrCopy as any;
  }

  // Копируем объект
  const objCopy = {} as { [key: string]: any };
  Object.keys(source).forEach((key) => {
    objCopy[key] = deepCopy((source as { [key: string]: any })[key]); // Рекурсивное копирование значений объекта
  });

  return objCopy as T;
};
