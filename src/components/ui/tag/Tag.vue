<script setup lang="ts">
import { computed, CSSProperties } from 'vue';
import type { TagProps } from './types';

const props = defineProps<TagProps>();

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'close'): void;
  (e: 'mouseenter'): void;
  (e: 'mouseleave'): void;
}>();

const slots = defineSlots<{
  default: any;
  tooltip: any;
}>();

const onClick = (ev?: Event) => {
  ev?.stopPropagation();
  const { clickable } = props;
  if (clickable) {
    emit('click');
  }
};

const onClose = (ev?: Event) => {
  ev?.stopPropagation();
  const { closable } = props;
  if (closable) {
    emit('close');
  }
};

const cls = computed<string[]>(() => {
  const { clickable, disabled, label, short, className } = props;
  const cls = [] as string[];
  if (clickable) cls.push('clickable');
  if (disabled) cls.push('disabled');
  if (!label) cls.push('no-label');
  if (short) cls.push('short');
  if (className) cls.push(className);
  return cls;
});

const style = computed<CSSProperties>(() => {
  const { color, borderColor, width, maxWidth } = props;
  return {
    color,
    borderColor,
    width,
    maxWidth,
  };
});

defineOptions({ name: 'ClTag' });
</script>

<template>
  <el-tooltip :content="tooltip" :disabled="!tooltip && !slots.tooltip">
    <el-tag
      class="tag"
      :class="cls"
      :size="size"
      :type="type"
      :closable="closable"
      :color="backgroundColor"
      :effect="effect"
      :style="style"
      @click="onClick($event)"
      @close="onClose($event)"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')"
    >
      <template v-if="slots.default">
        <slot name="default" />
      </template>
      <template v-else>
        <span v-if="icon" class="prefix-icon">
          <cl-icon :icon="icon" :spinning="spinning" />
        </span>
        <span v-if="label" class="label">{{ label }}</span>
        <span v-if="suffixIcon" class="suffix-icon">
          <cl-icon :icon="suffixIcon" />
        </span>
      </template>
    </el-tag>
    <template v-if="slots.tooltip" #content>
      <slot name="tooltip" />
    </template>
  </el-tooltip>
</template>

<style scoped>
.tag {
  cursor: default;
  text-overflow: ellipsis;

  &:deep(.el-tag__close:hover) {
    font-weight: bolder;
  }

  &:not(.no-label):deep(.prefix-icon) {
    margin-right: 5px;
  }

  &:not(.no-label):deep(.suffix-icon) {
    margin-left: 5px;
  }

  &.disabled {
    cursor: not-allowed;
    background-color: var(--cl-disabled-bg-color);
    border-color: var(--cl-disabled-border-color);
    color: var(--cl-disabled-color);
  }

  &.clickable {
    &:not(.disabled) {
      cursor: pointer;
    }
  }

  &.short {
    max-width: 150px;
    overflow: hidden;
    justify-content: start;
    align-items: center;

    &:deep(.el-tag__content) {
      display: inline-flex;
      width: 100%;
      align-items: center;
    }

    &:deep(.el-tag__content .label) {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
