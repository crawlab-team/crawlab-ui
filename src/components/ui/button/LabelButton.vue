<script setup lang="ts">
import { ButtonEmits, LabelButtonProps } from './types';

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
    <font-awesome-icon v-if="icon && !loading" :icon="icon" class="icon" />
    {{ label }}
  </cl-button>
</template>

<style scoped>
.label-button:deep(.icon) {
  width: 20px;
  margin-right: 3px;
}

.label-button:deep(.el-icon.is-loading) {
  width: 17px;
}
</style>
