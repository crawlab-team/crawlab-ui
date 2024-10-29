<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  FILE_ROOT,
  FILE_UPLOAD_MODE_DIR,
  FILE_UPLOAD_MODE_FILES,
} from '@/constants/file';
import { ElTreeSelect, ElUpload, UploadFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { translate } from '@/utils';

const props = defineProps<{
  mode: FileUploadMode;
  targetDirectory: string;
  directoryOptions?: SelectOption[];
  uploadInfo?: FileUploadInfo;
}>();
const emit = defineEmits<{
  (e: 'mode-change', mode: FileUploadMode): void;
  (e: 'directory-change', dir: string): void;
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

const t = translate;

const fileInput = ref<HTMLInputElement>();

const resetFileInput = () => {
  // reset file input value when mode change
  if (fileInput.value?.files?.length) {
    fileInput.value.value = '';
  }
};
watch(() => props.uploadInfo, resetFileInput);

const internalMode = ref<FileUploadMode>(props.mode);
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

const internalDirectory = ref<string>(props.targetDirectory);
watch(
  () => props.targetDirectory,
  value => {
    internalDirectory.value = value;
  }
);

const uploadRef = ref<typeof ElUpload>();

const onFileChange = (_: UploadFile, fileList: UploadFile[]) => {
  emit(
    'files-change',
    fileList.map(f => f.raw as FileWithPath)
  );
};

const onDirFilesChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || [])
    .filter(f => {
      return !IGNORE_FILE_PATTERN.some(p =>
        new RegExp(p).test(f.webkitRelativePath || '')
      );
    })
    .map((f: FileWithPath) => {
      f.path = f.webkitRelativePath;
      return f as FileWithPath;
    });
  if (!files) return;
  emit('files-change', files);
};

const onClickUploadDir = () => {
  fileInput.value?.click();
};

const uploadFilesTree = computed<TreeNode[]>(() => {
  if (!props.uploadInfo?.filePaths) return [];

  const buildTree = (paths: string[]): TreeNode[] => {
    const rootNodes: TreeNode[] = [];
    const nodeMap = new Map<string, TreeNode>();
    const fileCountMap = new Map<string, number>();

    // First pass - count files in each folder
    paths.forEach(p => {
      const parts = p.split('/').filter(Boolean);
      if (parts.length === 0) return;

      let currentPath = '';
      parts.forEach((_, index) => {
        const parentPath = currentPath;
        currentPath = parentPath
          ? `${parentPath}/${parts[index]}`
          : `/${parts[index]}`;

        if (index < parts.length - 1) {
          // It's a folder
          fileCountMap.set(
            currentPath,
            (fileCountMap.get(currentPath) || 0) + 1
          );
        }
      });
    });

    // Second pass - build tree with file counts
    paths.forEach(p => {
      const parts = p.split('/').filter(Boolean);
      if (parts.length === 0) return;

      let currentPath = '';
      parts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = parentPath ? `${parentPath}/${part}` : `/${part}`;

        if (!nodeMap.has(currentPath)) {
          const fileCount = fileCountMap.get(currentPath);
          const node: TreeNode = {
            value: currentPath,
            label: fileCount ? `${part} (${fileCount})` : part,
            children: [],
          };
          nodeMap.set(currentPath, node);

          if (index === 0) {
            rootNodes.push(node);
          } else {
            const parentNode = nodeMap.get(parentPath);
            parentNode?.children?.push(node);
          }
        }
      });
    });

    return rootNodes;
  };

  return buildTree(props.uploadInfo.filePaths);
});

defineOptions({ name: 'ClFileUpload' });
</script>

<template>
  <div class="file-upload">
    <cl-form label-width="150px">
      <cl-form-item
        prop="mode"
        :span="4"
        :label="t('components.file.upload.form.mode')"
      >
        <el-radio-group
          v-model="internalMode"
          @change="(value: FileUploadMode) => emit('mode-change', value)"
        >
          <el-radio
            v-for="{ value, label } in modeOptions"
            :key="value"
            :value="value"
            :class="value"
          >
            {{ label }}
          </el-radio>
        </el-radio-group>
      </cl-form-item>

      <cl-form-item
        prop="targetDirectory"
        :span="4"
        :label="t('components.file.upload.form.targetDirectory')"
      >
        <el-tree-select
          v-model="internalDirectory"
          :data="directoryOptions"
          check-strictly
          :default-expanded-keys="[FILE_ROOT]"
          :render-after-expand="false"
          clearable
          filterable
          @change="(value: string) => emit('directory-change', value)"
          @clear="internalDirectory = FILE_ROOT"
        >
          <template #label="{ value, label }">
            <span v-if="value === FILE_ROOT">
              {{ label }}
            </span>
            <span v-else>
              {{ value }}
            </span>
          </template>
        </el-tree-select>
      </cl-form-item>

      <cl-form-item :span="4">
        <template v-if="mode === FILE_UPLOAD_MODE_DIR">
          <div class="folder-upload-action-wrapper">
            <cl-button
              size="large"
              class-name="file-upload-action"
              @click="onClickUploadDir"
            >
              <i class="fa fa-folder"></i>
              {{
                t(
                  'components.file.upload.buttons.folder.clickToSelectFolderToUpload'
                )
              }}
            </cl-button>
          </div>
          <input
            v-show="false"
            ref="fileInput"
            type="file"
            webkitdirectory
            multiple
            @change="onDirFilesChange"
          />
        </template>
        <template v-else-if="mode === FILE_UPLOAD_MODE_FILES">
          <el-upload
            ref="uploadRef"
            class="file-upload-action-wrapper"
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
              <em>{{
                t('components.file.upload.buttons.files.clickToUpload')
              }}</em>
            </div>
          </el-upload>
        </template>
      </cl-form-item>
      <cl-form-item :span="4">
        <div v-if="uploadFilesTree.length > 0" class="file-upload-tree">
          <h4 class="title">
            {{ t('components.file.upload.fileList.title') }}
          </h4>
          <div class="file-upload-tree-container">
            <el-scrollbar>
              <el-tree :data="uploadFilesTree" default-expand-all>
                <template #default="{ data }">
                  <div class="tree-node">
                    <cl-atom-material-icon
                      :is-dir="data.children?.length > 0"
                      :name="data.label"
                    />
                    <span class="label">{{ data.label }}</span>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style scoped>
.file-upload {
  &:deep(.el-upload),
  &:deep(.el-upload .el-upload-dragger),
  &:deep(.file-upload-tree),
  &:deep(.file-upload-action-wrapper),
  &:deep(.file-upload-tree .el-tree) {
    width: 100%;
  }

  &:deep(.file-upload-tree .file-upload-tree-container) {
    max-height: 300px;
    overflow: auto;
    border: 1px solid var(--el-border-color);
  }

  &:deep(.file-upload-tree .file-upload-tree-container .tree-node) {
    display: flex;
    align-items: center;

    .atom-material-icon {
      height: 100%;
      width: 20px;
      display: inline-flex;
      align-items: center;
    }
  }

  &:deep(.file-upload-tree .title) {
    margin: 0 0;
  }
}
</style>
