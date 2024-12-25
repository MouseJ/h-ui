import router from "@/router";
import { useAccountStoreHook } from "@/store/modules/account";
import { usePermissionStoreHook } from "@/store/modules/permission";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false }); // Конфигурация индикатора загрузки

const permissionStore = usePermissionStoreHook();

// Список маршрутов, доступных без авторизации
const whiteList = ["/login", "/register"];

router.beforeEach(async (to, from, next) => {
  NProgress.start(); // Начало индикатора загрузки
  const hasToken = localStorage.getItem("accessToken"); // Проверяем наличие токена

  if (hasToken) {
    if (to.path === "/login") {
      // Если пользователь уже авторизован, перенаправляем на главную страницу
      next({ path: "/" });
      NProgress.done();
    } else {
      const AccountStore = useAccountStoreHook();
      const hasRoles = AccountStore.roles && AccountStore.roles.length > 0;

      if (hasRoles) {
        // Если маршрут не найден, перенаправляем на 404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next("/404");
        } else {
          next(); // Продолжаем маршрут
        }
      } else {
        try {
          // Загружаем информацию о пользователе
          const { roles } = await AccountStore.getAccountInfo();
          const accessRoutes = permissionStore.generateRoutes(roles);

          // Динамически добавляем маршруты
          accessRoutes.forEach((route) => {
            router.addRoute(route);
          });

          // Перезагружаем текущий маршрут
          next({ ...to, replace: true });
        } catch (error) {
          console.error("Ошибка получения данных пользователя:", error);

          // Удаляем токен и перенаправляем на страницу входа
          await AccountStore.resetToken();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // Если пользователь не авторизован, разрешаем доступ только к маршрутам из белого списка
    if (whiteList.includes(to.path)) {
      next();
    } else {
      // Перенаправляем на страницу входа
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // Завершаем индикатор загрузки
});
