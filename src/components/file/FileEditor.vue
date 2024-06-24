<script setup lang="ts">
defineOptions({ name: 'ClFileEditor' });
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import * as monaco from 'monaco-editor';
import { FILE_ROOT } from '@/constants/file';
import { FileEditorStyles, FileNavItem } from '@/components/file/file';

// components
import FileEditorNavTabs from '@/components/file/FileEditorNavTabs.vue';
import { useI18n } from 'vue-i18n';
import { sendEvent } from '@/admin/umeng';
import { getLanguageByFileName } from '@/utils';

// tab content cache
const editorTabContentCache = new Map<string, string>();

const props = defineProps<{
  ns: ListStoreNamespace;
  content: string;
  navItems: FileNavItem[];
  activeNavItem?: FileNavItem;
  defaultExpandedKeys: string[];
  navMenuLoading?: boolean;
}>();
const emit = defineEmits<{
  (e: 'content-change', item: string): void;
  (e: 'node-click', item: FileNavItem): void;
  (e: 'node-db-click', item: FileNavItem): void;
  (e: 'node-drop', draggingItem: FileNavItem, dropItem: FileNavItem): void;
  (e: 'ctx-menu-new-file', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-new-file-with-ai', item: FileNavItem): void;
  (e: 'ctx-menu-new-directory', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-rename', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-clone', item: FileNavItem, name: string): void;
  (e: 'ctx-menu-delete', item: FileNavItem): void;
  (e: 'tab-click', tab: FileNavItem): void;
  (e: 'save-file', item: FileNavItem): void;
  (e: 'drop-files', files: InputFile[]): void;
  (
    e: 'create-with-ai',
    name: string,
    sourceCode: string,
    item?: FileNavItem
  ): void;
}>();

// i18n
const { t } = useI18n();

// store
const ns = props.ns;
const store = useStore();
const { file: fileState } = store.state as RootStoreState;

const fileEditor = ref<HTMLDivElement>();

const resizeObserver = new ResizeObserver(() => {
  setTimeout(() => {
    editor?.layout();
  }, 200);
});

const tabs = ref<FileNavItem[]>([]);

const activeFileItem = computed<FileNavItem | undefined>(
  () => props.activeNavItem
);

const themeColors = ref<monaco.editor.IColors>({});

const styles = computed<FileEditorStyles>(() => {
  return {
    default: {
      backgroundColor: themeColors.value['editor.background'],
      color: themeColors.value['editor.foreground'],
    },
    active: {
      backgroundColor: themeColors.value['editor.selectionHighlightBackground'],
      color: themeColors.value['editor.foreground'],
    },
  };
});

const navMenuCollapsed = ref<boolean>(false);

const editorRef = ref<HTMLDivElement>();

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const showEditor = computed<boolean>(() => !!activeFileItem.value);

const navTabs = ref<typeof FileEditorNavTabs>();

const showMoreContextMenuVisible = ref<boolean>(false);

const language = computed<string>(() => {
  const fileName = activeFileItem.value?.name;
  return getLanguageByFileName(fileName);
});

const content = computed<string>(() => {
  const { content } = props;
  return content || '';
});

const fileSearchString = ref<string>('');

const updateEditorOptions = () => {
  editor?.updateOptions(fileState.editorOptions);

  // @ts-ignore
  themeColors.value = editor?._themeService.getColorTheme().themeData.colors;
};

const updateEditorContent = () => {
  editor?.setValue(content.value || '');
};

const getContentCache = (tab: FileNavItem) => {
  if (!tab.path) return;
  const key = tab.path;
  const content = editorTabContentCache.get(key);
  emit('content-change', content as string);
};

const updateContentCache = (tab: FileNavItem, content: string) => {
  if (!tab.path) return;
  const key = tab.path as string;
  editorTabContentCache.set(key, content as string);
};

const deleteContentCache = (tab: FileNavItem) => {
  if (!tab.path) return;
  const key = tab.path;
  editorTabContentCache.delete(key);
};

const deleteOtherContentCache = (tab: FileNavItem) => {
  if (!tab.path) return;
  const key = tab.path;
  const content = editorTabContentCache.get(key);
  editorTabContentCache.clear();
  editorTabContentCache.set(key, content as string);
};

const clearContentCache = () => {
  editorTabContentCache.clear();
};

const getFilteredFiles = (items: FileNavItem[]): FileNavItem[] => {
  return items
    .filter(d => {
      if (!fileSearchString.value) return true;
      if (!d.is_dir) {
        return d.name
          ?.toLowerCase()
          .includes(fileSearchString.value.toLowerCase());
      }
      if (d.children) {
        const children = getFilteredFiles(d.children);
        if (children.length > 0) {
          return true;
        }
      }
      return false;
    })
    .map(d => {
      if (!d.is_dir) return d;
      d.id = d.path;
      d.children = getFilteredFiles(d.children || []);
      return d;
    })
    .sort((a, b) => {
      if (a.is_dir && !b.is_dir) return -1;
      if (!a.is_dir && b.is_dir) return 1;
      return a.name?.localeCompare(b.name || '') || 0;
    });
};

const files = computed<FileNavItem[]>(() => {
  const { navItems } = props;
  const root: FileNavItem = {
    id: FILE_ROOT,
    path: FILE_ROOT,
    name: FILE_ROOT,
    is_dir: true,
    children: getFilteredFiles(navItems || []),
  };
  return [root];
});

const updateTabs = (item?: FileNavItem) => {
  // add tab
  if (item && !tabs.value.find(t => t.path === item.path)) {
    if (tabs.value.length === 0) {
      store.commit(`${ns}/setActiveFileNavItem`, item);
    }
    tabs.value.push(item);
    getContentCache(item);
  }
};

const onNavItemClick = (item: FileNavItem) => {
  emit('node-click', item);

  sendEvent('click_file_editor_nav_menu_item_click');
};

const onNavItemDbClick = (item: FileNavItem) => {
  store.commit(`${ns}/setActiveFileNavItem`, item);
  emit('node-db-click', item);

  // update tabs
  updateTabs(item);

  sendEvent('click_file_editor_nav_menu_item_dbclick');
};

const onNavItemDrop = (draggingItem: FileNavItem, dropItem: FileNavItem) => {
  emit('node-drop', draggingItem, dropItem);

  sendEvent('click_file_editor_nav_menu_item_drop');
};

const onContextMenuNewFile = (item: FileNavItem, name: string) => {
  emit('ctx-menu-new-file', item, name);

  sendEvent('click_file_editor_nav_menu_item_context_menu_new_file');
};

const onContextMenuNewFileWithAi = (item: FileNavItem) => {
  console.debug(item);
  emit('ctx-menu-new-file-with-ai', item);
};

const onContextMenuNewDirectory = (item: FileNavItem, name: string) => {
  emit('ctx-menu-new-directory', item, name);

  sendEvent('click_file_editor_nav_menu_item_context_menu_new_directory');
};

const onContextMenuRename = (item: FileNavItem, name: string) => {
  emit('ctx-menu-rename', item, name);

  sendEvent('click_file_editor_nav_menu_item_context_menu_rename');
};

const onContextMenuClone = (item: FileNavItem, name: string) => {
  emit('ctx-menu-clone', item, name);

  sendEvent('click_file_editor_nav_menu_item_context_menu_clone');
};

const onContextMenuDelete = (item: FileNavItem) => {
  emit('ctx-menu-delete', item);

  sendEvent('click_file_editor_nav_menu_item_context_menu_delete');
};

const onContentChange = (content: string) => {
  if (!activeFileItem.value) return;
  emit('content-change', content);

  // update in cache
  updateContentCache(activeFileItem.value, content);

  sendEvent('click_file_editor_content_change');
};

const onTabClick = (tab: FileNavItem) => {
  store.commit(`${ns}/setActiveFileNavItem`, tab);
  emit('tab-click', tab);

  // get from cache and update content
  getContentCache(tab);

  sendEvent('click_file_editor_tab_click');
};

const closeTab = (tab: FileNavItem) => {
  const idx = tabs.value.findIndex(t => t.path === tab.path);
  if (idx !== -1) {
    tabs.value.splice(idx, 1);
  }
  if (activeFileItem.value) {
    if (activeFileItem.value.path === tab.path) {
      if (idx === 0) {
        store.commit(`${ns}/setActiveFileNavItem`, tabs.value[0]);
      } else {
        store.commit(`${ns}/setActiveFileNavItem`, tabs.value[idx - 1]);
      }
    }

    // get from cache
    setTimeout(() => {
      if (activeFileItem.value) {
        getContentCache(activeFileItem.value);
      }
    }, 0);
  }

  // delete in cache
  deleteContentCache(tab);
};

const onTabClose = (tab: FileNavItem) => {
  closeTab(tab);

  sendEvent('click_file_editor_tab_close');
};

const onTabCloseOthers = (tab: FileNavItem) => {
  tabs.value = [tab];
  store.commit(`${ns}/setActiveFileNavItem`, tab);

  // clear cache and update current tab content
  deleteOtherContentCache(tab);

  sendEvent('click_file_editor_tab_close_others');
};

const onTabCloseAll = () => {
  tabs.value = [];
  store.commit(`${ns}/resetActiveFileNavItem`);

  // clear cache
  clearContentCache();

  sendEvent('click_file_editor_tab_close_all');
};

const onTabDragEnd = (newTabs: FileNavItem[]) => {
  tabs.value = newTabs;

  sendEvent('click_file_editor_tab_dragend');
};

const onShowMoreShow = () => {
  showMoreContextMenuVisible.value = true;

  sendEvent('click_file_editor_showmore_show');
};

const onShowMoreHide = () => {
  showMoreContextMenuVisible.value = false;

  sendEvent('click_file_editor_showmore_hide');
};

const onClickShowMoreContextMenuItem = (tab: FileNavItem) => {
  store.commit(`${ns}/setActiveFileNavItem`, tab);
  emit('tab-click', tab);

  sendEvent('click_file_editor_showmore_click_context_menu_item');
};

const keyMapSave = () => {
  if (!activeFileItem.value) return;
  emit('save-file', activeFileItem.value);
};

const addSaveKeyMap = () => {
  editor?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, keyMapSave);
};

