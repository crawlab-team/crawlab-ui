<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const navActions = ref<HTMLDivElement>();

const unmounted = ref<boolean>(true);

const classes = computed<string[]>(() => {
  const cls = [];
  if (unmounted.value) cls.push('unmounted');
  return cls;
});

onMounted(() => {
  unmounted.value = false;
});

defineOptions({ name: 'ClNavActions' });
</script>

<template>
  <div ref="navActions" :class="classes" class="nav-actions">
    <slot></slot>
  </div>
</template>

<style scoped>
.nav-actions {
  margin: 0;
  padding: 0 10px;
  min-height: 50px;
  display: flex;
  flex-wrap: nowrap;
  height: fit-content;
  border-bottom: 1px solid var(--cl-info-border-color);
  transition: all var(--cl-nav-actions-collapse-transition-duration);
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;

  &.collapsed {
    border-bottom: none;
  }

  &.unmounted {
    position: absolute;
  }

  &:hover {
    &::-webkit-scrollbar {
      display: block;
    }
  }

  &::-webkit-scrollbar {
    height: 4px;
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: var(
      --el-scrollbar-bg-color,
      var(--el-text-color-secondary)
    );
  }

  &::-webkit-scrollbar-track {
    border-radius: 2px;
    background-color: var(--el-fill-color-light);
  }
}
</style>
