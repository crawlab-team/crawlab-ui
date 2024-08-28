<script setup lang="tsx">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useDatabaseDetail } from '@/views';
import { translate } from '@/utils';
import { ElTree } from 'element-plus';
import { debounce } from 'lodash';
import {
  FilterNodeMethodFunction,
  FilterValue,
  TreeNodeData,
} from 'element-plus/es/components/tree/src/tree.type';
import {
  TAB_NAME_COLUMNS,
  TAB_NAME_DATA,
  TAB_NAME_INDEXES,
  TAB_NAME_OVERVIEW,
} from '@/constants';

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
      data: d,
      children: d.tables.map(t => {
        return {
          id: `${d.name}:${t.name}`,
          name: t.name,
          label: t.name,
          icon: ['fa', 'table'],
          type: 'table',
          database: d.name,
          data: t,
          children: [
            {
              id: `${d.name}:${t.name}:columns`,
              label: 'columns',
              icon: ['fa', 'columns'],
              type: 'columns',
              children: t.columns?.map(c => {
                return {
                  id: `${d.name}:${t.name}:columns:${c.name}`,
                  name: c.name,
                  label: c.name,
                  icon: ['fa', 'tag'],
                  type: 'column',
                  data_type: c.type,
                  data: c,
                } as DatabaseNavItem<DatabaseColumn>;
              }),
            },
            {
              id: `${d.name}:${t.name}:indexes`,
              label: 'indexes',
              icon: ['fa', 'key'],
              type: 'indexes',
              children: t.indexes?.map(i => {
                return {
                  id: `${d.name}:${t.name}:indexes:${i.name}`,
                  name: i.name,
                  label: i.name,
                  icon: ['fa', 'key'],
                  type: 'index',
                  data: i,
                };
              }),
            },
          ],
        } as DatabaseNavItem<DatabaseTable>;
      }),
    };
  }) as DatabaseNavItem<DatabaseDatabase>[];
});

const defaultExpandedKeys = ref<string[]>([]);
const getMetadata = async () => {
  await store.dispatch(`${ns}/getMetadata`, { id: activeId.value });
  updateDefaultExpandedKeys();
};
const updateDefaultExpandedKeys = () => {
  console.debug('updateDefaultExpandedKeys');
  if (treeItems.value.length === 1) {
    const currentItem = treeItems.value[0];
    defaultExpandedKeys.value = [currentItem.id];
    selectNode(currentItem);
  } else {
    defaultExpandedKeys.value = [];
  }
};

const activeDatabaseName = ref();
const defaultTabName = ref<string>(TAB_NAME_OVERVIEW);
const activeNavItem = ref<DatabaseNavItem>();
const onNodeClick = async (data: DatabaseNavItem) => {
  return selectNode(data);
};
const selectNode = async (data: DatabaseNavItem) => {
  const { id, type, new: isNew } = data;
  const idParts = id.split(':') || [];
  const databaseName = idParts[0];
  const database = treeItems.value?.find(d => d.name === databaseName);
  const tableName = idParts[1];
  const table = database?.children?.find(t => t.name === tableName);
  activeDatabaseName.value = databaseName;

  switch (type) {
    case 'table':
      defaultTabName.value = !isNew ? TAB_NAME_DATA : TAB_NAME_COLUMNS;
      activeNavItem.value = data;
      break;
    case 'columns':
    case 'column':
      defaultTabName.value = TAB_NAME_COLUMNS;
      activeNavItem.value = table;
      break;
    case 'indexes':
    case 'index':
      defaultTabName.value = TAB_NAME_INDEXES;
      activeNavItem.value = table;
      break;
    default:
      activeNavItem.value = data;
  }

  // highlight current node
  setTimeout(() => {
    treeRef.value?.setCurrentKey(id);
  }, 0);
};
const onNodeCancel = async (data: DatabaseNavItem) => {
  if (!data.new) return;
  const node = treeRef.value?.getNode(data.id);
  if (!node) return;
  treeRef.value?.remove(node);
  switch (data.type) {
    case 'table':
      const { data } = treeRef.value?.getNode(activeDatabaseName.value) || {};
      if (data) {
        await selectNode(data);
      }
  }
};

const onDatabaseTableClick = (
  table: DatabaseTable,
  type: DatabaseTableClickRowType
) => {
  const databaseName = activeNavItem.value?.data.name;
  let key = `${databaseName}:${table.name}`;
  if (type !== 'name') {
    key = `${key}:${type}`;
  }
  const data = treeRef.value?.getNode?.(key)?.data;
  if (!data) return;
  selectNode(data);
};

const treeRef = ref<typeof ElTree>();
const activeContextMenuNavItem = ref<DatabaseNavItem>();
const contextMenuVisibleMap = ref<Record<string, boolean>>({});
const isContextMenuVisible = (id: string) => {
  if (!activeContextMenuNavItem.value) return false;
  if (activeContextMenuNavItem.value.id !== id) return false;
  return contextMenuVisibleMap.value[id] || false;
};
const onActionsClick = (item: DatabaseNavItem) => {
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

const reset = () => {
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
  getMetadata();
  reset();
});
onBeforeMount(getMetadata);
onBeforeUnmount(() => {
  store.commit(`${ns}/setMetadata`, []);
  reset();
});

const newTableNode = (): DatabaseNavItem<DatabaseTable> => {
  const name = '';
  const tableId = Math.round(Math.random() * 1e8).toString();
  return {
    id: `${activeDatabaseName.value}:${tableId}`,
    label: name,
    type: 'table',
    icon: ['fa', 'table'],
    new: true,
    children: [],
    data: {
      name,
      columns: [],
      indexes: [],
    },
  } as DatabaseNavItem<DatabaseTable>;
};

