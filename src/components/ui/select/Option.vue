<script setup lang="ts">
defineProps<{
  label?: string;
  value?: any;
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
      <slot />
    </template>
  </el-option>
</template>
