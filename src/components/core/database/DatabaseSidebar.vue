<script setup lang="tsx">
import {
  ref,
  computed,
  watch,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
import {
  ElTree,
  ElInput,
  ElForm,
  ElFormItem,
  ElMessageBox,
  ElMessage,
} from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { debounce } from 'lodash';
import type {
  FilterNodeMethodFunction,
  TreeNodeData,
} from 'element-plus/es/components/tree/src/tree.type';
import {
  TAB_NAME_COLUMNS,
  TAB_NAME_CONSOLE,
  TAB_NAME_DATA,
  TAB_NAME_DATABASES,
  TAB_NAME_INDEXES,
} from '@/constants';
import { plainClone, selectElement, translate } from '@/utils';
import { useDatabaseDetail } from '@/views';
import useRequest from '@/services/request';
import { getTableManipulationStatementsByDataSource } from '@/utils/database';
import { useRouter } from 'vue-router';
import type { ContextMenuItem } from '@/components/ui/context-menu/types';

const props = defineProps<{
  tabName: string;
}>();

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const { activeId } = useDatabaseDetail();

const { post, del } = useRequest();

const router = useRouter();

const treeRef = ref<InstanceType<typeof ElTree>>();
const searchKeyword = ref('');
const showSearch = ref(false);
const computedTreeItems = computed<DatabaseNavItem[]>(() => {
  const { metadata } = state;
  if (!metadata?.databases) return [] as DatabaseNavItem[];
  return metadata.databases.map(db => {
    return {
      id: `${db.name}`,
      name: db.name,
      label: `${db.name} (${db.tables?.length || 0})`,
      icon: ['fa', 'database'],
      type: 'database',
      data: db,
      children: db.tables?.map(tbl => {
        return {
          id: `${db.name}:${tbl.name}`,
          name: tbl.name,
          label: tbl.name,
          icon: ['fa', 'table'],
          type: 'table',
          database: db.name,
          data: tbl,
          children: [
            {
              id: `${db.name}:${tbl.name}:columns`,
              label: `${t('components.database.databases.labels.columns')} (${tbl.columns?.length || 0})`,
              icon: ['fa', 'columns'],
              type: 'columns',
              children: tbl.columns?.map(col => {
                return {
                  id: `${db.name}:${tbl.name}:columns:${col.name}`,
                  name: col.name,
                  label: col.name,
                  icon: ['fa', 'tag'],
                  type: 'column',
                  data_type: col.type,
                  data: col,
                } as DatabaseNavItem<DatabaseColumn>;
              }),
            },
            {
              id: `${db.name}:${tbl.name}:indexes`,
              label: `${t('components.database.databases.labels.indexes')} (${tbl.indexes?.length || 0})`,
              icon: ['fa', 'key'],
              type: 'indexes',
              children: tbl.indexes?.map(idx => {
                return {
                  id: `${db.name}:${tbl.name}:indexes:${idx.name}`,
                  name: idx.name,
                  label: idx.name,
                  icon: ['fa', 'key'],
                  type: 'index',
                  data: idx,
                };
              }),
            },
          ],
        } as DatabaseNavItem<DatabaseTable>;
      }),
    };
  }) as DatabaseNavItem<DatabaseDatabase>[];
});
const treeItems = ref<DatabaseNavItem[]>([]);
watch(
  () => state.metadata,
  () => {
    treeItems.value = plainClone(computedTreeItems.value);
  }
);

const activeDatabaseName = computed(() => state.activeDatabaseName);

const activeNavItem = computed(() => state.activeNavItem);
watch(
  () => state.activeNavItem?.new,
  async () => {
    // update the id of the active node
    if (state.activeNavItem?.new === false) {
      await getMetadata();
      await selectNode(state.activeNavItem);
    }
  }
);

const onSearchFilter: FilterNodeMethodFunction = (value, data) => {
  if (!value) return true;
  return data.label.toLowerCase().includes(value.toLowerCase());
};

const debouncedFilter = debounce(() => {
  treeRef.value?.filter(searchKeyword.value);
}, 300);

watch(searchKeyword, debouncedFilter);

const getMetadata = async () => {
  await store.dispatch(`${ns}/getMetadata`, { id: activeId.value });
};

const createTable = async () => {
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
    ) as TreeNode;
    treeRef.value?.insertBefore(newNode, firstTableNode);
  } else {
    treeRef.value?.append(newNode, databaseNode.id);
  }
  await selectNode(newNode);
  const input = await selectElement(
    `#edit-input-${normalizeElementId(newNode.id)}`
  );
  if (input instanceof HTMLInputElement) {
    input.focus();
  }
};

