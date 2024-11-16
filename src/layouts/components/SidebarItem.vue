<script setup lang="ts">
import { translate } from '@/utils';

defineProps<{
  item: MenuItem;
}>();

const emit = defineEmits<{
  (e: 'click', item: MenuItem): void;
}>();

const t = translate;

const onMenuItemClick = (item: MenuItem) => {
  emit('click', item);
};
defineOptions({ name: 'ClSidebarItem' });
</script>

<template>
  <!-- no sub menu items -->
  <el-menu-item
    v-if="!item.children"
    :index="item.path"
    @click="onMenuItemClick(item)"
  >
    <cl-menu-item-icon :item="item" size="normal" />
    <template #title>
      <span class="menu-item-title">{{ t(item.title) }}</span>
    </template>
  </el-menu-item>

  <!-- has sub menu items -->
  <el-sub-menu v-else :index="item.path">
    <template #title>
      <cl-menu-item-icon :item="item" size="normal" />
      <span class="menu-item-title">{{ t(item.title) }}</span>
    </template>
    <sidebar-item
      v-for="(subItem, $index) in item.children"
      :key="$index"
      :index="subItem.path"
      :item="subItem"
      @click="onMenuItemClick(subItem)"
    />
  </el-sub-menu>
</template>

<style scoped>
.el-menu-item * {
  vertical-align: middle;
}

.el-menu-item,
.el-sub-menu {
  &.is-active {
    background-color: var(--cl-menu-hover) !important;
  }

  .menu-item-title {
    margin-left: 6px;
  }
}
</style>
