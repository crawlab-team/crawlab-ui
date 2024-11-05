<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ElTag } from 'element-plus';

interface TagProps {
  label?: string;
  tooltip?: string;
  type?: BasicType;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  icon?: Icon;
  suffixIcon?: Icon;
  size?: BasicSize;
  spinning?: boolean;
  width?: string;
  effect?: BasicEffect;
  clickable?: boolean;
  closable?: boolean;
  disabled?: boolean;
  className?: string;
  short?: boolean;
  shortWidth?: string;
}

const props = defineProps<TagProps>();

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'close'): void;
  (e: 'mouseenter'): void;
  (e: 'mouseleave'): void;
}>();

const tagRef = ref<typeof ElTag>();

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

const setStyle = () => {
  const { color, borderColor, width } = props;

  // normalize colors
  const borderColor_ = borderColor ?? color;

  // set style of tag
  const elTag = tagRef.value?.$el;
  if (!elTag) return;
  const styleTagList = [];
  if (color) styleTagList.push(`color: ${color}`);
  if (borderColor_) styleTagList.push(`border-color: ${borderColor_}`);
  if (width) styleTagList.push(`width: ${width}`);
  const styleTag = styleTagList.join(';');
  elTag.setAttribute('style', styleTag);

  // set style of tag close
  const elTagClose = elTag.querySelector('.el-tag__close');
  if (!elTagClose) return;
  const styleTagCloseList = [];
  if (color) {
    styleTagCloseList.push(`color: ${color}`);
    styleTagCloseList.push(`background-color: transparent`);
  }
  const styleTagClose = styleTagCloseList.join(';');
  elTagClose.setAttribute('style', styleTagClose);
};

watch(() => props.color, setStyle);
watch(() => props.backgroundColor, setStyle);
watch(() => props.borderColor, setStyle);

onMounted(() => {
  setStyle();
});
defineOptions({ name: 'ClTag' });
</script>

<template>
  <el-tooltip :content="tooltip" :disabled="!tooltip && !$slots.tooltip">
    <el-tag
      ref="tagRef"
      :closable="closable"
      :class="cls"
      :size="size"
      :type="type"
      :color="backgroundColor"
      :effect="effect"
      class="tag"
      @click="onClick($event)"
      @close="onClose($event)"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')"
    >
      <span class="prefix-icon">
        <cl-icon v-if="icon" :icon="icon" :spinning="spinning" />
      </span>
      <span class="label">{{ label }}</span>
      <span class="suffix-icon">
        <cl-icon v-if="suffixIcon" :icon="suffixIcon" />
      </span>
    </el-tag>
    <template #content>
      <slot name="tooltip"></slot>
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
    max-width: 120px;
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
