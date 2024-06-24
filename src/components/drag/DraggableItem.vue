<script setup lang="ts">
defineOptions({ name: 'ClDraggableItem' });
import { computed } from 'vue';
import { DraggableItemData } from '@/components/drag/drag';

const props = defineProps<{
  item: DraggableItemData;
  dragging?: boolean;
}>();

const emit = defineEmits<{
  (e: 'd-start', item: DraggableItemData): void;
  (e: 'd-end', item: DraggableItemData): void;
  (e: 'd-enter', item: DraggableItemData): void;
  (e: 'd-leave', item: DraggableItemData): void;
}>();

const dragging = computed(() => {
  const { item } = props;
  return item.dragging;
});

const classes = computed(() => {
  const cls = [];
  if (dragging.value) cls.push('dragging');
  return cls;
});
</script>

<template>
  <div
    :class="classes"
    :draggable="true"
    class="draggable-item"
    @dragstart="emit('d-start', item)"
    @dragend="emit('d-end', item)"
    @dragenter="emit('d-enter', item)"
    @dragleave="emit('d-leave', item)"
  >
    <slot :item="item" />
  </div>
</template>

<style lang="scss" scoped>
.draggable-item {
  position: relative;

  &.dragging {
    visibility: hidden;
  }

  &.dragging * {
    pointer-events: none;
  }
}
</style>
