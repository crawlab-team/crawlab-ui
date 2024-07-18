<script setup lang="ts">
defineProps<{
  tooltip?: string;
  icon: Icon;
  color?: string;
}>();
defineOptions({ name: 'ClNavActionFaIcon' });
</script>

<template>
  <cl-nav-action-item class="nav-action-fa-icon" is-label>
    <el-tooltip :content="tooltip" :disabled="!tooltip">
      <cl-icon :icon="icon" :color="color" class="title" />
    </el-tooltip>
  </cl-nav-action-item>
</template>

<style scoped>
.nav-action-fa-icon {
  height: 32px;
}
</style>