const activeContextMenuNavItem = ref<DatabaseNavItem>();
const contextMenuVisibleMap = ref<Record<string, boolean>>({});
const isContextMenuVisible = (id: string) => {
  if (!contextMenuItems.value?.length) return false;
  if (!activeContextMenuNavItem.value) return false;
  if (activeContextMenuNavItem.value?.id !== id) return false;
  return contextMenuVisibleMap.value[id] || false;
};
const onActionsClick = (item: DatabaseNavItem) => {
  activeContextMenuNavItem.value = item;
  contextMenuVisibleMap.value[item.id] = true;
};

const onContextMenuHide = (id: string) => {
  activeContextMenuNavItem.value = undefined;
  contextMenuVisibleMap.value[id] = false;
};
const contextMenuItems = computed<ContextMenuItem[]>(() => {
  switch (props.tabName) {
    case TAB_NAME_DATABASES:
      return contextMenuItemsDatabases.value;
    case TAB_NAME_CONSOLE:
      return contextMenuItemsConsole.value;
    default:
      return [];
  }
});
const contextMenuItemsDatabases = computed<ContextMenuItem[]>(() => {
  if (!activeContextMenuNavItem.value) return [];
  const { id, type } = activeContextMenuNavItem.value;
  if (!contextMenuVisibleMap.value[id]) return [];
  switch (type) {
    case 'database':
      return [
        {
          title: t('views.database.databases.actions.createTable'),
          icon: ['fa', 'table'],
          action: createTable,
        },
      ];
    case 'table':
      return [
        {
          title: t('common.actions.previewData'),
          icon: ['fa', 'table'],
          action: async () => {
            await selectNode(activeContextMenuNavItem.value as DatabaseNavItem);
            await store.dispatch(`${ns}/getTablePreview`, {
              id: activeId.value,
              table: activeNavItem.value?.name,
            });
          },
        },
        {
          title: t('components.database.databases.table.actions.editColumns'),
          icon: ['fa', 'columns'],
          action: async () => {
            await selectNode(
              activeContextMenuNavItem.value as DatabaseNavItem,
              TAB_NAME_COLUMNS
            );
          },
        },
        {
          title: t('components.database.databases.table.actions.editIndexes'),
          icon: ['fa', 'key'],
          action: async () => {
            await selectNode(
              activeContextMenuNavItem.value as DatabaseNavItem,
              TAB_NAME_INDEXES
            );
          },
        },
        {
          title: t('common.actions.rename'),
          icon: ['fa', 'edit'],
          action: async () => {
            await selectNode(activeContextMenuNavItem.value as DatabaseNavItem);
            const id = activeNavItem.value?.id as string;
            const node = treeRef.value?.getNode(id) as TreeNodeData;
            node.data.edit = true;
            node.data.edit_name = node.data.label;
            const input = await selectElement(
              `#edit-input-${normalizeElementId(id)}`
            );
            if (input instanceof HTMLInputElement) {
              input.focus();
            }
          },
        },
        {
          title: t('common.actions.drop'),
          icon: ['fa', 'trash'],
          action: async () => {
            switch (activeContextMenuNavItem.value?.type) {
              case 'table':
                await selectNode(activeContextMenuNavItem.value);
                const tableName = activeNavItem.value?.data?.name;
                const { value: promptTableName } = await ElMessageBox.prompt(
                  t(
                    'components.database.messageBox.prompt.dropTable.message',
                    null,
                    {
                      tableName,
                    }
                  ),
                  t('components.database.messageBox.prompt.dropTable.title'),
                  {
                    type: 'warning',
                    inputPlaceholder: t(
                      'components.database.messageBox.prompt.dropTable.placeholder',
                      null,
                      {
                        tableName,
                      }
                    ),
                    confirmButtonClass: 'el-button--danger',
                  }
                );
                if (!promptTableName || promptTableName !== tableName) {
                  ElMessage.error(
                    t('components.database.messageBox.prompt.dropTable.error')
                  );
                  return;
                }
                await del(`/databases/${activeId.value}/tables/drop`, {
                  database_name: activeDatabaseName.value,
                  table_name: tableName,
                });
                store.commit(`${ns}/setActiveNavItem`, undefined);
                await getMetadata();
                break;
            }
          },
        },
      ];
    case 'columns':
    case 'column':
      return [
        {
          title: t('components.database.databases.table.actions.editColumns'),
          icon: ['fa', 'columns'],
          action: async () => {
            await selectNode(
              activeContextMenuNavItem.value as DatabaseNavItem,
              TAB_NAME_COLUMNS
            );
          },
        },
      ];
    case 'indexes':
    case 'index':
      return [
        {
          title: t('components.database.databases.table.actions.editIndexes'),
          icon: ['fa', 'key'],
          action: async () => {
            await selectNode(
              activeContextMenuNavItem.value as DatabaseNavItem,
              TAB_NAME_INDEXES
            );
          },
        },
      ];
    default:
      return [];
  }
});
const contextMenuItemsConsole = computed<ContextMenuItem[]>(() => {
  if (!activeContextMenuNavItem.value) return [];

  // Get type and name
  const { type, name } = activeContextMenuNavItem.value;

  // Existing console content
  const consoleContent = state.consoleContent
    ? state.consoleContent + '\n'
    : '';

  // Initialize context menu items
  const items: ContextMenuItem[] = [];

  switch (type) {
    case 'database':
      const { create } = getTableManipulationStatementsByDataSource(
        state.form.data_source || 'mongo'
      );
      if (create) {
        items.push({
          title: t('views.database.databases.actions.createTable'),
          icon: ['fa', 'table'],
          action: () => {
            store.commit(`${ns}/setConsoleContent`, consoleContent + create);
          },
        });
      }
      return items;
    case 'table':
      const { select, truncate, drop } =
        getTableManipulationStatementsByDataSource(
          state.form.data_source || 'mongo',
          name
        );
      if (select) {
        items.push({
          title: t('common.actions.previewData'),
          icon: ['fa', 'table'],
          action: () => {
            store.commit(`${ns}/setConsoleContent`, consoleContent + select);
          },
        });
      }
      if (truncate) {
        items.push({
          title: t('components.database.databases.table.actions.truncate'),
          icon: ['fa', 'eraser'],
          action: () => {
            store.commit(`${ns}/setConsoleContent`, consoleContent + truncate);
          },
        });
      }
      if (drop) {
        items.push({
          title: t('components.database.databases.table.actions.drop'),
          icon: ['fa', 'trash'],
          action: () => {
            store.commit(`${ns}/setConsoleContent`, consoleContent + drop);
          },
        });
      }
      return items;
    case 'column':
      return [];
    case 'index':
      return [];
    default:
      return [];
  }
});

