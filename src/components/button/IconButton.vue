<script setup lang="ts">
defineOptions({ name: 'ClIconButton' });
import { ButtonProps } from '@/components/button/button';

defineProps<
  /* @vue-ignore */ ButtonProps & {
    icon: string;
  }
>();
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
        @click="() => $emit('click')"
      />
    </div>
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
