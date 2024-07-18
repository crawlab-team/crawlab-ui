<script setup lang="ts">
import { computed } from 'vue';
import { translate } from '@/utils';

const props = defineProps<{
  isMaster?: boolean;
  label?: string;
}>();

const t = translate;

const type = computed<BasicType>(() => {
  const { isMaster } = props;
  return isMaster ? 'primary' : 'warning';
});

const computedLabel = computed<string>(() => {
  const { isMaster, label } = props;
  if (label) return label;
  return isMaster
    ? t('components.node.nodeType.label.master')
    : t('components.node.nodeType.label.worker');
});

const icon = computed<string[]>(() => {
  const { isMaster } = props;
  return isMaster ? ['fa', 'home'] : ['fa', 'server'];
});
defineOptions({ name: 'ClNodeType' });
</script>

<template>
  <el-tag :type="type" class="node-type">
    <font-awesome-icon :icon="icon" class="icon" />
    <span>{{ computedLabel }}</span>
  </el-tag>
</template>

<style lang="scss" scoped>
.node-type {
  cursor: pointer;

  .icon {
    margin-right: 5px;
  }
}
</style>
