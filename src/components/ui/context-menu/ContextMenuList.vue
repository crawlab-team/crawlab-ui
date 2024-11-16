<script setup lang="ts">
import { ComputedRef, inject, ref } from 'vue';
import type { ContextMenuItem, ContextMenuListProps } from './types';

defineProps<ContextMenuListProps>();

const contextMenu = inject<{ visible: ComputedRef<boolean> }>('context-menu');

const emit = defineEmits<{
  (e: 'hide'): void;
}>();

const clicking = ref(false);
const onClick = (event: MouseEvent, item: ContextMenuItem) => {
  // skip if not visible
  if (!contextMenu?.visible.value) return;

  // skip disabled
  if (item.disabled) return;

  clicking.value = true;
  setTimeout(() => {
    clicking.value = false;
  }, 100);

  event.stopPropagation();
  if (!item.action) return;
  item.action();
  emit('hide');
};

const onClickOutside = () => {
  if (!contextMenu?.visible.value) return;
  if (clicking.value) return;
  emit('hide');
};

const getItemClassName = (item: ContextMenuItem) => {
  const cls = [];
  cls.push('context-menu-item');
  if (item.className) {
    cls.push(item.className);
  }
  if (item.disabled) {
    cls.push('disabled');
  }
  return cls.join(' ');
};

defineOptions({ name: 'ClContextMenuList' });
</script>

<template>
  <ul v-click-outside="onClickOutside" class="context-menu-list">
    <li
      v-for="(item, $index) in items"
      :key="$index"
      :class="getItemClassName(item)"
      :title="item.title"
      @click="onClick($event, item)"
    >
      <span class="prefix">
        <template v-if="item.icon">
          <font-awesome-icon
            v-if="Array.isArray(item.icon)"
            :icon="item.icon"
          />
          <cl-atom-material-icon v-else :is-dir="false" :name="item.icon" />
        </template>
      </span>
      <span class="title">
        {{ item.title }}
      </span>
    </li>
  </ul>
</template>

<style scoped>
.context-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  min-width: auto;

  .context-menu-item {
    height: var(--cl-context-menu-item-height);
    max-width: var(--cl-context-menu-item-max-width);
    display: flex;
    align-items: center;
    margin: 0;
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: var(--cl-primary-plain-color);
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .prefix {
      width: 24px;
      flex: 0 0 24px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
