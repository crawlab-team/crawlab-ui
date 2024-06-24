<script setup lang="ts">
defineOptions({ name: 'ClFileEditorNavMenu' });
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import Node from 'element-plus/es/components/tree/src/model/node';
import { useI18n } from 'vue-i18n';
import { KEY_CONTROL, KEY_META } from '@/constants/keyboard';
import { ElMessageBox, ElTree } from 'element-plus';
import { useDropzone } from 'crawlab-vue3-dropzone';
import {
  FileEditorNavMenuClickStatus,
  FileEditorStyles,
  FileNavItem,
} from '@/components/file/file';

const props = defineProps<{
  loading?: boolean;
  navMenuCollapsed?: boolean;
  activeItem?: FileNavItem;
  items: FileNavItem[];
  defaultExpandAll: boolean;
  defaultExpandedKeys: string[];
  styles?: FileEditorStyles;
}>();
const emit = defineEmits<{
  (e: 'node-click', item: FileNavItem): void;
  (e: 'node-db-click', item: FileNavItem): void;
  (e: 'ctx-menu-new-file', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-new-file-with-ai', item: FileNavItem): void;
  (e: 'ctx-menu-new-directory', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-rename', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-clone', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-delete', item: FileNavItem): void;
  (e: 'node-drop', draggingItem: FileNavItem, dropItem: FileNavItem): void;
  (e: 'drop-files', files: InputFile[]): void;
  (e: 'drop-files', files: InputFile[]): void;
  (e: 'search', value: string): void;
  (e: 'toggle-nav-menu'): void;
}>();

const { t } = useI18n();

const tree = ref<typeof ElTree>();

const fileEditorNavMenu = ref<HTMLDivElement>();

const clickStatus = reactive<FileEditorNavMenuClickStatus>({
  clicked: false,
  item: undefined,
});

const selectedCache = reactive<FileEditorNavMenuCache<boolean>>({});

const dragCache = reactive<FileEditorNavMenuCache<boolean>>({});

const isCtrlKeyPressed = ref<boolean>(false);

const activeContextMenuItem = ref<FileNavItem>();

const contextMenuClicking = ref<boolean>(false);

const expandedKeys = ref<string[]>([]);

const computedDefaultExpandedKeys = computed<string[]>(() => {
  return ['~'].concat(expandedKeys.value);
});

const addDefaultExpandedKey = (key: string) => {
  if (!expandedKeys.value.includes(key)) expandedKeys.value.push(key);
};

const removeDefaultExpandedKey = (key: string) => {
  if (!expandedKeys.value.includes(key)) return;
  const idx = expandedKeys.value.indexOf(key);
  expandedKeys.value.splice(idx, 1);
};

const resetDefaultExpandedKeys = () => {
  expandedKeys.value = [];
};

const resetClickStatus = () => {
  clickStatus.clicked = false;
  clickStatus.item = undefined;
  activeContextMenuItem.value = undefined;
};

const updateSelectedMap = (item: FileNavItem) => {
  const key = item.path;
  if (!key) {
    console.warn('No path specified for FileNavItem');
    return;
  }
  if (!selectedCache[key]) {
    selectedCache[key] = false;
  }
  selectedCache[key] = !selectedCache[key];

  // if Ctrl key is not pressed, clear other selection
  if (!isCtrlKeyPressed.value) {
    Object.keys(selectedCache)
      .filter(k => k !== key)
      .forEach(k => {
        selectedCache[k] = false;
      });
  }
};

const onNodeClick = (item: FileNavItem) => {
  if (clickStatus.clicked && clickStatus.item?.path === item.path) {
    emit('node-db-click', item);
    updateSelectedMap(item);
    resetClickStatus();
    return;
  }

  clickStatus.item = item;
  clickStatus.clicked = true;
  setTimeout(() => {
    if (clickStatus.clicked) {
      emit('node-click', item);
      updateSelectedMap(item);
    }
    resetClickStatus();
  }, 200);
};

const onNodeContextMenuShow = (ev: Event, item: FileNavItem) => {
  contextMenuClicking.value = true;
  activeContextMenuItem.value = item;
  setTimeout(() => {
    contextMenuClicking.value = false;
  }, 500);
};

const onNodeContextMenuHide = () => {
  activeContextMenuItem.value = undefined;
};

const onNodeContextMenuNewFile = async (item: FileNavItem) => {
  const res = await ElMessageBox.prompt(
    t('components.file.editor.messageBox.prompt.newFile'),
    t('components.file.editor.navMenu.newFile'),
    {
      inputPlaceholder: t('components.file.editor.messageBox.prompt.newFile'),
      confirmButtonClass: 'confirm-btn',
    }
  );
  emit('ctx-menu-new-file', item, res.value);
};

const onNodeContextMenuNewFileWithAi = async (item: FileNavItem) => {
  console.debug(item);
  emit('ctx-menu-new-file-with-ai', item);
};

const onNodeContextMenuNewDirectory = async (item: FileNavItem) => {
  const res = await ElMessageBox.prompt(
    t('components.file.editor.messageBox.prompt.newDirectory'),
    t('components.file.editor.navMenu.newDirectory'),
    {
      inputPlaceholder: t(
        'components.file.editor.messageBox.prompt.newDirectory'
      ),
      confirmButtonClass: 'confirm-btn',
    }
  );
  emit('ctx-menu-new-directory', item, res.value);
};

const onNodeContextMenuRename = async (item: FileNavItem) => {
  const res = await ElMessageBox.prompt(
    t('components.file.editor.messageBox.prompt.rename'),
    t('components.file.editor.navMenu.rename'),
    {
      inputValue: item.name,
      inputPlaceholder: t('components.file.editor.messageBox.prompt.rename'),
      inputValidator: (value: string) => value !== item.name,
      inputErrorMessage: t(
        'components.file.editor.messageBox.validator.errorMessage.newNameNotSameAsOldName'
      ),
      confirmButtonClass: 'confirm-btn',
    }
  );
  emit('ctx-menu-rename', item, res.value);
};

const onNodeContextMenuClone = async (item: FileNavItem) => {
  const res = await ElMessageBox.prompt(
    t('components.file.editor.messageBox.prompt.duplicate'),
    t('components.file.editor.navMenu.duplicate'),
    {
      inputValue: `${item.name}`,
      inputPlaceholder: t('components.file.editor.messageBox.prompt.newFile'),
      inputValidator: (value: string) => value !== item.name,
      inputErrorMessage: t(
        'components.file.editor.messageBox.validator.errorMessage.newNameNotSameAsOldName'
      ),
      confirmButtonClass: 'confirm-btn',
    }
  );
  emit('ctx-menu-clone', item, res.value);
};

const onNodeContextMenuDelete = async (item: FileNavItem) => {
  await ElMessageBox.confirm(
    t('common.messageBox.confirm.delete'),
    t('common.actions.delete'),
    {
      type: 'warning',
      confirmButtonClass: 'el-button--danger confirm-btn',
    }
  );
  emit('ctx-menu-delete', item);
};

const onNodeDragEnter = (draggingNode: Node, dropNode: Node) => {
  const item = dropNode.data as FileNavItem;
  if (!item.path) return;
  dragCache[item.path] = true;
};

const onNodeDragLeave = (draggingNode: Node, dropNode: Node) => {
  const item = dropNode.data as FileNavItem;
  if (!item.path) return;
  dragCache[item.path] = false;
};

const onNodeDragEnd = () => {
  for (const key in dragCache) {
    dragCache[key] = false;
  }
};

const onNodeDrop = (draggingNode: Node, dropNode: Node) => {
  const draggingItem = draggingNode.data as FileNavItem;
  const dropItem = dropNode.data as FileNavItem;
  emit('node-drop', draggingItem, dropItem);
};

const onNodeExpand = (data: FileNavItem) => {
  addDefaultExpandedKey(data.path as string);
};

const onNodeCollapse = (data: FileNavItem) => {
  removeDefaultExpandedKey(data.path as string);
};

const isSelected = (item: FileNavItem): boolean => {
  if (!item.path) return false;
  return selectedCache[item.path] || false;
};

const isDroppable = (item: FileNavItem): boolean => {
  if (!item.path) return false;
  return dragCache[item.path] || false;
};

const isShowContextMenu = (item: FileNavItem) => {
  return activeContextMenuItem.value?.path === item.path;
};

const allowDrop = (draggingNode: Node, dropNode: Node, type: any) => {
  if (type !== 'inner') return false;
  if (draggingNode.data?.path === dropNode.data?.path) return false;
  if (draggingNode.parent?.data?.path === dropNode.data?.path) return false;
  const item = dropNode.data as FileNavItem;
  return item.is_dir;
};

const getItemClass = (item: FileNavItem): string[] => {
  const cls = [];
  if (isDroppable(item)) cls.push('droppable');
  return cls;
};

const { getRootProps } = useDropzone({
  onDrop: (files: InputFile[]) => {
    emit('drop-files', files);
  },
});

const getBindDir = (item: FileNavItem) =>
  getRootProps({
    onDragEnter: (ev: DragEvent) => {
      ev.stopPropagation();
      if (!item.is_dir || !item.path) return;
      dragCache[item.path] = true;
    },
    onDragLeave: (ev: DragEvent) => {
      ev.stopPropagation();
      if (!item.is_dir || !item.path) return;
      dragCache[item.path] = false;
    },
    onDrop: () => {
      for (const key in dragCache) {
        dragCache[key] = false;
      }
    },
  });

onMounted(() => {
  // listen to keyboard events
  document.onkeydown = (ev: KeyboardEvent) => {
    if (!ev) return;
    if (ev.key === KEY_CONTROL || ev.key === KEY_META) {
      isCtrlKeyPressed.value = true;
    }
  };
  document.onkeyup = (ev: KeyboardEvent) => {
    if (!ev) return;
    if (ev.key === KEY_CONTROL || ev.key === KEY_META) {
      isCtrlKeyPressed.value = false;
    }
  };
});

onUnmounted(() => {
  // turnoff listening to keyboard events
  document.onkeydown = null;
  document.onkeyup = null;
});

watch(
  () => props.defaultExpandedKeys,
  () => {
    expandedKeys.value = props.defaultExpandedKeys;

    expandedKeys.value.forEach(key => {
      const n = tree.value?.getNode(key);
      if (!n?.data) return;
      emit('node-db-click', n.data);
    });
  }
);

// resize tree height
const treeHeight = ref<number>();
const treeHeightObserver = new ResizeObserver(() => {
  treeHeight.value = fileEditorNavMenu.value?.clientHeight;
});
onMounted(() => {
  treeHeight.value = fileEditorNavMenu.value?.clientHeight;
  treeHeightObserver.observe(fileEditorNavMenu.value as Element);
});
onBeforeUnmount(() => {
  treeHeightObserver.unobserve(fileEditorNavMenu.value as Element);
});

const showSettings = ref<boolean>(false);
const fileSearchString = ref<string>('');
</script>

<template>
  <div
    v-loading="loading && { background: 'var(--cl-loading-background-color)' }"
    :class="navMenuCollapsed ? 'collapsed' : ''"
    class="nav-menu"
  >
    <!-- file editor search -->
    <div :style="{ ...styles?.default }" class="nav-menu-top-bar">
      <div class="left">
        <el-input
          v-model="fileSearchString"
          :style="styles?.default"
          class="search"
          clearable
          :placeholder="t('components.file.editor.sidebar.search.placeholder')"
          @input="emit('search', fileSearchString)"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <cl-icon :icon="['fa', 'search']" />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="right">
        <el-tooltip
          v-if="false"
          :content="t('components.file.editor.sidebar.settings')"
        >
          <span class="action-icon" @click="showSettings = true">
            <div class="background" />
            <cl-icon :icon="['fa', 'cog']" />
          </span>
        </el-tooltip>
        <el-tooltip
          :content="t('components.file.editor.sidebar.toggle.hideFiles')"
        >
          <span class="action-icon" @click="emit('toggle-nav-menu')">
            <div class="background" />
            <cl-icon :icon="['fa', 'minus']" />
          </span>
        </el-tooltip>
      </div>
    </div>

    <!-- file editor nav menu -->
    <div
      :style="{ ...styles?.default }"
      ref="fileEditorNavMenu"
      class="file-editor-nav-menu"
    >
      <el-tree-v2
        ref="tree"
        :height="treeHeight"
        :render-after-expand="defaultExpandAll"
        :data="items"
        :expand-on-click-node="false"
        :highlight-current="false"
        :allow-drop="allowDrop"
        empty-text="No files available"
        icon-class="fa fa-angle-right"
        :style="{ ...styles?.default }"
        :default-expanded-keys="computedDefaultExpandedKeys"
        draggable
        @node-drag-enter="onNodeDragEnter"
        @node-drag-leave="onNodeDragLeave"
        @node-drag-end="onNodeDragEnd"
        @node-drop="onNodeDrop"
        @node-click="onNodeClick"
        @node-contextmenu="onNodeContextMenuShow"
        @node-expand="onNodeExpand"
        @node-collapse="onNodeCollapse"
      >
        <template #default="{ data }">
          <cl-file-editor-nav-menu-context-menu
            :clicking="contextMenuClicking"
            :visible="isShowContextMenu(data)"
            @hide="onNodeContextMenuHide"
            @clone="onNodeContextMenuClone(data)"
            @delete="onNodeContextMenuDelete(data)"
            @rename="onNodeContextMenuRename(data)"
            @new-file="onNodeContextMenuNewFile(data)"
            @new-file-with-ai="onNodeContextMenuNewFileWithAi(data)"
            @new-directory="onNodeContextMenuNewDirectory(data)"
          >
            <div
              v-bind="getBindDir(data)"
              :class="getItemClass(data)"
              class="nav-item-wrapper"
            >
              <div
                class="background"
                :style="{
                  backgroundColor: isSelected(data)
                    ? styles?.active.backgroundColor
                    : '',
                }"
              />
              <div class="nav-item">
                <span class="icon">
                  <cl-atom-material-icon
                    :is-dir="data.is_dir"
                    :name="data.name"
                  />
                </span>
                <span class="title">
                  {{ data.name }}
                </span>
              </div>
            </div>
          </cl-file-editor-nav-menu-context-menu>
        </template>
      </el-tree-v2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-menu {
  flex-basis: var(--cl-file-editor-nav-menu-width);
  min-width: var(--cl-file-editor-nav-menu-width);
  display: flex;
  flex-direction: column;
  transition: all var(--cl-file-editor-nav-menu-collapse-transition-duration);

  &.collapsed {
    min-width: 0;
    flex-basis: 0;
    overflow: hidden;
  }

  .nav-menu-top-bar {
    flex-basis: var(--cl-file-editor-nav-menu-top-bar-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 0 10px 0 0;

    .left,
    .right {
      display: flex;
    }

    .action-icon {
      cursor: pointer;
    }
  }

  .file-editor-nav-menu {
    flex: 1;
    max-height: 100%;
    overflow: auto;

    .el-tree {
      height: 100%;
      min-width: 100%;
      max-width: fit-content;

      .el-tree-node {
        .nav-item-wrapper {
          z-index: 2;

          & * {
            pointer-events: none;
          }

          &.droppable {
            & * {
              pointer-events: none;
            }

            .nav-item {
              border: 1px dashed
                var(--cl-file-editor-nav-menu-item-drag-target-border-color);
            }
          }

          .nav-item:hover,
          .background:hover + .nav-item {
            color: var(--cl-file-editor-nav-menu-item-selected-color);
          }

          .background {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: -1;
          }

          .nav-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            user-select: none;

            .icon {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped>
.nav-menu .nav-menu-top-bar:deep(.search .el-input__wrapper > .el-input__inner),
.nav-menu .nav-menu-top-bar:deep(.search .el-input__wrapper) {
  border: none;
  background: transparent;
  color: inherit;
  box-shadow: none;
}

.file-editor-nav-menu:deep(.el-tree .el-tree-node > .el-tree-node__content) {
  background-color: inherit;
  position: relative;
  z-index: 0;
}

.file-editor-nav-menu:deep(
    .el-tree .el-tree-node > .el-tree-node__content .el-tree-node__expand-icon
  ) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  font-size: 16px;
  padding: 0;
  margin: 0;
}

.file-editor-nav-menu:deep(.el-tree .el-tree-node *) {
  transition: none;
}
</style>
