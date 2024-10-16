<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { downloadData, translate } from '@/utils';

const props = defineProps<{
  ns: ListStoreNamespace;
  activeId: string;
}>();

// i18n
const t = translate;

// store
const store = useStore();

const onClickUpload = () => {
  const { ns } = props;
  store.commit(`${ns}/showDialog`, 'uploadFiles');
};

const onOpenFilesSettings = () => {
  store.commit(`file/setEditorSettingsDialogVisible`, true);
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
};
defineOptions({ name: 'ClFileActions' });
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
