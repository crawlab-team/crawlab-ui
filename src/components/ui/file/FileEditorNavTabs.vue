<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Close } from '@element-plus/icons-vue';

const props = defineProps<{
  activeTab?: FileNavItem;
  tabs?: FileNavItem[];
  styles?: FileEditorStyles;
}>();

const emit = defineEmits<{
  (e: 'tab-click', item: FileNavItem): void;
  (e: 'tab-close', item: FileNavItem): void;
  (e: 'tab-close-others', item: FileNavItem): void;
  (e: 'tab-close-all'): void;
  (e: 'tab-dragend', items: FileNavItem[]): void;
  (e: 'show-more'): void;
}>();

const activeContextMenuItem = ref<FileNavItem>();

const navTabs = ref<HTMLDivElement>();

const navTabsWidth = ref<number>();

const navTabsOverflowWidth = ref<number>();

const contextMenuClicking = ref<boolean>(false);

const tabs = computed<FileNavItem[]>(() => {
  const { tabs } = props as FileEditorNavTabsProps;
  return tabs;
});

const getTitle = (item: FileNavItem) => {
  return item.name;
};

const onClick = (item: FileNavItem) => {
  emit('tab-click', item);
};

const onClose = (item: FileNavItem) => {
  emit('tab-close', item);
};

const onCloseOthers = (item: FileNavItem) => {
  emit('tab-close-others', item);
};

const onCloseAll = () => {
  emit('tab-close-all');
};

const onDragEnd = (items: FileNavItem[]) => {
  emit('tab-dragend', items);
};

const onContextMenuShow = (item: FileNavItem) => {
  contextMenuClicking.value = true;
  activeContextMenuItem.value = item;

  setTimeout(() => {
    contextMenuClicking.value = false;
  }, 500);
};

const onContextMenuHide = () => {
  activeContextMenuItem.value = undefined;
};

const isShowContextMenu = (item: FileNavItem) => {
  return activeContextMenuItem.value?.path === item.path;
};

const updateWidths = () => {
  if (!navTabs.value) return;

  // width
  navTabsWidth.value = Number(
    getComputedStyle(navTabs.value).width.replace('px', '')
  );

  // overflow width
  const el = navTabs.value.querySelector('.draggable-list');
  if (el) {
    navTabsOverflowWidth.value = Number(
      getComputedStyle(el).width.replace('px', '')
    );
  }
};

const isActive = (item: FileNavItem) => {
  return props.activeTab && props.activeTab.path === item.path;
};

const getItemStyle = (item: FileNavItem) => {
  const { styles } = props;
  if (isActive(item)) {
    return {
      backgroundColor: styles?.active.backgroundColor,
      color: styles?.active.color,
    };
  } else {
    return {
      backgroundColor: styles?.default.backgroundColor,
      color: styles?.default.color,
    };
  }
};

watch(tabs.value, () => {
  setTimeout(updateWidths, 100);
});

onMounted(() => {
  // update tabs widths
  updateWidths();
});
defineOptions({ name: 'ClFileEditorNavTabs' });
</script>

<template>
  <div
    ref="navTabs"
    :style="{
      backgroundColor: styles?.default.backgroundColor,
      color: styles?.default.color,
      borderBottom: `1px solid ${styles?.default.borderColor}`,
    }"
    class="file-editor-nav-tabs"
  >
    <slot name="prefix" />
    <cl-draggable-list item-key="path" :items="tabs" @d-end="onDragEnd">
      <template v-slot="{ item }">
        <cl-file-editor-nav-tabs-context-menu
          :clicking="contextMenuClicking"
          :visible="isShowContextMenu(item)"
          @close="onClose(item)"
          @hide="onContextMenuHide"
          @close-others="onCloseOthers(item)"
          @close-all="onCloseAll"
        >
          <div
            :class="isActive(item) ? 'active' : ''"
            :style="getItemStyle(item)"
            class="file-editor-nav-tab"
            @click="onClick(item)"
            @contextmenu.prevent="onContextMenuShow(item)"
          >
            <span class="icon">
              <cl-atom-material-icon :is-dir="item.is_dir" :name="item.name" />
            </span>
            <el-tooltip :content="getTitle(item)" :show-after="500">
              <span
                class="title"
                :style="{
                  color: styles?.active?.color,
                }"
              >
                {{ getTitle(item) }}
              </span>
            </el-tooltip>
            <span class="close-btn" @click.stop="onClose(item)">
              <el-icon>
                <close />
              </el-icon>
            </span>
            <div class="background" />
          </div>
        </cl-file-editor-nav-tabs-context-menu>
      </template>
    </cl-draggable-list>
  </div>
</template>

<style scoped>
.file-editor-nav-tabs {
  position: relative;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  height: var(--cl-file-editor-nav-tabs-height);
  flex: var(--cl-file-editor-nav-tabs-height) 0 0;

  .file-editor-nav-tab {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: left;
    height: var(--cl-file-editor-nav-tabs-height);
    max-width: var(--cl-file-editor-nav-tabs-item-max-width);
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 10px;
    font-size: 14px;
    cursor: pointer;
    box-sizing: border-box;
    z-index: 1;

    &:hover {
      .background {
        background-color: var(--cl-file-editor-mask-bg);
      }
    }

    &.active {
      border-bottom: 2px solid var(--cl-primary-color);

      .title {
        color: var(--cl-file-editor-nav-tabs-item-active-color);
      }
    }

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .icon {
      margin-right: 5px;
      z-index: 1;
    }

    .title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--cl-file-editor-nav-tabs-item-active-color);
      z-index: 1;
    }

    .close-btn {
      margin-left: 5px;
      z-index: 1;
      display: flex;
      align-items: center;
    }
  }

  .suffix {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
