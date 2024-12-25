<script setup lang="ts">
import { useI18n } from "vue-i18n";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useAppStore } from "@/store/modules/app";

const appStore = useAppStore();
const { locale, t } = useI18n(); // Подключаем локализацию

function handleLanguageChange(lang: string) {
  locale.value = lang;
  appStore.changeLanguage(lang);

  // Локализованное сообщение об успешной смене языка
  ElMessage.success(t("language.switchSuccess"));
}
</script>

<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <div>
      <svg-icon icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :disabled="appStore.language === 'zh-cn'"
          command="zh-cn"
        >
          {{ $t("language.zh") }}
        </el-dropdown-item>
        <el-dropdown-item
          :disabled="appStore.language === 'en'"
          command="en"
        >
          {{ $t("language.en") }}
        </el-dropdown-item>
        <el-dropdown-item
          :disabled="appStore.language === 'ru'"
          command="ru"
        >
          {{ $t("language.ru") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
