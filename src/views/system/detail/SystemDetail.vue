<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, UploadFile, UploadInstance } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
import {
  getIconByGeneralConcept,
  getIconByRouteConcept,
  translate,
} from '@/utils';
import { arrayBufferToBase64 } from '@/utils/base64';
import { ClForm } from '@/components';

const t = translate;

const activeItemKey = ref('customize');

const formRef = ref();

const onSave = async () => {
  await formRef.value?.save?.();
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
          <cl-icon :icon="getIconByGeneralConcept('customize')" />
          {{ t('views.system.menuItems.customize') }}
        </el-menu-item>
        <el-menu-item index="dependency">
          <cl-icon :icon="getIconByRouteConcept('dependency')" />
          {{ t('views.system.menuItems.dependency') }}
        </el-menu-item>
      </el-menu>
      <div class="system-detail-content">
        <template v-if="activeItemKey === 'customize'">
          <cl-system-detail-tab-customize ref="formRef" />
        </template>
        <template v-else-if="activeItemKey === 'dependency'">
          <cl-system-detail-tab-dependency ref="formRef" />
        </template>
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
    }
  }
}
</style>
