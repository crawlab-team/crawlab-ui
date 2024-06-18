<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { FILE_UPLOAD_MODE_DIR, FILE_UPLOAD_MODE_FILES } from '@/constants/file';
import { ElUpload, UploadFile, UploadRawFile } from 'element-plus';
import { plainClone } from '@/utils/object';
import { useI18n } from 'vue-i18n';
import { UploadFilled } from '@element-plus/icons-vue';
import { sendEvent } from '@/admin/umeng';
import { FileWithPath } from 'file-selector';

const props = defineProps<{
  mode: FileUploadMode;
  uploadInfo?: FileUploadInfo;
}>();
const emit = defineEmits<{
  (e: 'mode-change', mode: string): void;
  (e: 'files-change', files: (FileWithPath | undefined)[]): void;
}>();

const IGNORE_FILE_PATTERN = [
  'node_modules',
  '__pycache__',
  '\.pyc',
  '\.DS_Store',
  '\.git',
  '\.idea',
  '\.vscode',
  '\.vs',
  '\.nuxt',
];

const { t } = useI18n();

const fileInput = ref<HTMLInputElement>();

const modeOptions = computed<FileUploadModeOption[]>(() => [
  {
    label: t('components.file.upload.mode.folder'),
    value: FILE_UPLOAD_MODE_DIR,
  },
  {
    label: t('components.file.upload.mode.files'),
    value: FILE_UPLOAD_MODE_FILES,
  },
]);
const internalMode = ref<string>();

const uploadRef = ref<typeof ElUpload>();

watch(
  () => props.mode,
  () => {
    internalMode.value = props.mode;
  },
);

const onFileChange = (file: UploadFile, fileList: UploadFile[]) => {
  emit(
    'files-change',
    fileList.map(f => f.raw as FileWithPath),
  );
};

const onDirFilesChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || [])
    .filter(f => {
      return !IGNORE_FILE_PATTERN.some(p => new RegExp(p).test(f.webkitRelativePath || ''));
    })
    .map((f: any) => {
      f.path = f.webkitRelativePath;
      return f as FileWithPath;
    });
  if (!files) return;
  emit(
    'files-change',
    files,
  );
};

const onModeChange = (mode: string) => {
  emit('mode-change', mode);

  sendEvent('click_file_upload_mode_change', { mode });
};

onBeforeMount(() => {
  const { mode } = props;
  internalMode.value = mode;
});

const onClickUploadDir = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="file-upload">
    <div class="mode-select">
      <el-radio-group v-model="internalMode" @change="onModeChange">
        <el-radio
          v-for="{ value, label } in modeOptions"
          :key="value"
          :label="value"
          :class="value"
        >
          {{ label }}
        </el-radio>
      </el-radio-group>
    </div>

    <template v-if="mode === FILE_UPLOAD_MODE_FILES">
      <el-upload
        ref="uploadRef"
        class="file-upload-action"
        :on-change="onFileChange"
        :http-request="async () => {}"
        drag
        multiple
        :show-file-list="false"
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          {{ t('components.file.upload.buttons.files.dragFilesHereOr') }}
          <em>{{ t('components.file.upload.buttons.files.clickToUpload') }}</em>
        </div>
      </el-upload>
      <!--      <input ref="fileInput" multiple>-->
    </template>
    <template v-else-if="mode === FILE_UPLOAD_MODE_DIR">
      <div class="folder-upload-action-wrapper">
        <cl-button size="large" class-name="file-upload-action" @click="onClickUploadDir">
          <i class="fa fa-folder"></i>
          {{
            t(
              'components.file.upload.buttons.folder.clickToSelectFolderToUpload',
            )
          }}
        </cl-button>
        <template v-if="!!uploadInfo?.dirName && uploadInfo?.fileCount">
          <cl-tag
            type="primary"
            class="info-tag"
            :label="uploadInfo?.dirName"
            :icon="['fa', 'folder']"
            :tooltip="t('components.file.upload.tooltip.fileName')"
          />
          <cl-tag
            type="success"
            class="info-tag"
            :label="uploadInfo?.fileCount"
            :icon="['fa', 'hashtag']"
            :tooltip="t('components.file.upload.tooltip.filesCount')"
          />
        </template>
      </div>
      <input v-show="false" ref="fileInput" type="file" webkitdirectory multiple @change="onDirFilesChange">
    </template>
    <div v-if="uploadInfo?.filePaths?.length" class="file-list-wrapper">
      <h4 class="title">
        {{ t('components.file.upload.fileList.title') }}
      </h4>
      <ul class="file-list">
        <li
          v-for="(path, $index) in uploadInfo?.filePaths"
          :key="$index"
          class="file-item"
        >
          {{ path }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-upload {
  .mode-select {
    margin-bottom: 20px;
  }

  .el-upload {
    width: 100%;
  }

  .folder-upload {
    display: flex;
    align-items: center;
  }

  .file-list-wrapper {
    .title {
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .file-list {
      list-style: none;
      max-height: 400px;
      overflow: auto;
      border: 1px solid var(--cl-info-plain-color);
      padding: 10px;
      margin-top: 10px;

      .file-item {
      }
    }
  }
}
</style>

<style scoped>
.file-upload:deep(.el-upload),
.file-upload:deep(.el-upload .el-upload-dragger) {
  width: 100%;
}

.file-upload:deep(.folder-upload .info-tag) {
  margin-left: 10px;
}
</style>