const showCreateContextMenu = ref(false);
const createContextMenuListItems: ContextMenuItem[] = [
  {
    title: t('views.database.databases.actions.createDatabase'),
    icon: ['fa', 'database'],
    action: () => {
      // TODO: implement me
    },
  },
  {
    title: t('views.database.databases.actions.createTable'),
    icon: ['fa', 'table'],
    action: () => {
      // try to select a database first
      let databaseName: string;
      if (activeNavItem.value?.type === 'database') {
        databaseName = activeNavItem.value?.name as string;
      } else if (activeDatabaseName.value) {
        databaseName = activeDatabaseName.value;
      } else {
        databaseName = treeItems.value?.[0]?.name as string;
      }
      const databaseNode = treeItems.value?.find(d => d.name === databaseName);
      if (!databaseNode) return;

      const newNode = newTableNode();
      if (databaseNode?.children?.length) {
        const firstTableNode = treeRef.value?.getNode(
          databaseNode.children[0].id
        );
        treeRef.value?.insertBefore(newNode, firstTableNode);
      } else {
        treeRef.value?.append(newNode, databaseNode);
      }
      selectNode(newNode);
    },
  },
];

const searchKeyword = ref('');
const showSearch = ref(false);
const onSearchClick = () => {
  showSearch.value = !showSearch.value;
};
watch(
  searchKeyword,
  debounce(() => {
    treeRef.value?.filter(searchKeyword.value);
  }, 300)
);
const onSearchFilter: FilterNodeMethodFunction = (
  value: FilterValue,
  data: TreeNodeData
): boolean => {
  if (!value) return true;
  return data.label?.toLowerCase().includes(value.toString().toLowerCase());
};

const onRefresh = async () => {
  await store.dispatch(`${ns}/getMetadata`, { id: activeId.value });
};

defineOptions({ name: 'ClDatabaseDetailTabDatabases' });
</script>

<template>
  <div class="database-detail-tab-databases">
    <div class="sidebar">
      <div class="sidebar-actions">
        <cl-context-menu :visible="showCreateContextMenu">
          <template #reference>
            <cl-icon
              :icon="['fa', 'plus']"
              @click.stop="showCreateContextMenu = true"
            />
          </template>
          <cl-context-menu-list
            v-if="showCreateContextMenu"
            :items="createContextMenuListItems"
            @hide="showCreateContextMenu = false"
          />
        </cl-context-menu>
        <cl-icon :icon="['fa', 'refresh']" @click="onRefresh" />
        <cl-icon
          :class="showSearch ? 'selected' : ''"
          :icon="['fa', 'search']"
          @click="onSearchClick"
        />
        <cl-icon :icon="['fas', 'terminal']" />
      </div>
      <div v-if="showSearch" class="sidebar-search">
        <el-input
          v-model="searchKeyword"
          :placeholder="
            t('views.database.databases.sidebar.search.placeholder')
          "
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
          :filter-node-method="onSearchFilter"
          node-key="id"
          :data="treeItems"
          :expand-on-click-node="false"
          :default-expanded-keys="defaultExpandedKeys"
          highlight-current
          @node-click="onNodeClick"
          @node-contextmenu="onContextMenuClick"
        >
          <template #default="{ data }">
            <cl-context-menu
              :visible="isContextMenuVisible(data.id)"
              :style="{ flex: 1, paddingRight: '5px' }"
            >
              <template #reference>
                <div class="node-wrapper" :title="data.label">
                  <span class="icon-wrapper">
                    <cl-icon :icon="data.icon" />
                  </span>
                  <template v-if="!data.new">
                    <span class="label">
                      {{ data.label }}
                    </span>
                    <span v-if="data.data_type" class="data-type">
                      {{ data.data_type }}
                    </span>
                  </template>
                  <template v-else>
                    <div class="edit-wrapper">
                      <el-input
                        v-model="data.data.name"
                        size="small"
                        :placeholder="
                          t('components.database.databases.table.create.name')
                        "
                      />
                      <div class="edit-actions">
                        <cl-icon
                          :icon="['fa', 'check']"
                          @click.stop="() => {}"
                        />
                        <cl-icon
                          :icon="['fa', 'times']"
                          @click.stop="onNodeCancel(data)"
                        />
                      </div>
                    </div>
                  </template>
                </div>
                <div class="actions" :class="data.new ? 'new' : ''">
                  <template v-if="!data.new">
                    <cl-icon
                      :icon="['fa', 'ellipsis']"
                      @click.stop="onActionsClick(data)"
                    />
                  </template>
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
          :table="activeNavItem?.data"
          :default-tab-name="defaultTabName"
          :is-new="activeNavItem?.new"
          @refresh="onRefresh"
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
    display: flex;
    flex-direction: column;

    .sidebar-actions {
      height: 41px;
      flex: 0 0 41px;
      padding: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--cl-primary-color);
      border-bottom: 1px solid var(--el-border-color);

      & > * {
        display: flex;
        align-items: center;
      }

      &:deep(.icon) {
        cursor: pointer;
        padding: 6px;
        font-size: 14px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }

      &:deep(.icon.selected),
      &:deep(.icon:hover) {
        background-color: var(--cl-primary-plain-color);
      }
    }

    .sidebar-search {
      height: 38px;
      flex: 0 0 38px;
      border-bottom: 1px solid var(--el-border-color);

      &:deep(.el-input .el-input__wrapper) {
        box-shadow: none;
        border: none;
      }
    }

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

          .edit-wrapper {
            display: flex;
            align-items: center;
            gap: 5px;
            flex: 1;

            .edit-actions {
              display: flex;
              gap: 5px;
            }
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

          &.new {
            display: inline-flex;
            gap: 5px;
          }
        }
      }
    }
  }

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
