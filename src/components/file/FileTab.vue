<script setup lang="ts">
defineOptions({ name: 'ClFileTab' });
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { FileNavItem } from '@/components/file/file';

const props = defineProps<{
  ns: ListStoreNamespace;
  activeId: string;
  content: string;
  navItems: FileNavItem[];
  activeNavItem?: FileNavItem;
  services: FileServices<BaseModel>;
  defaultFilePaths: string[];
  navMenuLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'file-change', value: string): void;
}>();

// i18n
const { t } = useI18n();

// store
const store = useStore();

const {
  listRootDir,
  getFile,
  getFileInfo,
  saveFile,
  saveFileBinary,
  saveDir,
  renameFile,
  deleteFile,
  copyFile,
} = props.services;

// file editor
const fileEditor = ref();

// os path sep (server side)
const pathSep = '/';

const isRoot = (item: FileNavItem): boolean => {
  return item.path === '~';
};

const getDirPath = (path: string): string => {
  const arr = path?.split(pathSep) as string[];
  arr.splice(arr.length - 1, 1);
  return arr.join(pathSep);
};

const getPath = (item: FileNavItem, name: string): string => {
  let path;
  if (item.is_dir) {
    if (isRoot(item)) {
      path = `${pathSep}${name}`;
    } else {
      const itemDirPath = item.path || '';
      path = `${itemDirPath}${pathSep}${name}`;
    }
  } else {
    const dirPath = getDirPath(item.path as string);
    path = `${dirPath}${pathSep}${name}`;
  }
  return path;
};

const openFile = async (path: string) => {
  const { activeId, content } = props;
  const res = await getFileInfo(activeId, path);
  if (!res.data) return;
  const item = res.data;
  await getFile(activeId, path);
  fileEditor.value?.updateTabs?.(item);
  fileEditor.value?.updateContentCache?.(item, content);
};

const onSaveFile = async (item: FileNavItem) => {
  const { activeId, content } = props;
  if (!item.path) return;
  await saveFile(activeId, item.path, content);
  emit('file-change', item.path as string);
  ElMessage.success(t('common.message.success.save'));
};

const onNavItemDbClick = async (item: FileNavItem) => {
  await openFile(item.path as string);
};

const onNavItemDrop = async (
  draggingItem: FileNavItem,
  dropItem: FileNavItem
) => {
  const { activeId } = props;
  const dirPath = dropItem.path !== '~' ? dropItem.path : '';
  const newPath = `${dirPath}${pathSep}${draggingItem.name}`;
  await renameFile(activeId, draggingItem.path as string, newPath);
  emit('file-change', newPath);
  await listRootDir(activeId);
};

const onContextMenuNewFile = async (item: FileNavItem, name: string) => {
  const { activeId } = props;
  if (!item.path) return;
  const path = getPath(item, name);
  await saveFile(activeId, path, '');
  emit('file-change', path);
  await listRootDir(activeId);
  await openFile(path);
};

const onContextMenuNewFileWithAi = async (item: FileNavItem) => {
  store.commit('file/setEditorFileNavItem', item);
  store.commit(`file/setEditorCreateWithAiDialogVisible`, true);
};

const onContextMenuNewDirectory = async (item: FileNavItem, name: string) => {
  const { activeId } = props;
  if (!item.path) return;
  const path = getPath(item, name);
  await saveDir(activeId, path);
  emit('file-change', item.path);
  await listRootDir(activeId);
};

const onContextMenuRename = async (item: FileNavItem, name: string) => {
  const { activeId } = props;
  if (!item.path) return;
  const path = getPath(item, name);
  await renameFile(activeId, item.path, path);
  emit('file-change', item.path);
  await listRootDir(activeId);
};

const onContextMenuClone = async (item: FileNavItem, name: string) => {
  const { activeId } = props;
  if (!item.path) return;
  const dirPath = getDirPath(item.path);
  const path = `${dirPath}${pathSep}${name}`;
  await copyFile(activeId, item.path, path);
  emit('file-change', item.path);
  await listRootDir(activeId);
};

const onContextMenuDelete = async (item: FileNavItem) => {
  const { activeId } = props;
  if (!item.path) return;
  await deleteFile(activeId, item.path);
  emit('file-change', item.path);
  await listRootDir(activeId);
};

const onContentChange = (value: string) => {
  const { ns } = props;
  store.commit(`${ns}/setFileContent`, value);
};

const onDropFiles = async (files: InputFile[]) => {
  const { activeId } = props;
  await Promise.all(
    files.map(f => {
      return saveFileBinary(activeId, f.path as string, f as File);
    })
  );
  await listRootDir(activeId);
};

const onCreateWithAi = async (
  name: string,
  sourceCode: string,
  item?: FileNavItem
) => {
  const { activeId } = props;
  let path = `${pathSep}${name}`;
  if (item) {
    path = getPath(item, name);
  }
  await saveFile(activeId, path, sourceCode);
  emit('file-change', path);
  await listRootDir(activeId);
  await openFile(path);
};

const onTabClick = async (tab: FileNavItem) => {
  const { activeId } = props;
  await getFile(activeId, tab.path as string);
};

const getData = async () => {
  const { activeId, defaultFilePaths } = props;
  await listRootDir(activeId);

  if (defaultFilePaths?.length > 0) {
    defaultExpandedKeys.value = defaultFilePaths as string[];
  }
};

const defaultExpandedKeys = ref<string[]>([]);

// get data before mount
onBeforeMount(getData);

// get data when id changes
watch(() => props.activeId, getData);

onBeforeUnmount(() => {
  const { ns } = props;
  store.commit(`${ns}/resetFileContent`);
  store.commit(`${ns}/resetDefaultFilePaths`);
  store.commit(`${ns}/resetFileNavItems`);
});
</script>

<template>
  <cl-file-editor
    ref="fileEditor"
    :ns="ns"
    :nav-items="navItems"
    :active-nav-item="activeNavItem"
    :default-expanded-keys="defaultExpandedKeys"
    :content="content"
    :nav-menu-loading="navMenuLoading"
    @content-change="onContentChange"
    @save-file="onSaveFile"
    @node-db-click="onNavItemDbClick"
    @node-drop="onNavItemDrop"
    @ctx-menu-new-file="onContextMenuNewFile"
    @ctx-menu-new-file-with-ai="onContextMenuNewFileWithAi"
    @ctx-menu-new-directory="onContextMenuNewDirectory"
    @ctx-menu-rename="onContextMenuRename"
    @ctx-menu-clone="onContextMenuClone"
    @ctx-menu-delete="onContextMenuDelete"
    @drop-files="onDropFiles"
    @create-with-ai="onCreateWithAi"
    @tab-click="onTabClick"
  />
</template>

<style lang="scss" scoped></style>
