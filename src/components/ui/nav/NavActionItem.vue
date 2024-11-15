<script setup lang="ts">
defineProps<{
  isLabel?: boolean;
  label?: string;
}>();
defineOptions({ name: 'ClNavActionItem' });
</script>

<template>
  <div :class="[isLabel ? 'is-label' : '']" class="nav-action-item">
    <span v-if="label" class="nav-action-item-label">
      {{ label }}
    </span>
    <slot></slot>
  </div>
</template>

<style scoped>
.nav-action-item {
  margin: 10px 0;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  color: var(--cl-nav-actions-item-color);

  &:deep(.title) {
    color: inherit;
  }

  &:deep(.label) {
    color: inherit;
    font-size: 14px;
    margin-right: 5px;
  }

  &:deep(.el-button.el-button--small) {
    height: 32px;
  }

  &:deep(.el-button:not(.is-circle) .fa) {
    margin-right: 0;
  }

  &:deep(.el-button .icon + span) {
    margin-left: 5px;
  }

  &:deep(.nav-action-item-label) {
    color: inherit;
    font-size: 12px;
    margin-right: 5px;
  }
}
</style>
