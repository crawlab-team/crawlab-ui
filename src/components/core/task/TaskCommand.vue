<script setup lang="ts">
import { computed } from 'vue';
import { translate } from '@/utils';

const props = defineProps<{
  task: Task;
  spider?: Spider;
  size?: BasicSize;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

const getLabel = (s?: string, n = 12) => {
  if (!s) return;
  return s.length > n ? `${s.substring(0, n)}...` : s;
};

const cmd = computed<string>(() => {
  const { task } = props;
  const arr = [];
  arr.push(task.cmd);
  if (task.param) arr.push(task.param);
  return arr.join(' ');
});

const type = computed<BasicType>(() => {
  const { task, spider } = props;
  if (!task.cmd) return 'info';
  if (!spider) return 'primary';
  if (spider.cmd === task.cmd && spider.param === task.param) return 'primary';
  return 'warning';
});

const color = computed<string>(() => {
  switch (type.value) {
    case 'info':
      return 'var(--cl-info-light-color)';
    case 'primary':
      return 'var(--cl-primary-color)';
    case 'warning':
      return 'var(--cl-warning-color)';
    default:
      return 'var(--cl-info-light-color)';
  }
});

const isCustomized = computed<boolean>(() => type.value === 'warning');

const data = computed<TagProps>(() => {
  return {
    type: type.value,
    label: getLabel(cmd.value) || '-',
    tooltip: `<div>${t('components.task.form.command')}${isCustomized.value ? ` (${t('components.task.form.tooltip.customized')})` : ''}:</div>
<div style="color: ${color.value};font-weight: 600">${cmd.value || '-'}</div>`,
  };
});
defineOptions({ name: 'ClTaskCommand' });
</script>

<template>
  <cl-tag
    :key="data"
    :color="data.color"
    :icon="data.icon"
    :label="data.label"
    :size="size"
    :type="data.type"
    effect="plain"
    @click="$emit('click')"
  >
    <template #tooltip>
      <div class="tooltip" v-html="data.tooltip" />
    </template>
  </cl-tag>
</template>


