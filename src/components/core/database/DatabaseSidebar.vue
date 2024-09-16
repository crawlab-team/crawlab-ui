<script setup lang="tsx">
import { ref, computed, watch } from 'vue';
import { ElTree, ElInput } from 'element-plus';
import { debounce } from 'lodash';
import { translate } from '@/utils';
import type { FilterNodeMethodFunction } from 'element-plus/es/components/tree/src/tree.type';

const t = translate;

const props = defineProps<{
  treeItems: DatabaseNavItem[];
  defaultExpandedKeys: string[];
}>();

const emit = defineEmits<{
  (e: 'nodeClick', data: DatabaseNavItem): void;
  (e: 'contextMenuClick', event: MouseEvent, data: DatabaseNavItem): void;
  (e: 'refresh'): void;
  (e: 'createDatabase'): void;
  (e: 'createTable'): void;
}>();

const treeRef = ref<InstanceType<typeof ElTree>>();
const searchKeyword = ref('');
const showSearch = ref(false);

const onSearchFilter: FilterNodeMethodFunction = (value, data) => {
  if (!value) return true;
  return data.label.toLowerCase().includes(value.toLowerCase());
};

const debouncedFilter = debounce(() => {
  treeRef.value?.filter(searchKeyword.value);
}, 300);

watch(searchKeyword, debouncedFilter);

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchKeyword.value = '';
    treeRef.value?.filter('');
  }
};

const onRefresh = () => {
  emit('refresh');
};

const onCreateDatabase = () => {
  emit('createDatabase');
};

const onCreateTable = () => {
  emit('createTable');
};

defineExpose({ treeRef });

defineOptions({ name: 'ClDatabaseSidebar' });
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-actions">
      <el-button @click="toggleSearch">
        <i class="fa fa-search"></i>
      </el-button>
      <el-button @click="onRefresh">
        <i class="fa fa-sync"></i>
      </el-button>
      <el-button @click="onCreateDatabase">
        <i class="fa fa-database"></i>
      </el-button>
      <el-button @click="onCreateTable">
        <i class="fa fa-table"></i>
      </el-button>
    </div>
    <div v-if="showSearch" class="sidebar-search">
      <el-input
        v-model="searchKeyword"
        :placeholder="t('views.database.databases.sidebar.search.placeholder')"
        clearable
        @clear="
          () => {
            searchKeyword = '';
            showSearch = false;
          }
        "
      />
    </div>
    <el-scrollbar>
      <el-tree
        ref="treeRef"
        node-key="id"
        :data="treeItems"
        :props="{
          class: _data => {
            if (_data.new) return 'new';
            return '';
          },
        }"
        :filter-node-method="onSearchFilter"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandedKeys"
        highlight-current
        @node-click="data => emit('nodeClick', data)"
        @node-contextmenu="
          (event, _, node) => emit('contextMenuClick', event, node.data)
        "
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>
              <i :class="data.icon"></i>
              {{ node.label }}
            </span>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
}

.sidebar-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.sidebar-search {
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.custom-tree-node i {
  margin-right: 8px;
}
</style>
