<script setup lang="ts">
defineOptions({ name: 'ClNavActionItem' });
defineProps<{
  isLabel?: boolean;
  label?: string;
}>();
</script>

<template>
  <div :class="[isLabel ? 'is-label' : '']" class="nav-action-item">
    <span v-if="label" class="nav-action-item-label">
      {{ label }}
    </span>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.nav-action-item {
  margin: 10px 0;
  //height: fit-content;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  color: var(--cl-nav-actions-item-color);

  & + .nav-action-item {
    //margin-left: 10px;
  }

  &.is-label {
    margin-right: 10px;
  }
}
</style>
<style scoped>
.nav-action-item:deep(.title) {
  color: inherit;
}

.nav-action-item:deep(.label) {
  color: inherit;
  font-size: 14px;
  margin-right: 5px;
  margin-left: 5px;
}

.nav-action-item:deep(.el-button.el-button--small) {
  height: 32px;
}

.nav-action-item:deep(.el-button:not(.is-circle) .fa) {
  margin-right: 0;
}

.nav-action-item:deep(.el-button .icon + span) {
  margin-left: 5px;
}

.nav-action-item:deep(.nav-action-item-label) {
  color: inherit;
  font-size: 12px;
  margin-right: 5px;
}
</style>
