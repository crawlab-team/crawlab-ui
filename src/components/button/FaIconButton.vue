<script setup lang="ts">
defineOptions({ name: 'ClFaIconButton' });

import { computed } from 'vue';
import { ButtonProps } from '@/components/button/Button.vue';

export interface FaIconButtonProps extends ButtonProps {
  icon: Icon;
  badgeIcon?: Icon;
  spin?: boolean;
}

const props = defineProps<FaIconButtonProps>();

const cls = computed<string>(() => {
  const { className } = props;
  const classes = ['fa-icon-button'];
  if (className) classes.push(className);
  return classes.join(' ');
});
</script>

<template>
  <cl-button
    :circle="circle"
    :disabled="disabled"
    :plain="plain"
    :round="round"
    :size="size"
    :tooltip="tooltip"
    :type="type"
    is-icon
    :id="id"
    :class-name="cls"
    @click="() => $emit('click')"
  >
    <font-awesome-icon :icon="icon" :spin="spin" />
    <div v-if="badgeIcon" class="badge-icon">
      <font-awesome-icon :icon="badgeIcon" />
    </div>
  </cl-button>
</template>

<style lang="scss" scoped>
.badge-icon {
  position: absolute;
  top: -2px;
  right: 2px;
  font-size: 8px;
  color: var(--cl-white);
}
</style>

<style scoped>
.el-button,
.el-button--mini,
.fa-icon-button,
.fa-icon-button:deep(.el-button),
.fa-icon-button:deep(.el-button--mini),
.fa-icon-button:deep(.button) {
  padding: 7px;
}

.fa-icon-button:deep(.el-button--small) {
  width: 32px;
  height: 32px;
}
</style>