const defaultExpandedKeys = ref<string[]>([]);
const onNodeExpand = (node: TreeNodeData) => {
  defaultExpandedKeys.value.push(node.id);
};
const onNodeCollapse = (node: TreeNodeData) => {
  const idx = defaultExpandedKeys.value.findIndex(id => id === node.id);
  defaultExpandedKeys.value.splice(idx, 1);
};

const newTableNode = (): DatabaseNavItem<DatabaseTable> => {
  const name = '';
  const tableId = Math.round(Math.random() * 1e8).toString();
  return {
    id: `${activeDatabaseName.value}:${tableId}`,
    label: name,
    type: 'table',
    icon: ['fa', 'table'],
    new: true,
    edit: true,
    edit_name: name,
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
    action: createTable,
  },
];

const getNodeIdParts = (id: string) => {
  const idParts = id.split(':') || [];
  const databaseName = idParts[0];
  const database = treeItems.value?.find(d => d.name === databaseName);
  const tableName = idParts[1];
  const table = database?.children?.find(t => t.name === tableName);
  return {
    databaseName,
    database,
    tableName,
    table,
  };
};

const selectNode = async (data: DatabaseNavItem, tabName?: string) => {
  const { id } = data;

  switch (props.tabName) {
    case TAB_NAME_DATABASES:
      selectNodeDatabases(data, tabName);
      break;
  }

  // highlight current node
  setTimeout(() => {
    treeRef.value?.setCurrentKey(id);
  }, 0);
};

