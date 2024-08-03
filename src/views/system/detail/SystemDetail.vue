<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, UploadFile, UploadInstance } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
import { translate } from '@/utils';
import { arrayBufferToBase64 } from '@/utils/base64';
import { ClForm } from '@/components';

const t = translate;

const ns = 'system';
const store = useStore();
const { system: state } = store.state as RootStoreState;

const activeItemKey = ref('customize');

const formRef = ref<typeof ClForm>();

const customize = ref<Setting>({
  key: 'customize',
  value: {
    custom_title: '',
    show_custom_title: false,
    custom_logo: '',
    show_custom_logo: false,
    hide_platform_version: false,
  },
});
const onCustomizeChange = () => {
  store.commit(`${ns}/setCustomize`, customize.value);
};
onBeforeMount(async () => {
  await store.dispatch(`${ns}/getCustomize`);
  customize.value = state.customize;
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
  customize.value.value.custom_logo = `data:${mimeType};base64,${base64}`;
};
const onCustomLogoRemove = () => {
  customLogoUploadRef.value?.clearFiles();
  customize.value.value.custom_logo = '';
  onCustomizeChange();
};

const onSave = async () => {
  await formRef.value?.validate();
  await store.dispatch(`${ns}/saveCustomize`);
  ElMessage.success(t('common.message.success.save'));
};
defineOptions({ name: 'ClSystemDetail' });
</script>

<template>
  <div class="system-detail">
    <cl-nav-actions>
      <cl-nav-action-group-detail-common
        :show-back-button="false"
        :show-save-button="true"
        @save="onSave"
      />
    </cl-nav-actions>
    <div class="system-detail-content-wrapper">
      <el-menu
        :default-active="activeItemKey"
        @select="(value: string) => (activeItemKey = value)"
      >
        <el-menu-item index="customize">
          <cl-icon :icon="['fa', 'palette']" />
          {{ t('views.system.menuItems.customize') }}
        </el-menu-item>
        <el-menu-item index="registration" disabled>
          <cl-icon :icon="['fa', 'user-cog']" />
          {{ t('views.system.menuItems.registration') }}
        </el-menu-item>
      </el-menu>
      <div v-if="activeItemKey === 'customize'" class="system-detail-content">
        <cl-form ref="formRef" :model="customize.value">
          <cl-form-item
            :span="4"
            :label="t('views.system.customize.showCustomTitle')"
            prop="show_custom_title"
          >
            <cl-switch
              v-model="customize.value.show_custom_title"
              :placeholder="t('views.system.customize.showCustomTitle')"
              @change="onCustomizeChange"
            />
          </cl-form-item>
          <cl-form-item
            :span="4"
            :label="t('views.system.customize.customTitle')"
            prop="custom_title"
            :required="customize.value.show_custom_title"
          >
            <el-input
              v-model="customize.value.custom_title"
              :disabled="!customize.value.show_custom_title"
              :placeholder="t('views.system.customize.customTitle')"
              @change="onCustomizeChange"
            />
          </cl-form-item>

          <el-divider />

          <cl-form-item
            :span="4"
            :label="t('views.system.customize.showCustomLogo')"
            prop="show_custom_logo"
          >
            <cl-switch
              v-model="customize.value.show_custom_logo"
              :placeholder="t('views.system.customize.showCustomLogo')"
              @change="onCustomizeChange"
            />
          </cl-form-item>
          <cl-form-item
            :span="4"
            :label="t('views.system.customize.customLogo')"
            prop="custom_logo"
            :required="customize.value.show_custom_logo"
          >
            <div
              class="site-logo"
              :class="!customize.value.show_custom_logo ? 'disabled' : ''"
            >
              <el-upload
                ref="customLogoUploadRef"
                :auto-upload="false"
                :show-file-list="false"
                :disabled="!customize.value.show_custom_logo"
                :on-change="onUploadCustomLogo"
                :on-remove="
                  () => {
                    customize.value.custom_logo = '';
                    onCustomizeChange();
                  }
                "
              >
                <div
                  v-if="customize.value.custom_logo"
                  class="site-logo-img-wrapper"
                >
                  <img
                    :src="customize.value.custom_logo"
                    class="site-logo-img"
                    alt="logo"
                  />
                  <div class="actions">
                    <el-icon
                      class="remove-button"
                      @click.stop="onCustomLogoRemove"
                    >
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
            <cl-switch
              v-model="customize.value.hide_platform_version"
              :placeholder="t('views.system.customize.hidePlatformVersion')"
              @change="onCustomizeChange"
            />
          </cl-form-item>
        </cl-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.system-detail {
  background-color: #ffffff;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .system-detail-content-wrapper {
    flex: 1;
    display: flex;
    height: 100%;

    &:deep(.el-menu) {
      flex: 0 0 180px;

      .el-menu-item {
        &:hover {
          background-color: inherit !important;
          color: var(--cl-primary-color);
        }

        &:deep(.icon) {
          width: 24px;
        }
      }
    }

    .system-detail-content {
      padding: 20px;
      width: 100%;

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
  }
}
</style>
