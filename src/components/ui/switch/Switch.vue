<script setup lang="ts">
import { ref, computed, h, watch } from 'vue';
import { ClIcon } from '@/components';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    activeIcon?: Icon;
    inactiveIcon?: Icon;
    activeText?: string;
    inactiveText?: string;
    width?: number;
    loading?: boolean;
    inlinePrompt?: boolean;
    tooltip?: string;
  }>(),
  {
    activeColor: 'var(--cl-success-color)',
    inactiveColor: 'var(--cl-info-medium-color)',
    width: 40,
  }
);

const emit = defineEmits<{
  (e: 'change', value: boolean): void;
  (e: 'update:model-value', value: boolean): void;
}>();

const internalValue = ref<boolean>(props.modelValue);
watch(
  () => props.modelValue,
  () => {
    internalValue.value = props.modelValue;
  }
);
watch(internalValue, () => emit('update:model-value', internalValue.value));

const onChange = (value: boolean) => {
  emit('change', value);
};

const activeIconComp = computed(() => {
  if (props.activeIcon) {
    return h(ClIcon, { icon: props.activeIcon });
  }
});

const inactiveIconComp = computed(() => {
  if (props.inactiveIcon) {
    return h(ClIcon, { icon: props.inactiveIcon });
  }
});

const style = computed<string>(() => {
  const { activeColor, inactiveColor } = props;
  return `--el-switch-on-color: ${activeColor}; --el-switch-off-color: ${inactiveColor}`;
});
defineOptions({ name: 'ClSwitch' });
</script>

<template>
  <el-tooltip :content="tooltip" :disabled="!tooltip">
    <el-switch
      v-model="internalValue"
      :data-test="internalValue"
      :active-color="activeColor"
      :active-icon="activeIconComp"
      :active-text="activeText"
      :disabled="disabled"
      :inactive-color="inactiveColor"
      :inactive-icon="inactiveIconComp"
      :inactive-text="inactiveText"
      :loading="loading"
      :width="width"
      :inline-prompt="inlinePrompt"
      :style="style"
      @change="onChange"
    />
  </el-tooltip>
</template>


