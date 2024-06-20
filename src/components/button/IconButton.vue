<script setup lang="ts">
defineOptions({ name: 'ClIconButton' });
import { ButtonProps } from '@/components/button/Button.vue';

export interface IconButtonProps extends ButtonProps {
  icon: string;
}

withDefaults(defineProps<IconButtonProps>(), {});
</script>

<template>
  <el-tooltip :content="tooltip ? tooltip : undefined">
    <span>
      <el-button
        :circle="circle"
        :disabled="disabled"
        :icon="icon"
        :plain="plain"
        :round="round"
        :size="size"
        :title="tooltip"
        :type="type"
        class="icon-button button"
        @click="() => $emit('click')"
      />
    </span>
  </el-tooltip>
</template>

<style lang="scss" scoped></style>
<style scoped>
.icon-button {
  padding: 7px;
}

.icon-button:deep(.icon) {
  width: 20px;
}
</style>
