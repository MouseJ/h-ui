<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  watch,
  nextTick,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTagsViewStore, TagView } from "@/store/modules/tagsView";
import { usePermissionStore } from "@/store/modules/permission";
import { translateRouteTitleI18n } from "@/utils/i18n";
import ScrollPane from "./ScrollPane.vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const router = useRouter();
const route = useRoute();
const tagsViewStore = useTagsViewStore();
const permissionStore = usePermissionStore();

const { visitedViews } = storeToRefs(tagsViewStore);
const scrollPaneRef = ref();
const tagMenuVisible = ref(false);
const selectedTag = ref<TagView | null>(null);
const affixTags = ref<TagView[]>([]);
const menuPosition = reactive({ left: 0, top: 0 });

/**
 * Фильтруем закрепленные теги
 */
function filterAffixTags(routes: any[], basePath = "/") {
  let tags: TagView[] = [];
  routes.forEach((route) => {
    if (route.meta?.affix) {
      const tagPath = `${basePath}${route.path}`;
      tags.push({ ...route, fullPath: tagPath });
    }
    if (route.children) {
      tags = tags.concat(filterAffixTags(route.children, route.path));
    }
  });
  return tags;
}

/**
 * Инициализируем закрепленные теги
 */
function initTags() {
  affixTags.value = filterAffixTags(permissionStore.routes);
  affixTags.value.forEach((tag) => tagsViewStore.addVisitedView(tag));
}

/**
 * Добавляем текущий маршрут в теги
 */
function addCurrentTag() {
  if (route.name) {
    tagsViewStore.addView(route);
  }
}

/**
 * Прокручиваем до текущего тега
 */
function moveToCurrentTag() {
  nextTick(() => {
    const currentTag = visitedViews.value.find((v) => v.fullPath === route.fullPath);
    if (currentTag) {
      scrollPaneRef.value?.moveToTarget(currentTag);
    }
  });
}

/**
 * Закрываем меню тегов
 */
function closeTagMenu() {
  tagMenuVisible.value = false;
}

/**
 * Открываем меню тегов
 */
function openTagMenu(tag: TagView, event: MouseEvent) {
  selectedTag.value = tag;
  menuPosition.left = event.clientX + 15;
  menuPosition.top = event.clientY;
  tagMenuVisible.value = true;
}

/**
 * Закрываем выбранный тег
 */
function closeSelectedTag(tag: TagView) {
  tagsViewStore.delView(tag).then((views) => {
    if (route.fullPath === tag.fullPath) {
      router.push(views.visitedViews[views.visitedViews.length - 1]?.fullPath || "/");
    }
  });
}

/**
 * Закрываем все теги, кроме выбранного
 */
function closeOtherTags() {
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

/**
 * Закрываем все теги
 */
function closeAllTags() {
  tagsViewStore.delAllViews().then(() => {
    router.push("/");
  });
}

/**
 * Обновляем выбранный тег
 */
function refreshSelectedTag(tag: TagView) {
  tagsViewStore.delCachedView(tag);
  router.replace({ path: tag.fullPath });
}

watch(route, () => {
  addCurrentTag();
  moveToCurrentTag();
});

onMounted(() => {
  initTags();
});
</script>

<template>
  <div class="tags-container">
    <scroll-pane ref="scrollPaneRef">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.fullPath"
        :to="tag.fullPath"
        :class="{ active: tag.fullPath === route.fullPath }"
        class="tags-item"
        @contextmenu.prevent="openTagMenu(tag, $event)"
      >
        {{ translateRouteTitleI18n(tag.meta?.title) }}
        <i-ep-close
          v-if="!tag.meta?.affix"
          class="tags-item-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>

    <!-- Меню тегов -->
    <ul
      v-show="tagMenuVisible"
      class="tag-menu"
      :style="{ left: `${menuPosition.left}px`, top: `${menuPosition.top}px` }"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh" />
        {{ $t("tagsView.refresh") }}
      </li>
      <li v-if="!selectedTag?.meta?.affix" @click="closeSelectedTag(selectedTag)">
        <svg-icon icon-class="close" />
        {{ $t("tagsView.close") }}
      </li>
      <li @click="closeOtherTags">
        <svg-icon icon-class="close_other" />
        {{ $t("tagsView.closeOther") }}
      </li>
      <li @click="closeAllTags">
        <svg-icon icon-class="close_all" />
        {{ $t("tagsView.closeAll") }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);

  .tags-item {
    margin: 0 5px;
    padding: 5px 10px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;

    &.active {
      background: var(--el-color-primary);
      color: #fff;
    }

    .tags-item-close {
      margin-left: 5px;
      cursor: pointer;
    }
  }

  .tag-menu {
    position: absolute;
    z-index: 1000;
    background: var(--el-bg-color-overlay);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    li {
      padding: 8px 16px;
      cursor: pointer;
      &:hover {
        background: var(--el-fill-color-light);
      }
    }
  }
}
</style>
