<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce, translate } from '@/utils';
import useGitService from '@/services/git/gitService';
import { useGitDetail } from '@/views';
import { ElMessage, ElMessageBox } from 'element-plus';

const t = translate;

// store
const nsGit = 'git';
const nsSpider = 'spider';
const store = useStore();
const { git: state } = store.state as RootStoreState;

const { activeId, currentBranch, fileContent } = useGitDetail();

const spidersDict = inject<{ [key: string]: Spider }>('spiders-dict');

const navMenuLoading = ref(false);

const getFiles = debounce(async () => {
  if (!activeId.value) return;
  navMenuLoading.value = true;
  try {
    await store.dispatch(`${nsGit}/listDir`, { id: activeId.value });
  } finally {
    navMenuLoading.value = false;
  }
});
watch(currentBranch, getFiles);
watch(activeId, getFiles);

const onFileChange = async () => {
  await store.dispatch(`${nsGit}/getChanges`, { id: activeId.value });
};

const onCreateSpider = async (item: FileNavItem) => {
  await store.dispatch(`${nsGit}/clickCreateSpider`, item);
};

const onDeleteSpider = async (item: FileNavItem) => {
  const spider = spidersDict?.value?.[item.path!];
  if (!spider) return;
  await ElMessageBox.confirm(
    t('common.messageBox.confirm.delete'),
    t('common.actions.delete'),
    {
      type: 'warning',
      confirmButtonClass: 'el-button--danger delete-confirm-btn',
    }
  );
  await store.dispatch(`${nsSpider}/deleteById`, spider._id);
  ElMessage.success(t('common.message.success.delete'));
  await store.dispatch(`${nsSpider}/getAllList`, { id: activeId.value });
};

defineOptions({ name: 'ClGitDetailTabFiles' });
</script>

<template>
  <cl-file-tab
    :ns="nsGit"
    :active-id="activeId"
    :content="fileContent"
    :nav-items="state.fileNavItems"
    :active-nav-item="state.activeFileNavItem"
    :services="useGitService(store)"
    :default-file-paths="state.defaultFilePaths"
    :nav-menu-loading="navMenuLoading"
    @file-change="onFileChange"
    @create-spider="onCreateSpider"
    @delete-spider="onDeleteSpider"
  />
</template>
