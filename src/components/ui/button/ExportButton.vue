<script setup lang="tsx">
import { ref } from 'vue';
import {
  ElMessageBox,
  ElNotification,
  type NotificationHandle,
} from 'element-plus';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { downloadData, translate } from '@/utils';
import useExportService from '@/services/export/exportService';
import ClExportForm from '@/components/ui/export/ExportForm.vue';
import type { FaIconButtonProps } from './types';

const t = translate;

const props = withDefaults(
  defineProps<
    {
      target: string | (() => string);
      conditions?: FilterConditionData[] | (() => FilterConditionData[]);
      dbId?: string;
      buttonType?: 'fa-icon' | 'label';
      icon?: Icon;
      label?: string;
      tooltip?: string;
    } & Omit<FaIconButtonProps, 'icon'>
  >(),
  {
    buttonType: 'fa-icon',
    icon: () => ['fa', 'file-export'] as Icon,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'success'): void;
  (e: 'error', error: Error): void;
}>();

const { postExport, getExport, getExportDownload } = useExportService();
const exportType = ref<ExportType>('csv');
const notifications = new Map<string, NotificationHandle>();
const exportCache = new Map<string, Export>();

const resolveValue = <T,>(value: T | (() => T)): T =>
  typeof value === 'function' ? (value as Function)() : value;

const handleExport = async () => {
  const target = resolveValue(props.target);
  try {
    emit('click');

    await ElMessageBox({
      title: t('common.actions.export'),
      message: (
        <ClExportForm
          target={target}
          defaultType={exportType.value}
          onExportTypeChange={(value: ExportType) => {
            exportType.value = value;
          }}
        />
      ),
      boxType: 'prompt',
      showCancelButton: true,
      confirmButtonText: t('common.actions.exportData'),
      cancelButtonText: t('common.actions.cancel'),
      customClass: 'export-form-box',
    });

    const res = await postExport(
      exportType.value,
      resolveValue(props.target),
      resolveValue(props.conditions) || [],
      props.dbId
    );

    const exportId = res.data;
    if (!exportId) return;

    exportCache.set(exportId, {
      id: exportId,
      status: 'running',
      type: exportType.value,
    });

    const notification = ElNotification({
      title: t('components.export.status.exporting'),
      message: (
        <div class="export-notification">
          <FontAwesomeIcon class="fa-spin" icon={['fa', 'spinner']} />
          <span>{t(`components.export.exporting.${exportType.value}`)}</span>
        </div>
      ),
      duration: 0,
      showClose: false,
    });

    notifications.set(exportId, notification);
    await pollExportStatus(exportId);
  } catch (error) {
    emit('error', error as Error);
    console.error(error);
  }
};

const pollExportStatus = async (exportId: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const exp = exportCache.get(exportId) || { status: 'running' };
  if (exp.status !== 'running') return;

  const { data } = await getExport(exp.type!, exportId, props.dbId);
  exportCache.set(exportId, data);

  if (data.status === 'running') {
    await pollExportStatus(exportId);
  } else {
    const notification = notifications.get(exportId);
    const dataDownload = await getExportDownload(
      exportType.value,
      exportId,
      props.dbId
    );

    downloadData(dataDownload, data.file_name!, exportType.value);
    notification?.close();
    emit('success');
  }
};

defineOptions({ name: 'ClExportButton' });
</script>

<template>
  <cl-fa-icon-button
    v-if="buttonType === 'fa-icon'"
    v-bind="$props"
    :icon="icon"
    :tooltip="tooltip"
    @click="handleExport"
  />
  <cl-label-button
    v-else
    v-bind="$props"
    :icon="icon"
    :label="label"
    :tooltip="tooltip"
    @click="handleExport"
  />
</template>

<style>
.export-notification {
  display: flex;
  align-items: center;
  gap: 8px;
}

.export-form-box {
  .el-message-box__message {
    width: 100%;
  }
}
</style>
