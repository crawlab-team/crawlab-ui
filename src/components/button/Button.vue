<script setup lang="ts">
defineOptions({ name: 'ClButton' });
import { computed } from 'vue';

interface ButtonProps {
  tooltip?: string;
  type?: BasicType;
  size?: BasicSize;
  round?: boolean;
  circle?: boolean;
  plain?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
  noMargin?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'default',
});

const emit = defineEmits<{
  (e: 'click', event: Event): void;
}>();

const cls = computed<string>(() => {
  const { noMargin, className, isIcon } = props;
  const classes = [];
  if (noMargin) classes.push('no-margin');
  if (isIcon) classes.push('icon-button');
  if (className) classes.push(className);
  return classes.join(' ');
});
</script>

<template>
  <el-tooltip :content="tooltip" :disabled="!tooltip">
    <span :id="id" :class="['button-wrapper', cls].join(' ')">
      <el-button
        :circle="circle"
        :disabled="disabled"
        :plain="plain"
        :round="round"
        :size="size"
        :title="tooltip"
        :type="type"
        :loading="loading"
        @click="(event: Event) => emit('click', event)"
      >
        <slot></slot>
      </el-button>
    </span>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.button-wrapper {
  position: relative;
  margin-right: 10px;

  &.no-margin {
    margin-right: 0;
  }

  .el-button {
    vertical-align: inherit;
  }
}
</style>

<style scoped>
.button-wrapper:deep(.icon-button) {
  padding: 7px;
}
</style>
