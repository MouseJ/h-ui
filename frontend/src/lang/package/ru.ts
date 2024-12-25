export default {
  // Маршруты
  route: {
    account: "Пользователи",
    accountList: "Управление пользователями",
    hysteria: "Hysteria",
    hysteriaList: "Управление Hysteria",
    config: "Настройки",
    configList: "Системные настройки",
    monitor: "Мониторинг",
    monitorSystem: "Мониторинг системы",
    log: "Логи",
    logSystem: "Системные логи",
    logHysteria: "Логи Hysteria",
    info: "Информация",
    infoAccount: "Информация о пользователе",
    telegram: "Telegram",
    telegramList: "Настройки Telegram",
  },
  // Страница входа
  login: {
    title: "H UI",
    username: "Имя пользователя",
    password: "Пароль",
    login: "Войти",
  },
  // Навигационная панель
  navbar: {
    logout: "Выйти",
  },
  common: {
    id: "ID",
    createTime: "Дата создания",
    operate: "Действия",
    edit: "Редактировать",
    delete: "Удалить",
    deleted: "Статус",
    all: "Все",
    enable: "Активировать",
    disable: "Деактивировать",
    search: "Поиск",
    reset: "Сбросить",
    add: "Добавить",
    confirm: "Подтвердить",
    cancel: "Отменить",
    copySuccess: "Успешно скопировано",
    subscribe: "Подписка",
    subscribeQrCode: "QR-код подписки",
    nodeUrl: "URL узла",
    nodeQrCode: "QR-код узла",
    resetTraffic: "Сбросить трафик",
    import: "Импортировать",
    export: "Экспортировать",
    save: "Сохранить",
    update: "Обновить",
    downloadSuccess: "Скачивание успешно",
    wait: "Пожалуйста, подождите, идет обновление версии",
    enableSuccess: "Hysteria2 успешно запущен",
    disableSuccess: "Hysteria2 успешно остановлен",
    success: "Успешно",
    refresh: "Обновить",
    yes: "Да",
    no: "Нет",
    securityRisk: "Угрозы безопасности",
    defaultPassTip: `Смените пароль по умолчанию для защиты аккаунта. <a href="/#/account/list?focus=change-pass" style="color: #00BFFF">Нажмите здесь</a>, чтобы изменить пароль.`,
    noHttpsTip: `Сайт не использует HTTPS. Для защиты данных включите HTTPS. <a href="/#/config/list?focus=huiHttps" style="color: #00BFFF">Нажмите здесь</a>, чтобы настроить.`,
  },
  info: {
    expireTime: "ГГГГ-ММ-ДД ЧЧ:ММ:СС",
    greeting1: "Свежий утренний воздух — начало продуктивного дня! 🌅",
    greeting2: "Доброе утро,",
    greeting3: "Добрый день,",
    greeting4: "Добрый вечер,",
    greeting5: "Пусть звезды освещают ваши мечты. Спокойной ночи! 🌛",
  },
  account: {
    username: "Имя пользователя",
    pass: "Пароль",
    conPass: "Подтвердите пароль",
    quota: "Лимит трафика",
    download: "Скачано",
    upload: "Загружено",
    expireTime: "Срок действия",
    kickUtilTimeLast: "Оставшееся время оффлайна",
    kickUtilTime: "Отключение через",
    deviceNo: "Лимит устройств",
    onlineStatus: "Статус подключения",
    online: "В сети",
    offline: "Не в сети",
    device: "Активные устройства",
    role: "Роль",
    unit: "Единица измерения",
    loginAt: "Последний вход",
    conAt: "Последнее подключение",
    createTime: "Дата создания",
    releaseSuccess: "Успешно отключено",
    kick: "Отключить",
    kickTip: "Принудительное отключение пользователя",
    releaseKick: "Восстановить",
    releaseKickTip: "Снять статус отключения",
  },
  config: {
    huiWebPort: "Порт веб-интерфейса",
    huiWebContext: "Контекст веб-интерфейса",
    hysteria2TrafficTime: "Срок учета трафика",
    huiCrtPath: "Путь к сертификату",
    huiKeyPath: "Путь к ключу",
    restartServer: "Перезапустить интерфейс",
    restartTip: "Перезапуск... Обновите страницу через несколько секунд",
    useHysteria2Cert: "Использовать сертификаты Hysteria2",
    huiHttps: "Включить HTTPS",
    resetTrafficCron: "Планировщик сброса трафика",
    resetTrafficCronTip: "Подробнее о планировке: https://pkg.go.dev/github.com/robfig/cron",
    resetTrafficMonth: "Сброс раз в месяц, в первый день в полночь",
    resetTrafficWeek: "Сброс раз в неделю, в полночь с субботы на воскресенье",
  },
  monitor: {
    huiVersion: "Версия интерфейса",
    cpuPercent: "Загрузка CPU",
    memPercent: "Загрузка памяти",
    diskPercent: "Загрузка диска",
    hysteria2UserTotal: "Онлайн-пользователи",
    hysteria2DeviceTotal: "Подключенные устройства",
    hysteria2Version: "Версия Hysteria2",
    hysteria2Running: "Статус Hysteria2",
    hysteria2RunningTrue: "Работает",
    hysteria2RunningFalse: "Остановлено",
  },
  log: {
    numLine: "Кол-во строк",
  },
  telegram: {
    placeholder: "Текст-заполнитель",
    enable: "Активировать",
    disable: "Отключить",
    telegramEnable: "Включить/Отключить",
    telegramToken: "Токен Telegram",
    telegramChatId: "Telegram ChatId",
    telegramJob: "Список задач",
    telegramLoginJob: "Оповещение о входе",
    telegramLoginJobEnable: "Вкл/Выкл",
    telegramLoginJobText: "Шаблон сообщения",
  },
  hysteria: {
    enable: "Включить",
    disable: "Отключить",
    addConfigItem: "Добавить настройку",
    hysteria2Version: "Версия Hysteria2",
    hysteria2Running: "Статус Hysteria2",
    hysteria2ChangeVersion: "Сменить версию",
    addOutbound: "Добавить исходящий маршрут",
    extension: "Дополнительно",
    listen: "Прослушивание",
    tls: "TLS",
    obfs: "Обфускация",
    quic: "Параметры QUIC",
    bandwidth: "Пропускная способность",
    speedTest: "Тест скорости",
    udp: "UDP",
    resolver: "DNS-резолвер",
    sniff: "Анализ протоколов",
    acl: "Правила ACL",
    outbounds: "Исходящие маршруты",
    http: "API статистики трафика",
    masquerade: "Маскировка",
  },
export default {
  tagsView: {
    refresh: "Обновить",
    close: "Закрыть",
    closeOther: "Закрыть другие",
    closeLeft: "Закрыть слева",
    closeRight: "Закрыть справа",
    closeAll: "Закрыть все",
  },
};

};
