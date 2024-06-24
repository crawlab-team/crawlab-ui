<script setup lang="ts">
defineOptions({ name: 'ClContextMenuList' });

interface ContextMenuItem {
  title: string;
  icon?: Icon;
  action?: () => void;
  className?: string;
}

defineProps<{
  items?: ContextMenuItem[];
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
}>();

const onClick = (item: ContextMenuItem) => {
  if (!item.action) return;
  item.action();
  emit('hide');
};
</script>

<template>
  <ul class="context-menu-list">
    <li
      v-for="(item, $index) in items"
      :key="$index"
      :class="['context-menu-item', item.className].join(' ')"
      @click="onClick(item)"
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

<style lang="scss" scoped>
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
      display: flex;
      align-items: center;
    }
  }
}
</style>