const selectNodeDatabases = (data: DatabaseNavItem, tabName?: string) => {
  const { id, type, new: isNew } = data;
  const { databaseName, table } = getNodeIdParts(id);
  store.commit(`${ns}/setActiveDatabaseName`, databaseName);
  switch (type) {
    case 'table':
      store.commit(
        `${ns}/setDefaultTabName`,
        tabName || (!isNew ? TAB_NAME_DATA : TAB_NAME_COLUMNS)
      );
      store.commit(`${ns}/setActiveNavItem`, data);
      break;
    case 'columns':
    case 'column':
      store.commit(`${ns}/setDefaultTabName`, tabName || TAB_NAME_COLUMNS);
      store.commit(`${ns}/setActiveNavItem`, table);
      break;
    case 'indexes':
    case 'index':
      store.commit(`${ns}/setDefaultTabName`, tabName || TAB_NAME_INDEXES);
      store.commit(`${ns}/setActiveNavItem`, table);
      break;
    default:
      store.commit(`${ns}/setActiveNavItem`, data);
  }
};

const onNodeClick = async (data: DatabaseNavItem) => {
  await selectNode(data);
};

const onNodeCancel = async (data: DatabaseNavItem) => {
  if (!data.new) {
    data.edit = false;
    return;
  }
  const node = treeRef.value?.getNode(data.id);
  if (!node) return;
  treeRef.value?.remove(node);
  switch (data.type) {
    case 'table':
      const { data: parentData } =
        treeRef.value?.getNode(activeDatabaseName.value as string) || {};
      if (parentData) {
        await selectNode(parentData as DatabaseNavItem);
      }
  }
};

const onContextMenuClick = (event: MouseEvent, data: DatabaseNavItem) => {
  event.stopPropagation();
  activeContextMenuNavItem.value = data;
  contextMenuVisibleMap.value[data.id] = true;
};

const onRefresh = () => {
  getMetadata();
};

const onSearchClick = () => {
  showSearch.value = !showSearch.value;
};

const onClickTerminal = () => {
  reset();
  router.push(`/databases/${activeId.value}/console`);
};

const reset = () => {
  store.commit(`${ns}/setActiveNavItem`, undefined);
  activeContextMenuNavItem.value = undefined;
  contextMenuVisibleMap.value = {};
  store.commit(`${ns}/setTablePreviewData`, []);
  store.commit(`${ns}/setTablePreviewTotal`, 0);
  store.commit(`${ns}/setTablePreviewPagination`, {
    page: 1,
    size: 10,
  });
};

