<script setup lang="tsx">
import { computed, ref } from 'vue';
import { useDatabaseDetail } from '@/views';
import { useStore } from 'vuex';
import { TAB_NAME_DATABASES } from '@/constants';

const { activeId } = useDatabaseDetail();

const store = useStore();
const { database: state } = store.state as RootStoreState;
const activeNavItem = computed(() => state.activeNavItem);
const activeDatabaseName = computed(() => state.activeDatabaseName);

const sidebarRef = ref();

const onDatabaseTableClick = (
  table: DatabaseTable,
  type: DatabaseTableClickRowType
) => {
  const databaseName = activeNavItem.value?.data.name;
  let key = `${databaseName}:${table.name}`;
  if (type !== 'name') {
    key = `${key}:${type}`;
  }
  const data = sidebarRef.value?.treeRef?.getNode?.(key)
    ?.data as DatabaseNavItem;
  if (!data) return;
  sidebarRef.value?.selectNode?.(data);
};

defineOptions({ name: 'ClDatabaseDetailTabDatabases' });
</script>

<template>
  <div class="database-detail-tab-databases">
    <cl-database-sidebar ref="sidebarRef" :tab-name="TAB_NAME_DATABASES" />

    <div class="content">
      <template v-if="activeNavItem?.type === 'database'">
        <cl-database-database-detail
          :database="activeNavItem?.data"
          @click-table="onDatabaseTableClick"
        />
      </template>
      <template v-else-if="activeNavItem?.type === 'table'">
        <cl-database-table-detail
          :active-id="activeId"
          :database-name="activeDatabaseName"
        />
      </template>
    </div>

    <cl-create-edit-database-table-dialog />
  </div>
</template>

<style scoped>
.database-detail-tab-databases {
  display: flex;
  height: calc(100vh - 64px - 40px - 41px - 50px);
  width: 100%;

  .content {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;

    &:deep(.table) {
      width: 100%;
      height: 100%;
    }

    &:deep(.table .table-footer) {
      border-top: 1px solid var(--el-border-color);
    }

    &:deep(.table .el-table__inner-wrapper) {
      position: relative;
      overflow: unset;
    }

    &:deep(.table .el-table__header-wrapper) {
      position: sticky;
      top: 0;
    }
  }
}
</style>