const onToggleNavMenu = () => {
  navMenuCollapsed.value = !navMenuCollapsed.value;

  sendEvent('click_file_editor_nav_menu_toggle', {
    collapse: !navMenuCollapsed.value,
  });
};

const update = async () => {
  setTimeout(() => {
    editor?.layout();
    editor?.setValue(content.value);
    monaco.editor.setModelLanguage(editor?.getModel()!, language.value);
  }, 100);
};

watch(() => JSON.stringify(fileState.editorOptions), updateEditorOptions);
watch(() => JSON.stringify(activeFileItem.value), update);

const onDropFiles = (files: InputFile[]) => {
  emit('drop-files', files);

  sendEvent('click_file_editor_drop_files');
};

const onFileSearch = (value: string) => {
  fileSearchString.value = value;

  sendEvent('click_file_editor_file_search');
};

const initEditor = async () => {
  if (!editorRef.value) return;
  editor = monaco.editor.create(editorRef.value, fileState.editorOptions);

  resizeObserver.observe(editorRef.value);

  // add save key map
  addSaveKeyMap();

  // on editor change
  // editor.on('change', onContentChange);
  editor.onDidChangeModelContent(() => {
    onContentChange(editor?.getValue() || '');
  });

  // update editor options
  updateEditorOptions();

  // update editor content
  updateEditorContent();
};

