<script setup lang="ts">
defineProps<{
  label?: string;
  value?: any;
  icon?: Icon;
}>();
defineOptions({ name: 'ClOption' });
</script>

<template>
  <el-option
    :label="label"
    :value="value"
    :data-test="value"
    :data-test-text="label"
  >
    <template #default>
      <template v-if="icon">
        <cl-icon :icon="icon" />
        <template v-if="$slots.default">
          <slot />
        </template>
        <template v-else>
          <span>{{ label }}</span>
        </template>
      </template>
      <template v-else>
        <slot />
      </template>
    </template>
  </el-option>
</template>

<style scoped>
.el-select-dropdown__item {
  display: flex;
  align-items: center;

  &:deep(.icon) {
    width: 14px;
    margin-right: 5px;
  }
}
</style>
