<script setup lang="ts">
defineOptions({ name: 'ClNavActionButton' });
import { ButtonProps } from '@/components/button/Button.vue';

export interface NavActionButtonProps extends ButtonProps {
  buttonType: ButtonType;
  label?: string;
  icon?: Icon;
  onClick?: () => void;
}

withDefaults(defineProps<NavActionButtonProps>(), {});
</script>

<template>
  <div class="nav-action-button">
    <cl-label-button
      v-if="buttonType === 'label'"
      :disabled="disabled"
      :icon="icon"
      :is-icon="!!icon"
      :label="label"
      :size="size"
      :tooltip="tooltip"
      :type="type"
      :id="id"
      :class-name="className"
      @click="onClick"
    />
    <cl-fa-icon-button
      v-else-if="buttonType === 'fa-icon'"
      :disabled="disabled"
      :icon="icon"
      :size="size"
      :tooltip="tooltip"
      :type="type"
      :id="id"
      :class-name="className"
      @click="onClick"
    />
  </div>
</template>

<style lang="scss" scoped></style>
