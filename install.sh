#!/usr/bin/env bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

hui_systemd_version="${1:-latest}"
hui_docker_version=":${hui_systemd_version#v}"

# Инициализация переменных
init_var() {
  ECHO_TYPE="echo -e"

  package_manager=""
  release=""
  version=""
  get_arch=""

  HUI_DATA_DOCKER="/h-ui/"
  HUI_DATA_SYSTEMD="/usr/local/h-ui/"

  h_ui_port=8081
  h_ui_time_zone=Asia/Shanghai

  ssh_local_forwarded_port=8082
}

# Вывод сообщений с цветами
echo_content() {
  local colors=(
    ["red"]="\033[31m"
    ["green"]="\033[32m"
    ["yellow"]="\033[33m"
    ["blue"]="\033[34m"
    ["purple"]="\033[35m"
    ["skyBlue"]="\033[36m"
    ["white"]="\033[37m"
  )
  ${ECHO_TYPE} "${colors[$1]}$2\033[0m"
}

# Проверка доступности сети
can_connect() {
  ping -c2 -i0.3 -W1 "$1" &>/dev/null
}

# Сравнение версий
version_ge() {
  local v1=${1#v}
  local v2=${2#v}
  [[ -z "$v1" || "$v1" == "latest" ]] && return 0

  IFS='.' read -r -a v1_parts <<<"$v1"
  IFS='.' read -r -a v2_parts <<<"$v2"

  for i in "${!v1_parts[@]}"; do
    local part1=${v1_parts[i]:-0}
    local part2=${v2_parts[i]:-0}
    [[ "$part1" < "$part2" ]] && return 1
    [[ "$part1" > "$part2" ]] && return 0
  done
  return 0
}

# Проверка системы
check_sys() {
  [[ $(id -u) != "0" ]] && { echo_content red "Скрипт должен запускаться с правами root."; exit 1; }

  can_connect "www.google.com" || { echo_content red "Нет сетевого подключения."; exit 1; }

  if command -v yum &>/dev/null; then
    package_manager='yum'
  elif command -v dnf &>/dev/null; then
    package_manager='dnf'
  elif command -v apt-get &>/dev/null; then
    package_manager='apt-get'
  elif command -v apt &>/dev/null; then
    package_manager='apt'
  else
    echo_content red "Дистрибутив не поддерживается."; exit 1
  fi

  if grep -qi "centos" /etc/os-release; then
    release="centos"
    version=$(rpm -q --queryformat '%{VERSION}' centos-release)
  elif grep -qi "debian" /etc/os-release; then
    release="debian"
    version=$(cat /etc/debian_version)
  elif grep -qi "ubuntu" /etc/os-release; then
    release="ubuntu"
    version=$(lsb_release -sr)
  else
    echo_content red "Поддерживаются только CentOS, Debian и Ubuntu."; exit 1
  fi

  major_version=$(echo "${version}" | cut -d. -f1)
  [[ $release == "centos" && $major_version -lt 6 ]] && { echo_content red "CentOS версии $version не поддерживается. Требуется CentOS 6+."; exit 1; }
  [[ $release == "ubuntu" && $major_version -lt 16 ]] && { echo_content red "Ubuntu версии $version не поддерживается. Требуется Ubuntu 16+."; exit 1; }
  [[ $release == "debian" && $major_version -lt 8 ]] && { echo_content red "Debian версии $version не поддерживается. Требуется Debian 8+."; exit 1; }

  get_arch=$(arch | grep -E "x86_64|amd64|aarch64|arm64")
  [[ -z "${get_arch}" ]] && { echo_content red "Поддерживаются только архитектуры x86_64, amd64, arm64 и aarch64."; exit 1; }
}

# Установка зависимостей
install_depend() {
  [[ $package_manager =~ apt ]] && ${package_manager} update -y
  ${package_manager} install -y curl systemd nftables
}

# Настройка Docker
setup_docker() {
  mkdir -p /etc/docker
  cat >/etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  }
}
EOF
  systemctl daemon-reload
}

# Установка H UI с помощью systemd
install_h_ui_systemd() {
  echo_content green "---> Установка H UI через systemd"
  mkdir -p ${HUI_DATA_SYSTEMD}
  export HUI_DATA="${HUI_DATA_SYSTEMD}"

  bin_url=https://github.com/MouseJ/h-ui/releases/latest/download/h-ui-linux-${get_arch}
  [[ "$hui_systemd_version" != "latest" ]] && bin_url=https://github.com/MouseJ/h-ui/releases/download/${hui_systemd_version}/h-ui-linux-${get_arch}

  curl -fsSL "${bin_url}" -o /usr/local/h-ui/h-ui
  chmod +x /usr/local/h-ui/h-ui
  curl -fsSL https://github.com/MouseJ/h-ui/raw/main/h-ui.service -o /etc/systemd/system/h-ui.service

  read -r -p "Введите порт для H UI (по умолчанию: 8081): " h_ui_port
  h_ui_port=${h_ui_port:-8081}

  sed -i "s|^ExecStart=.*|ExecStart=/usr/local/h-ui/h-ui -p ${h_ui_port}|" /etc/systemd/system/h-ui.service

  systemctl daemon-reload
  systemctl enable h-ui
  systemctl start h-ui

  echo_content yellow "H UI доступен на порту: ${h_ui_port}"
}

# Основная функция
main() {
  init_var
  check_sys
  install_depend

  echo_content yellow "1. Установить H UI (systemd)"
  read -r -p "Выберите опцию: " option
  case $option in
    1)
      install_h_ui_systemd
      ;;
    *)
      echo_content red "Неверная опция."
      ;;
  esac
}

main
