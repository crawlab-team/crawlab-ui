<script setup lang="ts">
defineProps<{
  className?: string;
}>();

defineOptions({ name: 'ClNavActionGroup' });
</script>

<template>
  <div class="nav-action-group" :class="className">
    <div class="border" />
    <slot></slot>
  </div>
</template>

<style scoped>
.nav-action-group {
  height: fit-content;
  display: flex;
  align-items: start;
  gap: 10px;
  box-sizing: border-box;
  position: relative;
  margin-right: 10px;

  &:first-child {
    .border {
      display: none;
    }
  }

  .border {
    position: absolute;
    left: 0;
    top: 10px;
    margin-left: -10px;
    margin-right: 10px;
    border-left: 1px solid var(--cl-nav-actions-group-border-color);
    height: calc(100% - 20px);
  }
}
</style>

<style scoped>
.nav-action-group:deep(.nav-action-item:last-child) {
  margin-right: 0;
  padding-right: 10px;
}
</style>
