<script setup lang="ts">
import { useSettingsStore } from "@/store/modules/settings";
import { useI18n } from "vue-i18n";

import IconEpSunny from "~icons/ep/sunny";
import IconEpMoon from "~icons/ep/moon";

const { t } = useI18n();

/**
 * Темная тема
 */
const settingsStore = useSettingsStore();
const isDark = useDark();
const toggleDark = () => useToggle(isDark);

/**
 * Смена макета
 */
function changeLayout(layout: string) {
  settingsStore.changeSetting({ key: "layout", value: layout });
  window.document.body.setAttribute("layout", settingsStore.layout);
}

// Цвета темы
const themeColors = ref<string[]>([
  "#409EFF",
  "#304156",
  "#11a983",
  "#13c2c2",
  "#6959CD",
  "#f5222d",
]);

/**
 * Смена цвета темы
 */
function changeThemeColor(color: string) {
  settingsStore.changeSetting({ key: "themeColor", value: color });
  document.documentElement.style.setProperty(
    "--el-color-primary",
    settingsStore.themeColor
  );
}

onMounted(() => {
  window.document.body.setAttribute("layout", settingsStore.layout);
  document.documentElement.style.setProperty(
    "--el-color-primary",
    settingsStore.themeColor
  );
});
</script>

<template>
  <div class="settings-container">
    <h3 class="text-base font-bold">{{ t("settings.projectConfig") }}</h3>
    <el-divider>{{ t("settings.theme") }}</el-divider>

    <div class="flex justify-center" @click.stop>
      <el-switch
        v-model="isDark"
        @change="toggleDark"
        inline-prompt
        :active-icon="IconEpMoon"
        :inactive-icon="IconEpSunny"
        active-color="var(--el-fill-color-dark)"
        inactive-color="var(--el-color-primary)"
      />
    </div>

    <el-divider>{{ t("settings.interfaceSettings") }}</el-divider>
    <div class="py-[8px] flex justify-between">
      <span class="text-xs">{{ t("settings.enableTagsView") }}</span>
      <el-switch v-model="settingsStore.tagsView" />
    </div>

    <div class="py-[8px] flex justify-between">
      <span class="text-xs">{{ t("settings.fixedHeader") }}</span>
      <el-switch v-model="settingsStore.fixedHeader" />
    </div>

    <div class="py-[8px] flex justify-between">
      <span class="text-xs">{{ t("settings.sidebarLogo") }}</span>
      <el-switch v-model="settingsStore.sidebarLogo" />
    </div>

    <el-divider>{{ t("settings.themeColors") }}</el-divider>

    <ul class="w-full space-x-2 flex justify-center py-2">
      <li
        class="inline-block w-[30px] h-[30px] cursor-pointer"
        v-for="(color, index) in themeColors"
        :key="index"
        :style="{ background: color }"
        @click="changeThemeColor(color)"
      ></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.settings-container {
  padding: 16px;
}
</style>
