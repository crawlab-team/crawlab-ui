<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  collapsed?: boolean;
  minHeight?: string;
}>();

const originalHeight = ref<string>();
const height = ref<string>();

const navActions = ref<HTMLDivElement>();

const unmounted = ref<boolean>(true);

const collapsed = computed<boolean>(() => {
  const { collapsed } = props as NavActionsProps;
  return collapsed || false;
});

const style = computed(() => {
  return {
    minHeight: height.value,
  };
});

const classes = computed<string[]>(() => {
  const cls = [];
  if (collapsed.value) cls.push('collapsed');
  if (unmounted.value) cls.push('unmounted');
  return cls;
});

const getHeight = () => {
  return height.value;
};

const updateHeight = () => {
  if (!collapsed.value) {
    if (!originalHeight.value) {
      if (!navActions.value) return;
      originalHeight.value = window.getComputedStyle(navActions.value).height;
    }
    height.value = originalHeight.value;
  } else {
    height.value = '0';
  }
};

watch(collapsed, () => updateHeight());

onMounted(() => {
  updateHeight();
  unmounted.value = false;
});

defineExpose({
  getHeight,
  updateHeight,
});

defineOptions({ name: 'ClNavActions' });
</script>

<template>
  <div ref="navActions" :class="classes" :style="style" class="nav-actions">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
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
}
</style>
