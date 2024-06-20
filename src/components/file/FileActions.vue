<script setup lang="ts">
defineOptions({ name: 'ClFileActions' });
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { sendEvent } from '@/admin/umeng';
import { downloadData } from '@/utils';

const props = defineProps<{
  ns: ListStoreNamespace;
  activeId: string;
}>();

// i18n
const { t } = useI18n();

// store
const store = useStore();
const { common: commonState } = store.state as RootStoreState;

const systemInfo = computed<SystemInfo>(() => commonState.systemInfo || {});

const onClickUpload = () => {
  const { ns } = props;
  store.commit(`${ns}/showDialog`, 'uploadFiles');

  sendEvent('click_detail_actions_upload');
};

const onOpenFilesSettings = () => {
  store.commit(`file/setEditorSettingsDialogVisible`, true);

  sendEvent('click_detail_actions_files_settings');
};

const onOpenCreateWithAi = async () => {
  store.commit('file/resetEditorFileNavItem');
  store.commit(`file/setEditorCreateWithAiDialogVisible`, true);
};

const exportLoading = ref(false);
const onClickExport = async () => {
  const { ns, activeId } = props;
  exportLoading.value = true;
  try {
    const dataDownload = await store.dispatch(`${ns}/exportFiles`, {
      id: activeId,
    });
    downloadData(dataDownload, `${activeId}.zip`, 'zip');
  } finally {
    exportLoading.value = false;
  }
  sendEvent('click_detail_actions_files_export');
};
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'laptop-code']"
      :tooltip="t('components.file.actions.tooltip.fileEditorActions')"
    />
    <cl-nav-action-item>
      <cl-fa-icon-button
        :icon="['fa', 'upload']"
        :tooltip="t('components.file.actions.tooltip.uploadFiles')"
        type="primary"
        id="upload-btn"
        class-name="upload-btn"
        @click="onClickUpload"
      />
      <cl-fa-icon-button
        :spin="exportLoading"
        :disabled="exportLoading"
        :icon="['fa', exportLoading ? 'spinner' : 'download']"
        :tooltip="t('components.file.actions.tooltip.export')"
        type="success"
        id="export-btn"
        class-name="export-btn"
        @click="onClickExport"
      />
      <cl-fa-icon-button
        :icon="['fa', 'cog']"
        :tooltip="t('components.file.actions.tooltip.fileEditorSettings')"
        type="info"
        id="open-settings-btn"
        class-name="open-settings-btn"
        @click="onOpenFilesSettings"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style lang="scss" scoped></style>
