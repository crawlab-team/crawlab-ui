<script setup lang="ts">

import { translate } from '@/utils';

defineProps<{
  icon?: Icon;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const onClick = () => {
  emit('click');
};
defineOptions({ name: 'ClActionTab' });
</script>

<template>
  <el-tooltip :content="t('components.tab.newTab')">
    <cl-tab
      :icon="icon"
      :show-close="false"
      :show-title="false"
      class="action-tab"
      @click="onClick"
    />
  </el-tooltip>
</template>

<style lang="scss" scoped>
.action-tab {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.action-tab:deep(.icon) {
  color: #909399;
}
</style>
