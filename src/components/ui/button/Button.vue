<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps, ButtonEmits } from './types';

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'default',
});

const emit = defineEmits<ButtonEmits>();

const cls = computed<string>(() => {
  const { noMargin, className, isIcon } = props;
  const classes = [];
  if (noMargin) classes.push('no-margin');
  if (isIcon) classes.push('icon-button');
  if (className) classes.push(className);
  return classes.join(' ');
});

defineOptions({ name: 'ClButton' });
</script>

<template>
  <el-tooltip :content="tooltip" :disabled="!tooltip">
    <el-button
      :id="id"
      :class="cls"
      :circle="circle"
      :disabled="disabled"
      :plain="plain"
      :round="round"
      :size="size"
      :title="tooltip"
      :type="type"
      :loading="loading"
      @click="(event: Event) => emit('click', event)"
      @mouseenter="(event: Event) => emit('mouseenter', event)"
      @mouseleave="(event: Event) => emit('mouseleave', event)"
    >
      <slot></slot>
    </el-button>
  </el-tooltip>
</template>

<style scoped>
.el-button {
  position: relative;
  vertical-align: inherit;

  &:deep(.icon-button) {
    padding: 7px;
  }
}
</style>

<style scoped></style>