const onCreateWithAi = (
  name: string,
  sourceCode: string,
  item?: FileNavItem
) => {
  emit('create-with-ai', name, sourceCode, item);
};

onMounted(initEditor);

onUnmounted(() => {
  if (resizeObserver && editorRef.value) {
    resizeObserver.unobserve(editorRef.value);
  }
  editor?.dispose();
  store.commit(`${ns}/resetActiveFileNavItem`);
});
</script>

<template>
  <div ref="fileEditor" class="file-editor">
    <cl-file-editor-nav-menu
      :loading="navMenuLoading"
      :nav-menu-collapsed="navMenuCollapsed"
      :active-item="activeFileItem"
      :default-expand-all="!!fileSearchString"
      :default-expanded-keys="defaultExpandedKeys"
      :items="files"
      :styles="styles"
      @node-click="onNavItemClick"
      @node-db-click="onNavItemDbClick"
      @node-drop="onNavItemDrop"
      @ctx-menu-new-file="onContextMenuNewFile"
      @ctx-menu-new-file-with-ai="onContextMenuNewFileWithAi"
      @ctx-menu-new-directory="onContextMenuNewDirectory"
      @ctx-menu-rename="onContextMenuRename"
      @ctx-menu-clone="onContextMenuClone"
      @ctx-menu-delete="onContextMenuDelete"
      @drop-files="onDropFiles"
      @search="onFileSearch"
      @toggle-nav-menu="onToggleNavMenu"
    />
    <div class="file-editor-content">
      <cl-file-editor-nav-tabs
        ref="navTabs"
        :active-tab="activeFileItem"
        :tabs="tabs"
        :styles="styles"
        @tab-click="onTabClick"
        @tab-close="onTabClose"
        @tab-close-others="onTabCloseOthers"
        @tab-close-all="onTabCloseAll"
        @tab-dragend="onTabDragEnd"
      >
        <template v-if="navMenuCollapsed" #prefix>
          <el-tooltip
            :content="t('components.file.editor.sidebar.toggle.showFiles')"
          >
            <span class="action-icon expand-files" @click="onToggleNavMenu">
              <div class="background" />
              <cl-icon :icon="['fa', 'bars']" />
            </span>
          </el-tooltip>
        </template>
      </cl-file-editor-nav-tabs>
      <div
        ref="editorRef"
        :class="showEditor ? '' : 'hidden'"
        class="editor"
        :style="{ ...styles.default }"
      />
      <div
        v-show="!showEditor"
        class="empty-content"
        :style="{ ...styles.default }"
      >
        {{ t('components.file.editor.empty.placeholder') }}
      </div>
      <template v-if="navTabs && navTabs.showMoreVisible">
        <cl-file-editor-nav-tabs-show-more-context-menu
          :tabs="tabs"
          :visible="showMoreContextMenuVisible"
          @hide="onShowMoreHide"
          @tab-click="onClickShowMoreContextMenuItem"
        >
          <div :style="{ ...styles.default }" class="nav-tabs-suffix">
            <el-tooltip :content="t('components.file.editor.sidebar.showMore')">
              <span class="action-icon" @click.prevent="onShowMoreShow">
                <div class="background" />
                <cl-icon :icon="['fa', 'angle-down']" />
              </span>
            </el-tooltip>
          </div>
        </cl-file-editor-nav-tabs-show-more-context-menu>
      </template>
    </div>
  </div>

  <cl-file-editor-settings-dialog />
  <cl-file-editor-create-with-ai-dialog @create="onCreateWithAi" />
</template>

<style lang="scss" scoped>
.file-editor {
  height: 100%;
  display: flex;

  .file-editor-content {
    position: relative;
    flex: 1;
    display: flex;
    min-width: calc(100% - var(--cl-file-editor-nav-menu-width));
    flex-direction: column;

    .editor {
      flex: 1;

      &.hidden {
        position: fixed;
        top: -100vh;
        left: 0;
        height: 100vh;
      }
    }

    .empty-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-tabs-suffix {
      width: 30px;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--cl-file-editor-nav-tabs-height);
    }
  }

  .action-icon {
    position: relative;
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      .background {
        background-color: var(--cl-file-editor-mask-bg);
        border-radius: 8px;
      }
    }

    &.expand-files {
      width: 29px;
      text-align: center;
    }

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
