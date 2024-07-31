<script setup lang="ts">
defineProps<{
  tooltip?: string;
}>();
defineOptions({ name: 'ClTip' });
</script>

<template>
  <el-tooltip :content="tooltip" trigger="click">
    <span style="cursor: pointer">
      <cl-icon
        :icon="['fa', 'question-circle']"
        color="var(--el-text-color-regular)"
      />
    </span>
  </el-tooltip>
</template>
