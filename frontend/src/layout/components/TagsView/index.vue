<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  ref,
  watch,
  onMounted,
  ComponentInternalInstance,
} from "vue";
import { storeToRefs } from "pinia";
import path from "path-browserify";
import { useRoute, useRouter } from "vue-router";
import { translateRouteTitleI18n } from "@/utils/i18n";
import { usePermissionStore } from "@/store/modules/permission";
import { useTagsViewStore, TagView } from "@/store/modules/tagsView";
import ScrollPane from "./ScrollPane.vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const router = useRouter();
const route = useRoute();

const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();

const { visitedViews } = storeToRefs(tagsViewStore);

const selectedTag = ref({});
const scrollPaneRef = ref();
const left = ref(0);
const top = ref(0);
const affixTags = ref<TagView[]>([]);

watch(
  route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  {
    immediate: true, // Выполнять сразу после инициализации
  }
);

const tagMenuVisible = ref(false); // Видимость меню тегов
watch(tagMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeTagMenu);
  } else {
    document.body.removeEventListener("click", closeTagMenu);
  }
});

/**
 * Фильтруем закреплённые теги
 */
function filterAffixTags(routes: any[], basePath = "/") {
  let tags: TagView[] = [];

  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }

    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      if (childTags.length >= 1) {
        tags = tags.concat(childTags);
      }
    }
  });
  return tags;
}

/**
 * Инициализация закреплённых тегов
 */
function initTags() {
  const tags: TagView[] = filterAffixTags(permissionStore.routes);
  affixTags.value = tags;
  for (const tag of tags) {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}

/**
 * Добавляем текущий тег
 */
function addTags() {
  if (route.name) {
    tagsViewStore.addView(route);
  }
}

/**
 * Прокрутка к текущему тегу
 */
function moveToCurrentTag() {
  nextTick(() => {
    for (const r of tagsViewStore.visitedViews) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r);
        if (r.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route);
        }
      }
    }
  });
}

function isActive(tag: TagView) {
  return tag.path === route.path;
}

function isAffix(tag: TagView) {
  return tag.meta && tag.meta.affix;
}

function closeSelectedTag(tag: TagView) {
  tagsViewStore.delView(tag).then((res: any) => {
    if (isActive(tag)) {
      const latestView = res.visitedViews.slice(-1)[0];
      router.push(latestView?.fullPath || "/");
    }
  });
}

function closeOtherTags() {
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

function closeAllTags() {
  tagsViewStore.delAllViews().then(() => {
    router.push("/");
  });
}

function refreshSelectedTag(tag: TagView) {
  tagsViewStore.delCachedView(tag);
  router.replace({ path: tag.fullPath });
}

function openTagMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105;
  const offsetLeft = proxy?.$el.getBoundingClientRect().left || 0;
  const offsetWidth = proxy?.$el.offsetWidth || 0;
  const maxLeft = offsetWidth - menuMinWidth;
  const l = e.clientX - offsetLeft + 15;

  left.value = l > maxLeft ? maxLeft : l;
  top.value = e.clientY;
  tagMenuVisible.value = true;
  selectedTag.value = tag;
}

function closeTagMenu() {
  tagMenuVisible.value = false;
}

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
        :to="{ path: tag.fullPath }"
        class="tags-item"
        :class="{ active: isActive(tag) }"
        @contextmenu.prevent="openTagMenu(tag, $event)"
      >
        {{ translateRouteTitleI18n(tag.meta?.title) }}
        <span
          v-if="!isAffix(tag)"
          class="tags-item-close"
          @click.stop="closeSelectedTag(tag)"
        >
          ×
        </span>
      </router-link>
    </scroll-pane>

    <!-- Меню тегов -->
    <ul
      v-show="tagMenuVisible"
      class="tag-menu"
      :style="{ left: `${left}px`, top: `${top}px` }"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        {{ $t("tagsView.refresh") }}
      </li>
      <li v-if="!selectedTag?.meta?.affix" @click="closeSelectedTag(selectedTag)">
        {{ $t("tagsView.close") }}
      </li>
      <li @click="closeOtherTags">
        {{ $t("tagsView.closeOther") }}
      </li>
      <li @click="closeAllTags">
        {{ $t("tagsView.closeAll") }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-container {
  display: flex;
  height: 34px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.tags-item {
  margin: 0 5px;
  padding: 5px 10px;
  border-radius: 4px;
  background: var(--el-bg-color-overlay);
  cursor: pointer;
}

.tags-item.active {
  background: var(--el-color-primary);
  color: #fff;
}

.tag-menu {
  position: absolute;
  background: var(--el-bg-color-overlay);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
