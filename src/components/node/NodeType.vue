<script setup lang="ts">
defineOptions({ name: 'ClNodeType' });
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  isMaster?: boolean;
  label?: string;
}>();

const { t } = useI18n();

const type = computed<string>(() => {
  const { isMaster } = props;
  return isMaster ? '' : 'warning';
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
