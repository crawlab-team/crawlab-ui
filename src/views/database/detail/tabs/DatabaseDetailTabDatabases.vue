<script setup lang="tsx">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useDatabaseDetail } from '@/views';
import { translate } from '@/utils';
import { ElMessage, ElTree } from 'element-plus';
import { ClResultCell } from '@/components';

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const { activeId } = useDatabaseDetail();

const treeItems = computed<DatabaseNavItem[]>(() => {
  const { metadata } = state;
  if (!metadata?.databases) return [] as DatabaseNavItem[];
  return metadata.databases.map(d => {
    if (!d.tables) return [];
    return {
      id: `${d.name}`,
      name: d.name,
      label: d.name,
      icon: ['fa', 'database'],
      type: 'database',
      children: d.tables.map(t => {
        return {
          id: `${d.name}:${t.name}`,
          name: t.name,
          label: t.name,
          icon: ['fa', 'table'],
          type: 'table',
          database: d.name,
          children: [
            {
              id: `${d.name}:${t.name}:columns`,
              label: 'columns',
              icon: ['fa', 'columns'],
              children: t.columns?.map(c => {
                return {
                  id: `${d.name}:${t.name}:columns:${c.name}`,
                  name: c.name,
                  label: c.name,
                  icon: ['fa', 'tag'],
                  type: 'column',
                  data_type: c.type,
                };
              }),
            },
            {
              id: `${d.name}:${t.name}:indexes`,
              label: 'indexes',
              icon: ['fa', 'key'],
              children: t.indexes?.map(i => {
                return {
                  id: `${d.name}:${t.name}:indexes:${i.name}`,
                  name: i.name,
                  label: i.name,
                  icon: ['fa', 'key'],
                };
              }),
            },
          ],
        } as DatabaseNavItem;
      }),
    };
  }) as DatabaseNavItem[];
});

const updateMetadata = () => {
  store.dispatch(`${ns}/getMetadata`, { id: activeId.value });
};

const tablePreviewLoading = ref(false);
const getTablePreview = async () => {
  if (!activeNavItem.value) return;
  tablePreviewLoading.value = true;
  const { database, name: table } = activeNavItem.value;
  try {
    await store.dispatch(`${ns}/getTablePreview`, {
      id: activeId.value,
      database,
      table,
    });
  } catch (error: any) {
    ElMessage.error(error.message);
  } finally {
    tablePreviewLoading.value = false;
  }
};

const activeNavItem = ref<DatabaseNavItem>();
const onNodeClick = async (data: DatabaseNavItem) => {
  console.debug('onNodeClick');
  activeNavItem.value = data;
  const { type } = data;
  if (type === 'table') {
    await getTablePreview();
  }
};

const treeRef = ref<typeof ElTree>();
const activeContextMenuNavItem = ref<DatabaseNavItem>();
const contextMenuVisibleMap = ref<Record<string, boolean>>({});
const isContextMenuVisible = (id: string) => {
  if (!activeContextMenuNavItem.value) return false;
  if (activeContextMenuNavItem.value.id !== id) return false;
  return contextMenuVisibleMap.value[id] || false;
};
const onActionsClick = (item: DatabaseNavItem, event: MouseEvent) => {
  event.stopPropagation();
  activeContextMenuNavItem.value = item;
  contextMenuVisibleMap.value[item.id] = true;
};
const onContextMenuClick = (event: MouseEvent, data: DatabaseNavItem) => {
  event.stopPropagation();
  activeContextMenuNavItem.value = data;
  contextMenuVisibleMap.value[data.id] = true;
};
const onContextMenuHide = (id: string) => {
  activeContextMenuNavItem.value = undefined;
  contextMenuVisibleMap.value[id] = false;
};
const contextMenuItems = computed<ContextMenuItem[]>(() => {
  if (!activeContextMenuNavItem.value) return [];
  const { id, type } = activeContextMenuNavItem.value;
  if (!contextMenuVisibleMap.value[id]) return [];
  switch (type) {
    case 'database':
      return [
        {
          title: t('common.actions.view'),
          icon: ['fa', 'search'],
          action: () => {
            console.debug('view');
          },
        },
        {
          title: t('common.actions.edit'),
          icon: ['fa', 'edit'],
          action: () => {
            console.debug('Edit');
          },
        },
      ];
    case 'table':
      return [
        {
          title: t('common.actions.previewData'),
          icon: ['fa', 'table'],
          action: async () => {
            activeNavItem.value = activeContextMenuNavItem.value;
            treeRef.value?.setCurrentKey(activeNavItem.value?.id);
            await store.dispatch(`${ns}/getTablePreview`, {
              id: activeId.value,
              table: activeNavItem.value?.name,
            });
          },
        },
        {
          title: t('common.actions.edit'),
          icon: ['fa', 'edit'],
          action: () => {
            console.debug('Edit');
          },
        },
      ];
    case 'column':
      return [
        {
          title: t('common.actions.view'),
          icon: ['fa', 'search'],
          action: () => {
            console.debug('view');
          },
        },
        {
          title: t('common.actions.edit'),
          icon: ['fa', 'edit'],
          action: () => {
            console.debug('Edit');
          },
        },
      ];
    default:
      return [];
  }
});

