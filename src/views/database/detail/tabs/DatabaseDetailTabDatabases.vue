<script setup lang="tsx">
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import {
  ElInput,
  ElTree,
  ElForm,
  ElFormItem,
  FormInstance,
  FormRules,
} from 'element-plus';
import type {
  FilterNodeMethodFunction,
  FilterValue,
  TreeNodeData,
} from 'element-plus/es/components/tree/src/tree.type';
import { debounce } from 'lodash';
import { useDatabaseDetail } from '@/views';
import { translate } from '@/utils';
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

const sidebarRef = ref<InstanceType<typeof DatabaseSidebar>>();

const treeItems = computed<DatabaseNavItem[]>(() => {
  const { metadata } = state;
  if (!metadata?.databases) return [] as DatabaseNavItem[];
  return metadata.databases.map(d => {
    return {
      id: `${d.name}`,
      name: d.name,
      label: d.name,
      icon: ['fa', 'database'],
      type: 'database',
      data: d,
      children: d.tables?.map(t => {
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
  await selectNode(data);
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
    sidebarRef.value?.treeRef?.setCurrentKey(id);
  }, 0);
};

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

const validateAndSave = async (data: DatabaseNavItem) => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    data.label = data.edit_name;
    data.edit = false;
  } catch (error) {
    console.error('Validation failed', error);
  }
};

const onNodeCancel = async (data: DatabaseNavItem) => {
  if (!data.new) return;
  const node = sidebarRef.value?.treeRef?.getNode(data.id);
  if (!node) return;
  sidebarRef.value?.treeRef?.remove(node);
  switch (data.type) {
    case 'table':
      const { data: parentData } =
        sidebarRef.value?.treeRef?.getNode(activeDatabaseName.value) || {};
      if (parentData) {
        await selectNode(parentData);
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
  const data = sidebarRef.value?.treeRef?.getNode?.(key)?.data;
  if (!data) return;
  selectNode(data);
};

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
            sidebarRef.value?.treeRef?.setCurrentKey(activeNavItem.value?.id);
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
        const firstTableNode = sidebarRef.value?.treeRef?.getNode(
          databaseNode.children[0].id
        );
        sidebarRef.value?.treeRef?.insertBefore(newNode, firstTableNode);
      } else {
        sidebarRef.value?.treeRef?.append(newNode, databaseNode.id);
      }
      selectNode(newNode);
      nextTick(() => {
        const input = document.querySelector(
          `#edit-input-${normalizeElementId(newNode.id)}`
        );
        if (input instanceof HTMLInputElement) {
          input.focus();
        }
      });
    },
  },
];

const normalizeElementId = (id: string) => {
  return id.replaceAll(':', '_');
};

const onRefresh = () => {
  getMetadata();
};

const onCreateDatabase = () => {
  createContextMenuListItems[0].action();
};

const onCreateTable = () => {
  createContextMenuListItems[1].action();
};

defineOptions({ name: 'ClDatabaseDetailTabDatabases' });
</script>

<template>
  <div class="database-detail-tab-databases">
    <cl-database-sidebar
      ref="sidebarRef"
      :tree-items="treeItems"
      :default-expanded-keys="defaultExpandedKeys"
      @node-click="onNodeClick"
      @context-menu-click="onContextMenuClick"
      @refresh="onRefresh"
      @create-database="onCreateDatabase"
      @create-table="onCreateTable"
    />
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
          @refresh="getMetadata"
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
