<script setup lang="ts">
import { Delete, Plus } from '@element-plus/icons-vue';
import { computed, onBeforeMount, ref } from 'vue';
import { ElMessage, UploadFile, UploadInstance } from 'element-plus';
import { useStore } from 'vuex';
import { translate, arrayBufferToBase64 } from '@/utils';
import { ClForm } from '@/components';

const t = translate;

const ns = 'system';
const store = useStore();
const { system: state } = store.state as RootStoreState;

const key = 'customize';

const formRef = ref<typeof ClForm>();

const form = computed<Setting<SettingCustomize>>({
  get: () => state.settings[key],
  set: value => {
    store.commit(`${ns}/setSetting`, { key, value });
  },
});
onBeforeMount(async () => {
  await store.dispatch(`${ns}/getSetting`, { key });
});
const customLogoUploadRef = ref<UploadInstance>();
const onUploadCustomLogo = async (uploadFile: UploadFile) => {
  const fileBuffer = await uploadFile.raw?.arrayBuffer();
  if (!fileBuffer) return;

  // file size
  const fileSize = fileBuffer.byteLength;
  if (fileSize > 1024 * 1024) {
    ElMessage.error(
      t('views.system.customize.uploadLogoErrors.fileSizeExceeded')
    );
    return;
  }

  // mime type
  let mimeType = uploadFile.raw?.type;

  if (mimeType && !mimeType.startsWith('image/')) {
    ElMessage.error(
      t('views.system.customize.uploadLogoErrors.invalidFileType')
    );
    return;
  }

  // base64
  let base64 = arrayBufferToBase64(fileBuffer);

  // data url
  form.value.value.custom_logo = `data:${mimeType};base64,${base64}`;

  await save();
};
const onCustomLogoRemove = async () => {
  customLogoUploadRef.value?.clearFiles();
  form.value.value.custom_logo = '';
};

const save = async () => {
  await formRef.value?.validate();
  await store.dispatch(`${ns}/saveSetting`, { key, value: form.value });
  ElMessage.success(t('common.message.success.save'));
};

const onSave = async () => {
  await save();
};

defineExpose({
  save,
});

defineOptions({ name: 'ClSystemDetailTabCustomize' });
</script>

<template>
  <cl-form v-if="form?.value" ref="formRef" :model="form.value" label-width="200px">
    <cl-form-item
      :span="4"
      :label="t('views.system.customize.showCustomTitle')"
      prop="show_custom_title"
    >
      <cl-switch v-model="form.value.show_custom_title" @change="onSave" />
    </cl-form-item>
    <cl-form-item
      :span="4"
      :label="t('views.system.customize.customTitle')"
      prop="custom_title"
      :required="form.value.show_custom_title"
    >
      <el-input
        v-model="form.value.custom_title"
        :disabled="!form.value.show_custom_title"
        :placeholder="t('views.system.customize.customTitle')"
      />
    </cl-form-item>

    <el-divider />

    <cl-form-item
      :span="4"
      :label="t('views.system.customize.showCustomLogo')"
      prop="show_custom_logo"
    >
      <cl-switch v-model="form.value.show_custom_logo" @change="onSave" />
    </cl-form-item>
    <cl-form-item
      :span="4"
      :label="t('views.system.customize.customLogo')"
      prop="custom_logo"
      :required="form.value.show_custom_logo"
    >
      <div
        class="site-logo"
        :class="!form.value.show_custom_logo ? 'disabled' : ''"
      >
        <el-upload
          ref="customLogoUploadRef"
          :auto-upload="false"
          :show-file-list="false"
          :disabled="!form.value.show_custom_logo"
          :on-change="onUploadCustomLogo"
          :on-remove="
            async () => {
              form.value.custom_logo = '';
              await save();
            }
          "
        >
          <div v-if="form.value.custom_logo" class="site-logo-img-wrapper">
            <img
              :src="form.value.custom_logo"
              class="site-logo-img"
              alt="logo"
            />
            <div class="actions">
              <el-icon class="remove-button" @click.stop="onCustomLogoRemove">
                <Delete />
              </el-icon>
            </div>
          </div>
          <el-icon v-else class="site-logo-uploader-icon">
            <Plus />
          </el-icon>
          <template #tip>
            <div class="el-upload__tip">
              {{ t('views.system.customize.uploadLogoTip') }}
            </div>
          </template>
        </el-upload>
      </div>
    </cl-form-item>

    <el-divider />

    <cl-form-item
      :span="4"
      :label="t('views.system.customize.hidePlatformVersion')"
      prop="hide_platform_version"
    >
      <cl-switch v-model="form.value.hide_platform_version" @change="onSave" />
    </cl-form-item>
  </cl-form>
</template>

<style scoped>
.form {
  padding: 20px;

  &:deep(.site-logo) {
    &.disabled {
      opacity: 0.7;

      &:deep(.el-upload) {
        border: 1px dashed var(--el-border-color);
        cursor: not-allowed;
      }
    }

    &:deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      .site-logo-img-wrapper {
        position: relative;
        min-width: 128px;
        height: 128px;

        .site-logo-img {
          min-width: 128px;
          height: 128px;
          object-fit: contain;
        }

        .actions {
          color: #ffffff;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &:hover {
          .actions {
            background-color: #00000055;
            opacity: 1;

            .el-icon:hover {
              color: var(--cl-primary-color);
            }
          }
        }
      }

      .site-logo-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 128px;
        height: 128px;
        text-align: center;
      }
    }

    &:deep(.el-upload):hover {
      border-color: var(--cl-primary-color);
    }

    &:deep(.el-upload__tip) {
      margin: 0;
    }
  }
}
</style>