const normalizeElementId = (id: string) => {
  return id.replaceAll(':', '_');
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

defineExpose({ treeRef, selectNode });

defineOptions({ name: 'ClDatabaseSidebar' });

const formRef = ref<FormInstance>();
const formRules = ref<FormRules>({
  edit_name: [
    {
      required: true,
      message: t('common.validate.cannotBeEmpty'),
      trigger: 'blur',
    },
  ],
});

const renameTable = async (data: DatabaseNavItem) => {
  await ElMessageBox.confirm(
    t('components.database.messageBox.confirm.renameTable.message'),
    t('components.database.messageBox.confirm.renameTable.title'),
    {
      type: 'warning',
    }
  );

  data.loading = true;
  try {
    await post(`/databases/${activeId.value}/tables/rename`, {
      database_name: activeDatabaseName.value,
      table_name: data.data.name,
      new_table_name: data.edit_name,
    });
    ElMessage.success(t('common.message.success.action'));
  } catch (error) {
    ElMessage.error(t('common.message.error.action'));
    throw error;
  } finally {
    data.loading = false;
  }
};

const validateAndSave = async (data: DatabaseNavItem) => {
  if (!formRef.value) return;

  try {
    // validate form
    await formRef.value.validate();

    // switch off edit mode
    data.edit = false;

    if (data.data.name !== data.edit_name) {
      const id = activeNavItem.value?.id as string;
      const node = treeRef.value?.getNode(id) as TreeNodeData;
      if (!node.data.new) {
        await renameTable(data);
      }

      // set name
      data.label = data.edit_name;
      data.data.name = data.edit_name;
    }

    store.commit(`${ns}/setActiveNavItem`, {
      ...data,
    });
  } catch (error) {
    console.error('Validation failed', error);
  }
};

const widthKey = ref('database.sidebar.width');
const sidebarRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div ref="sidebarRef" class="sidebar" @dragover.prevent>
    <cl-resize-handle :target-ref="sidebarRef" :size-key="widthKey" />
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
      <cl-icon :icon="['fas', 'terminal']" @click="onClickTerminal" />
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
            if (_data.updated) return 'updated';
            return '';
          },
        }"
        :filter-node-method="onSearchFilter"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandedKeys"
        highlight-current
        @node-click="onNodeClick"
        @node-contextmenu="onContextMenuClick"
        @node-expand="onNodeExpand"
        @node-collapse="onNodeCollapse"
      >
        <template #default="{ data }">
          <cl-context-menu
            :visible="isContextMenuVisible(data.id)"
            :style="{ flex: 1, paddingRight: '5px' }"
          >
            <template #reference>
              <div class="node-wrapper" :title="data.label">
                <span class="icon-wrapper">
                  <cl-icon
                    v-if="data.loading"
                    :icon="['fa', 'spinner']"
                    spinning
                  />
                  <cl-icon v-else :icon="data.icon" />
                </span>
                <template v-if="!data.edit">
                  <span class="label">
                    {{ data.label }}
                  </span>
                  <span v-if="data.data_type" class="data-type">
                    {{ data.data_type }}
                  </span>
                </template>
                <template v-else>
                  <div class="edit-wrapper">
                    <el-form
                      ref="formRef"
                      :model="data"
                      :rules="formRules"
                      @submit.prevent="validateAndSave(data)"
                    >
                      <el-form-item prop="edit_name">
                        <el-input
                          :id="`edit-input-${normalizeElementId(data.id)}`"
                          v-model="data.edit_name"
                          size="small"
                          :placeholder="
                            t('components.database.databases.table.create.name')
                          "
                          @keyup.enter="validateAndSave(data)"
                        />
                      </el-form-item>
                    </el-form>
                    <div class="edit-actions">
                      <cl-icon
                        :icon="['fa', 'check']"
                        @click.stop="validateAndSave(data)"
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
                <template v-if="!data.edit">
                  <cl-icon
                    class="more"
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
</template>

<style scoped>
.sidebar {
  flex: 0 0 240px;
  height: 100%;
  overflow: auto;
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  position: relative;

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

    &:deep(.el-tree-node.new .el-tree-node__content) {
      color: var(--cl-success-color);
    }

    &:deep(.el-tree-node.updated .el-tree-node__content) {
      color: var(--cl-primary-color);
    }

    &:deep(.el-tree-node__content:hover .actions .icon) {
      display: flex !important;
    }

    &:deep(.el-tree-node__content) {
      width: 100%;
      position: relative;

      .node-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;

        .el-form {
          display: inline-block;
          margin-right: 8px;
        }

        .el-form-item {
          margin-bottom: 0;
        }

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
        display: flex;
        gap: 5px;
        position: absolute;
        top: 0;
        right: 5px;
        height: 100%;
        align-items: center;

        &:deep(.icon.more) {
          display: none;
        }
      }
    }
  }
}
</style>
