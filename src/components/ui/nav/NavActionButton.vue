<script setup lang="ts">
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


