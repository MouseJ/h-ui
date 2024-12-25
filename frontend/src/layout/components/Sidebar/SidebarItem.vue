<script setup lang="ts">
import path from "path-browserify";
import { isExternal } from "@/utils/index";
import AppLink from "./Link.vue";

import { translateRouteTitleI18n } from "@/utils/i18n";
import SvgIcon from "@/components/SvgIcon/index.vue";

const props = defineProps({
  /**
   * Текущий маршрут (например: level_3_1)
   */
  item: {
    type: Object,
    required: true,
  },

  /**
   * Полный путь родительского маршрута (например: /level/level_3/level_3_1)
   */
  basePath: {
    type: String,
    required: true,
  },
});

const onlyOneChild = ref(); // Временная переменная, единственный дочерний маршрут

/**
 * Проверяет, имеет ли маршрут только один дочерний элемент
 *
 * 1: Если только один дочерний маршрут, возвращает true
 * 2: Если нет дочерних маршрутов, также возвращает true
 *
 * @param children Массив дочерних маршрутов
 * @param parent Текущий маршрут
 */
function hasOneShowingChild(children = [], parent: any) {
  // Фильтрация дочерних маршрутов, которые должны отображаться
  const showingChildren = children.filter((item: any) => {
    if (item.meta?.hidden) {
      return false; // Исключает скрытые маршруты
    } else {
      onlyOneChild.value = item; // Сохраняет единственный дочерний маршрут (если их несколько, значение не используется)
      return true;
    }
  });

  // 1: Если только один дочерний маршрут, возвращает true
  if (showingChildren.length === 1) {
    return true;
  }

  // 2: Если дочерних маршрутов нет, создает виртуальный маршрут и возвращает true
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

/**
 * Разрешает путь маршрута
 *
 * @param routePath Путь маршрута
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath; // Если это внешний путь, возвращаем его
  }
  if (isExternal(props.basePath)) {
    return props.basePath; // Если базовый путь внешний, возвращаем его
  }
  // Полный путь = родительский путь (/level/level_3) + путь маршрута
  const fullPath = path.resolve(props.basePath, routePath); // Относительный путь → абсолютный путь
  return fullPath;
}
</script>

<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- Если маршрут содержит только один дочерний элемент, отображаем его -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <svg-icon
            v-if="onlyOneChild.meta && onlyOneChild.meta.icon"
            :icon-class="onlyOneChild.meta.icon"
          />
          <template #title>
            {{ translateRouteTitleI18n(onlyOneChild.meta.title) }}
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <!-- Если маршрут содержит несколько дочерних элементов -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :icon-class="item.meta.icon"
        />
        <span v-if="item.meta && item.meta.title">{{
          translateRouteTitleI18n(item.meta.title)
        }}</span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>
