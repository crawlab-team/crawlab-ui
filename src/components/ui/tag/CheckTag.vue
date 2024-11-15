<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CheckTagProps } from './types';

const props = defineProps<CheckTagProps>();

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const isHover = ref<boolean>(false);

const computedType = computed<BasicType | undefined>(() => {
  const { modelValue, type, disabled } = props;
  if (modelValue) {
    return 'primary';
  }
  return disabled ? 'info' : type;
});

const computedIcon = computed<Icon>(() => {
  const { modelValue } = props;
  return modelValue ? ['far', 'check-square'] : ['far', 'square'];
});

const computedClickable = computed<boolean>(() => {
  const { clickable, disabled } = props;
  if (disabled) {
    return false;
  }
  if (clickable === undefined) {
    return true;
  }
  return clickable;
});

const computedEffect = computed<BasicEffect>(() => {
  const { modelValue } = props;
  if (modelValue) {
    return 'dark';
  }
  if (!computedClickable.value) {
    return 'plain';
  }
  return isHover.value ? 'light' : 'plain';
});

const onClick = () => {
  const { modelValue } = props;
  const newValue = !modelValue;
  emit('update:model-value', newValue);
  emit('change', newValue);
};

const onMouseEnter = () => {
  isHover.value = true;
};

const onMouseLeave = () => {
  isHover.value = false;
};
defineOptions({ name: 'ClCheckTag' });
</script>

<template>
  <cl-tag
    :clickable="computedClickable"
    :label="label"
    :tooltip="tooltip"
    :type="computedType"
    :effect="computedEffect"
    :icon="computedIcon"
    :suffix-icon="suffixIcon"
    :spinning="spinning"
    :width="width"
    :class="['check-tag', className].join(' ')"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  />
</template>
