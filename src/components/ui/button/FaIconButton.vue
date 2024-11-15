<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonEmits, FaIconButtonProps } from './types';

const props = defineProps<FaIconButtonProps>();

const emit = defineEmits<ButtonEmits>();

const cls = computed<string>(() => {
  const { className } = props;
  const classes = ['fa-icon-button'];
  if (className) classes.push(className);
  return classes.join(' ');
});

defineOptions({ name: 'ClFaIconButton' });
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
    @click="(event: Event) => emit('click', event)"
    @mouseenter="(event: Event) => emit('mouseenter', event)"
    @mouseleave="(event: Event) => emit('mouseleave', event)"
  >
    <cl-icon :icon="icon" :spinning="spin" />
    <div v-if="badgeIcon" class="badge-icon">
      <cl-icon :icon="badgeIcon" />
    </div>
  </cl-button>
</template>

<style scoped>
.badge-icon {
  position: absolute;
  top: -2px;
  right: 2px;
  font-size: 8px;
  color: var(--cl-white);
}
</style>
