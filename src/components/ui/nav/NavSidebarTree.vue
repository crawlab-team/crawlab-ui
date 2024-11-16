<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  activeKey: string;
  items: NavItem[];
  showCheckbox: boolean;
  defaultCheckedKeys: string[];
  defaultExpandedKeys: string[];
  defaultExpandAll: boolean;
}>();
const emit = defineEmits<{
  (event: 'select', item: NavItem): void;
  (
    event: 'check',
    item: NavItem,
    checked: boolean,
    checkedNodes: NavItem[]
  ): void;
}>();

const treeRef = ref();

const onNodeClick = (item: NavItem) => {
  emit('select', item);
};

const onCheckChange = (item: NavItem, checked: boolean) => {
  emit('check', item, checked, treeRef.value?.getCheckedNodes());
};

const getClass = (item: NavItem): string | undefined => {
  if (item.id === props.activeKey) {
    return 'active';
  } else {
    return;
  }
};
defineOptions({ name: 'ClNavSidebarTree' });
</script>

<template>
  <div
    class="nav-menu"
    :class="[showCheckbox ? 'show-checkbox' : ''].join(' ')"
  >
    <el-tree
      ref="treeRef"
      :data="items"
      node-key="id"
      :props="{
        label: 'title',
        children: 'children',
        class: getClass,
      }"
      :show-checkbox="showCheckbox"
      :default-checked-keys="defaultCheckedKeys"
      :default-expand-all="defaultExpandAll"
      @node-click="onNodeClick"
      @check-change="onCheckChange"
    >
      <template #default="{ data }">
        <span class="title">
          {{ data.title }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style scoped>
.nav-menu {
  height: 100%;
  overflow-y: auto;

  &:deep(.el-tree-node) {
    font-size: 14px;
    cursor: pointer;
  }

  &:deep(.el-tree-node > .el-tree-node__content) {
    height: 48px;
  }

  &:deep(.el-tree-node > .el-tree-node__content:hover) {
    background-color: #ecf5ff !important;
  }

  .nav-menu:not(.show-checkbox):deep(
      .el-tree-node.active > .el-tree-node__content
    ),
  .nav-menu:not(.show-checkbox):deep(
      .el-tree-node > .el-tree-node__content:hover
    ) {
    color: #409eff;
  }

  &:deep(.el-tree-node:focus > .el-tree-node__content),
  &:deep(.el-tree-node:hover > .el-tree-node__content) {
    background: inherit;
  }
}
</style>
