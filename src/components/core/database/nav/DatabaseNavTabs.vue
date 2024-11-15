<script setup lang="ts">
import { translate } from '@/utils';

const activeTabName = defineModel();

defineProps<{
  tabsItems: NavItem[];
  canSave?: boolean;
  hasChanges?: boolean;
  commitLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'commit'): void;
  (e: 'rollback'): void;
}>();

const t = translate;
defineOptions({ name: 'ClDatabaseNavTabs' });
</script>

<template>
  <cl-nav-tabs
    :active-key="activeTabName"
    :items="tabsItems"
    @select="(key: string) => (activeTabName = key)"
  >
    <template #extra>
      <div class="nav-tabs-actions">
        <cl-fa-icon-button
          type="primary"
          :icon="['fa', 'save']"
          :tooltip="t('components.database.actions.commitChanges')"
          size="small"
          :disabled="!canSave"
          :loading="commitLoading"
          @click.stop="emit('commit')"
        />
        <cl-fa-icon-button
          type="info"
          :icon="['fa', 'rotate-left']"
          :tooltip="t('components.database.actions.rollbackChanges')"
          size="small"
          :disabled="!hasChanges"
          @click.stop="emit('rollback')"
        />
      </div>
    </template>
  </cl-nav-tabs>
</template>

<style scoped>
.nav-tabs {
  &:deep(.nav-tabs-actions) {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 10px;
  }

  &:deep(.nav-tabs-actions .el-button) {
    margin: 0;
  }
}
</style>
