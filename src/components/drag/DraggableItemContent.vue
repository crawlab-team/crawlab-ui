<script setup lang="ts">
defineOptions({ name: 'ClDraggableItemContent' });
import { inject, computed } from 'vue';
import { DraggableListContext } from '@/components/drag/DraggableList.vue';

defineProps<{
  item: DraggableItemData;
}>();

const content = inject<DraggableListContext>('list');
const defaultSlotName = computed(() =>
  content?.ctx?.slots?.default ? 'default' : ''
);
</script>

<template>
  <div
    v-if="
      content && content.ctx && content.ctx.slots && content.ctx.slots.default
    "
  >
    <slot :name="defaultSlotName" :item="item" />
  </div>
  <div v-else>
    <!-- 这里可以放置备用的内容或者一个空的占位符 -->
  </div>
</template>
