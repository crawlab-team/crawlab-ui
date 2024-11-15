<script setup lang="ts">
import type { ButtonEmits, IconButtonProps } from './types';

defineProps<IconButtonProps>();

const emit = defineEmits<ButtonEmits>();

defineOptions({ name: 'ClIconButton' });
</script>

<template>
  <el-tooltip :content="tooltip ? tooltip : undefined">
    <div class="icon-button button">
      <cl-button
        :circle="circle"
        :disabled="disabled"
        :icon="icon"
        :plain="plain"
        :round="round"
        :size="size"
        :title="tooltip"
        :type="type"
        @click="(event: Event) => emit('click', event)"
        @mouseenter="(event: Event) => emit('mouseenter', event)"
        @mouseleave="(event: Event) => emit('mouseleave', event)"
      />
    </div>
  </el-tooltip>
</template>

<style scoped>
.icon-button {
  padding: 7px;
}

.icon-button:deep(.icon) {
  width: 20px;
}
</style>
