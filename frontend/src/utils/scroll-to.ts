/**
 * Функция плавного ускорения и замедления движения (ease-in-out)
 * @param {number} t Текущее время
 * @param {number} b Начальная позиция
 * @param {number} c Изменение позиции
 * @param {number} d Длительность анимации
 * @returns {number} Рассчитанная позиция
 */
const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

// Используем requestAnimationFrame для плавной анимации
const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      window.setTimeout(callback, 1000 / 60); // Фолбэк на setTimeout для старых браузеров
    }
  );
})();

/**
 * Перемещение документа на указанное количество пикселей
 * @param {number} amount Количество пикселей для перемещения
 */
const move = (amount: number): void => {
  document.documentElement.scrollTop = amount;
  (document.body.parentNode as HTMLElement).scrollTop = amount;
  document.body.scrollTop = amount;
};

/**
 * Получение текущей позиции прокрутки
 * @returns {number} Текущая позиция прокрутки
 */
const position = (): number => {
  return (
    document.documentElement.scrollTop ||
    (document.body.parentNode as HTMLElement).scrollTop ||
    document.body.scrollTop
  );
};

/**
 * Анимация прокрутки страницы
 * @param {number} to Целевая позиция
 * @param {number} duration Длительность анимации (в миллисекундах)
 * @param {Function} [callback] Колбэк, вызываемый после завершения анимации
 */
export const scrollTo = (
  to: number,
  duration: number = 500,
  callback?: () => void
): void => {
  const start = position();
  const change = to - start;
  const increment = 20; // Частота обновлений в миллисекундах
  let currentTime = 0;

  const animateScroll = function () {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    move(val);

    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof callback === "function") {
        callback(); // Вызов колбэка после завершения анимации
      }
    }
  };

  animateScroll();
};
