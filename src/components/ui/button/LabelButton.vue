<script setup lang="ts">
import type { ButtonEmits, LabelButtonProps } from './types';

defineProps<LabelButtonProps>();

const emit = defineEmits<ButtonEmits>();

defineOptions({ name: 'ClLabelButton' });
</script>

<template>
  <cl-button
    :circle="circle"
    :disabled="disabled"
    :plain="plain"
    :round="round"
    :size="size"
    :is-icon="isIcon"
    :tooltip="tooltip"
    :type="type"
    :id="id"
    :class-name="['label-button', className].join(' ')"
    :loading="loading"
    @click="(event: Event) => emit('click', event)"
    @mouseenter="(event: Event) => emit('mouseenter', event)"
    @mouseleave="(event: Event) => emit('mouseleave', event)"
  >
    <span class="icon-wrapper">
      <cl-icon v-if="icon && !loading" :icon="icon" />
    </span>
    <span class="label">{{ label }}</span>
  </cl-button>
</template>

<style scoped>
.icon-wrapper {
  margin-right: 5px;
}
</style>
