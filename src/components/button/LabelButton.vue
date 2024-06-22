<script setup lang="ts">
defineOptions({ name: 'ClLabelButton' });
import { ButtonProps } from '@/components/button/Button.vue';

export interface LabelButtonProps extends ButtonProps {
  label: string;
  icon: string;
}

withDefaults(defineProps<LabelButtonProps>(), {
  label: '',
  icon: '',
});
</script>

<template>
  <div class="label-button">
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
      @click="() => $emit('click')"
    >
      <font-awesome-icon v-if="icon" :icon="icon" class="icon" />
      {{ label }}
    </cl-button>
  </div>
</template>

<style lang="scss" scoped></style>
<style scoped>
.label-button:deep(.icon) {
  width: 20px;
  margin-right: 3px;
}
</style>
