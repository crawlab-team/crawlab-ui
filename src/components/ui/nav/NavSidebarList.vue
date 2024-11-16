<script setup lang="ts">
const props = defineProps<{
  activeKey: string;
  items: NavItem[];
}>();

const emit = defineEmits<{
  (event: 'select', index: number): void;
}>();

const onSelect = (id: string) => {
  emit(
    'select',
    props.items?.findIndex(item => item.id === id)
  );
};
defineOptions({ name: 'ClNavSidebarList' });
</script>

<template>
  <el-menu
    ref="navMenu"
    class="nav-menu"
    :default-active="activeKey"
    @select="onSelect"
  >
    <el-menu-item v-for="item in items" :key="item.id" :index="item.id">
      <span class="title">{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  border: none;
  max-height: calc(100% - var(--cl-nav-sidebar-search-height));
  overflow-y: auto;
  color: var(--cl-nav-sidebar-color);

  &.empty {
    height: var(--cl-nav-sidebar-item-height);
    display: flex;
    align-items: center;
    padding-left: 24px;
    font-size: 14px;
  }

  .el-menu-item {
    &:hover {
      color: var(--cl-menu-active-text);
      background-color: transparent !important;
    }
  }
}
</style>
