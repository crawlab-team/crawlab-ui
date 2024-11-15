<script setup lang="ts">
import type { ButtonType, ButtonProps } from '@/components/ui/button/types';

withDefaults(
  defineProps<
    ButtonProps & {
      buttonType: ButtonType;
      label?: string;
      icon?: Icon;
      onClick?: () => void;
    }
  >(),
  {}
);
defineOptions({ name: 'ClNavActionButton' });
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
      :data-test="id"
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
      :data-test="id"
      :class-name="className"
      @click="onClick"
    />
  </div>
</template>
