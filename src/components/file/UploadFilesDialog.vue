<script setup lang="ts">
defineOptions({ name: 'ClUploadFilesDialog' });
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { sendEvent } from '@/admin/umeng';
import { getOSPathSeparator } from '@/utils';
import { FILE_UPLOAD_MODE_DIR } from '@/constants';
import FileUpload from '@/components/file/FileUpload.vue';
import { FileWithPath } from '@/components/file/file';

const props = defineProps<{
  ns: ListStoreNamespace;
  activeDialogKey?: DialogKey;
  activeId: string;
  form: BaseModel;
  services: FileServices<BaseModel>;
}>();

// i18n
const { t } = useI18n();

// store
const store = useStore();

const files = ref<FileWithPath[]>([]);

const mode = ref<FileUploadMode>(FILE_UPLOAD_MODE_DIR);

const fileUploadRef = ref<typeof FileUpload>();

const fileUploadVisible = computed(
  () => props.activeDialogKey === 'uploadFiles'
);

const name = computed(() => props.form?.name);

const confirmLoading = ref<boolean>(false);
const confirmDisabled = computed<boolean>(() => !files.value.length);

const isDetail = computed<boolean>(() => !!props.activeId);

const { listRootDir, saveFilesBinary } = props.services;

const id = computed<string>(() => {
  const { activeId, form } = props;
  if (isDetail.value) {
    return activeId;
  } else {
    return form?._id as string;
  }
});

const hasMultiDir = computed<boolean>(() => {
  if (!files.value) return false;
  const set = new Set<string>();
  for (const f of files.value) {
    const lv1 = f?.path?.split(getOSPathSeparator())[0] as string;
    if (!set.has(lv1)) {
      set.add(lv1);
    }
    if (set.size > 1) {
      return true;
    }
  }
  return false;
});

const uploadInfo = computed(() => {
  const info = {
    fileCount: files.value.length,
    filePaths: files.value.map(f => f.path || f.name),
  } as FileUploadInfo;
  if (mode.value === FILE_UPLOAD_MODE_DIR) {
    const f = files.value[0];
    info.dirName = f?.path?.split(getOSPathSeparator())[0];
  }
  return info;
});

const getFilePath = (f: FileWithPath): string => {
  const path = f.path;
  if (!path) return f.name;
  if (hasMultiDir.value) {
    return path;
  } else {
    return path
      .split(getOSPathSeparator())
      .filter((_: any, i: number) => i > 0)
      .join(getOSPathSeparator());
  }
};

const uploadFiles = async () => {
  if (!files.value) return;
  await saveFilesBinary(
    id.value,
    files.value.map((f: FileWithPath) => {
      return { path: getFilePath(f) as string, file: f as File };
    })
  );
  await listRootDir(id.value);
};

const onUploadClose = () => {
  const { ns } = props;
  store.commit(`${ns}/hideDialog`);
};

const onUploadConfirm = async () => {
  const { ns } = props;
  confirmLoading.value = true;
  try {
    sendEvent('click_spider_detail_actions_upload_confirm');

    await uploadFiles();
    await ElMessage.success(t('common.message.success.upload'));
  } catch (e: any) {
    await ElMessage.error(e);
  } finally {
    confirmLoading.value = false;
    store.commit(`${ns}/hideDialog`);
  }
};

const onFilesChange = (fileList: FileWithPath[]) => {
  if (!fileList.length) return;
  files.value = fileList;

  sendEvent('click_spider_detail_actions_files_change');
};

const title = computed(() => {
  return (
    t('components.file.upload.title') + (name.value ? ` - ${name.value}` : '')
  );
});

watch(fileUploadVisible, () => {
  if (!fileUploadVisible.value) {
    files.value = [];
  }
});

onBeforeUnmount(() => {
  const { ns } = props;
  store.commit(`${ns}/hideDialog`);
});
</script>

<template>
  <cl-dialog
    :visible="fileUploadVisible"
    :title="title"
    :confirm-loading="confirmLoading"
    :confirm-disabled="confirmDisabled"
    @close="onUploadClose"
    @confirm="onUploadConfirm"
  >
    <cl-file-upload
      ref="fileUploadRef"
      :mode="mode"
      :upload-info="uploadInfo"
      @mode-change="(value: FileUploadMode) => (mode = value)"
      @files-change="onFilesChange"
    />
  </cl-dialog>
</template>

<style lang="scss" scoped></style>
