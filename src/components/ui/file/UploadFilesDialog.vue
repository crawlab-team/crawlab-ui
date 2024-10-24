<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { getOSPathSeparator, translate } from '@/utils';
import { getRootDirectoryOptions } from '@/utils/file';
import { FILE_ROOT, FILE_UPLOAD_MODE_DIR } from '@/constants';

const props = defineProps<{
  ns: ListStoreNamespace;
  activeDialogKey?: DialogKey;
  activeId: string;
  form: BaseModel;
  services: FileServices<BaseModel>;
  fileNavItems: FileNavItem[];
  defaultTargetDirectory?: string;
}>();

// i18n
const t = translate;

// store
const store = useStore();

const files = ref<FileWithPath[]>([]);

const mode = ref<FileUploadMode>(FILE_UPLOAD_MODE_DIR);

const targetDirectory = ref<string>(props.defaultTargetDirectory || FILE_ROOT);
watch(
  () => props.defaultTargetDirectory,
  value => {
    targetDirectory.value = value || FILE_ROOT;
  }
);

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

const directoryOptions = computed(() =>
  getRootDirectoryOptions(props.fileNavItems)
);

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
    }),
    targetDirectory.value
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
    await uploadFiles();
    ElMessage.success(t('common.message.success.upload'));
  } catch (e: any) {
    ElMessage.error(e);
  } finally {
    confirmLoading.value = false;
    store.commit(`${ns}/hideDialog`);
  }
};

const onFilesChange = (fileList: FileWithPath[]) => {
  if (!fileList.length) return;
  files.value = fileList;
};

const onTargetDirectoryChange = (dir: string) => {
  targetDirectory.value = dir;
};

const title = computed(() => {
  return (
    t('components.file.upload.title') + (name.value ? `: ${name.value}` : '')
  );
});

watch(fileUploadVisible, () => {
  if (!fileUploadVisible.value) {
    files.value = [];
  }
});

onBeforeUnmount(() => {
  const { ns } = props;
  targetDirectory.value = FILE_ROOT;
  store.commit(`${ns}/hideDialog`);
});
defineOptions({ name: 'ClUploadFilesDialog' });
</script>

<template>
  <cl-dialog
    :visible="fileUploadVisible"
    class-name="upload-files-dialog"
    :title="title"
    :confirm-loading="confirmLoading"
    :confirm-disabled="confirmDisabled"
    @close="onUploadClose"
    @confirm="onUploadConfirm"
  >
    <cl-file-upload
      :mode="mode"
      :target-directory="targetDirectory"
      :directory-options="directoryOptions"
      :upload-info="uploadInfo"
      @mode-change="(value: FileUploadMode) => (mode = value)"
      @directory-change="onTargetDirectoryChange"
      @files-change="onFilesChange"
    />
  </cl-dialog>
</template>


