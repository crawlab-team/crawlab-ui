<script setup lang="ts">
defineOptions({ name: 'ClNavActionGroup' });
</script>

<template>
  <div class="nav-action-group">
    <div class="border" />
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.nav-action-group {
  height: fit-content;
  display: flex;
  align-items: start;
  box-sizing: border-box;
  flex-wrap: wrap;
  position: relative;

  & + .nav-action-group {
    //padding-left: 10px;
    margin-left: 10px;
  }

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
}
</style>
