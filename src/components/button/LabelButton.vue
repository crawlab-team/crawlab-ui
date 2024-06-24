<script setup lang="ts">
defineOptions({ name: 'ClLabelButton' });

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

defineProps<
  ButtonProps & {
    label?: string;
    icon?: Icon;
  }
>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
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
      @click="() => emit('click')"
    >
      <font-awesome-icon v-if="icon && !loading" :icon="icon" class="icon" />
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

.label-button:deep(.el-icon.is-loading) {
  width: 17px;
}
</style>