const tableColumns = computed<TableColumns<Record<string, any>>>(() => {
  const { id, type, children } = activeNavItem.value || {};
  if (type !== 'table' || !children) return [];
  const columns = children.find(c => c.id === `${id}:columns`);
  if (!columns?.children) return [];
  return columns.children.map(c => {
    return {
      key: c.name,
      label: c.label,
      value: (row: Record<string, any>) => (
        <ClResultCell fieldKey={c.name} value={row[c.name || '']} />
      ),
      minWidth: 120,
    } as TableColumn<Record<string, any>>;
  });
});

const tableData = computed<Record<string, any>[]>(() => {
  return state.tablePreviewData || [];
});

const tablePagination = computed<TablePagination>(
  () => state.tablePreviewPagination
);

const tableTotal = computed<number>(() => state.tablePreviewTotal);

const onTablePaginationChange = (pagination: TablePagination) => {
  store.commit(`${ns}/setTablePreviewPagination`, pagination);
  getTablePreview();
};

const resetTablePreview = () => {
  activeNavItem.value = undefined;
  activeContextMenuNavItem.value = undefined;
  contextMenuVisibleMap.value = {};
  store.commit(`${ns}/setTablePreviewData`, []);
  store.commit(`${ns}/setTablePreviewTotal`, 0);
  store.commit(`${ns}/setTablePreviewPagination`, {
    page: 1,
    size: 10,
  });
};

watch(activeId, () => {
  updateMetadata();
  resetTablePreview();
});
onBeforeMount(updateMetadata);
onBeforeUnmount(() => {
  store.commit(`${ns}/setMetadata`, []);
  resetTablePreview();
});

defineOptions({ name: 'ClDatabaseDetailTabDatabases' });
</script>

<template>
  <div class="database-detail-tab-databases">
    <div class="sidebar">
      <el-scrollbar>
        <el-tree
          ref="treeRef"
          node-key="id"
          :data="treeItems"
          :expand-on-click-node="false"
          highlight-current
          @node-click="onNodeClick"
          @node-contextmenu="onContextMenuClick"
        >
          <template #default="{ data }">
            <cl-context-menu
              :visible="isContextMenuVisible(data.id)"
              :style="{ flex: 1, paddingRight: '10px' }"
            >
              <template #reference>
                <div class="node-wrapper" :title="data.label">
                  <span class="icon-wrapper">
                    <cl-icon :icon="data.icon" />
                  </span>
                  <span class="label">{{ data.label }}</span>
                  <span v-if="data.data_type" class="data-type">
                    {{ data.data_type }}
                  </span>
                </div>
                <div class="actions">
                  <cl-icon
                    :icon="['fa', 'ellipsis']"
                    @click="(event: MouseEvent) => onActionsClick(data, event)"
                  />
                </div>
              </template>
              <cl-context-menu-list
                v-if="isContextMenuVisible(data.id)"
                :items="contextMenuItems"
                @hide="onContextMenuHide(data.id)"
              />
            </cl-context-menu>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="content">
      <template v-if="activeNavItem?.type === 'table'">
        <cl-table
          :loading="tablePreviewLoading"
          :key="JSON.stringify(activeNavItem)"
          :row-key="(row: Record<string, any>) => JSON.stringify(row)"
          :columns="tableColumns"
          :data="tableData"
          :page="tablePagination.page"
          :page-size="tablePagination.size"
          :total="tableTotal"
          @pagination-change="onTablePaginationChange"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.database-detail-tab-databases {
  display: flex;
  height: calc(100vh - 64px - 40px - 41px - 50px);
  width: 100%;

  &:deep(.el-table--border:before),
  &:deep(.el-table--border .el-table__inner-wrapper:after),
  &:deep(.el-table__border-left-patch) {
    background-color: transparent !important;
  }

  .sidebar {
    flex: 0 0 240px;
    height: 100%;
    overflow: auto;
    border-right: 1px solid var(--el-border-color);

    .el-tree {
      min-width: fit-content;

      &:deep(.el-tree-node__content:hover) {
        .actions {
          display: flex !important;
        }
      }

      &:deep(.el-tree-node__content) {
        width: 100%;
        position: relative;

        .node-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;

          .icon-wrapper {
            width: 20px;
            display: flex;
          }

          .label {
            flex: 0 0 auto;
          }

          .data-type {
            font-size: 11px;
            line-height: 100%;
            color: var(--cl-info-medium-color);
            margin-left: 5px;
          }
        }

        .actions {
          display: none;
          position: absolute;
          top: 0;
          right: 5px;
          height: 100%;
          align-items: center;
        }
      }
    }
  }

  .content {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;

    .table {
      width: 100%;
      height: 100%;

      &:deep(.table-footer) {
        border-top: 1px solid var(--el-border-color);
      }
    }
  }
}
</style>
