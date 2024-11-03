<script setup lang="tsx">
import { computed, h, onBeforeUnmount, onMounted, PropType, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { getIconByAction, translate } from '@/utils';
import useRequest from '@/services/request';
import { ClNavLink, ClButton, ClNodeType, useNode } from '@/components';
import { ACTION_INSTALL, ACTION_UNINSTALL } from '@/constants';

const props = defineProps<{
  lang: string;
  pathFunc: (name: string) => string;
  icon: string[];
}>();

const t = translate;

const endpointS = '/deps/settings';
const endpointT = '/deps/tasks';
const endpoint = computed<string>(() => `/deps/lang/${props.lang}`);

const { get, getList: getList_, post } = useRequest();

const store = useStore();

const viewMode = ref('installed');

const installed = computed(() => viewMode.value === 'installed');

const allNodes = computed<CNode[]>(() => store.state.node.allList);

const { allDict: allNodeDict } = useNode(store);

// const allNodeDict = computed<Map<string, CNode>>(() => {
//   const dict = new Map<string, CNode>();
//   allNodes.value.forEach(node => {
//     dict.set(node._id!, node);
//   });
//   console.debug(dict);
//   return dict;
// });

const runningTaskList = ref<TableData<DependencyTask>>([]);
const runningTaskTotal = ref(0);

const getRunningTaskList = async () => {
  const res = await getList_(`${endpointT}`, {
    all: true,
    conditions: [
      {
        key: 'type',
        op: 'eq',
        value: props.lang,
      },
      {
        key: 'status',
        op: 'eq',
        value: 'running',
      },
    ],
  });
  const { data, total } = res;
  runningTaskList.value = data || [];
  runningTaskTotal.value = total || 0;
};

let runningTaskHandle: any;

onMounted(() => {
  getRunningTaskList();
  runningTaskHandle = setInterval(getRunningTaskList, 5000);
});

onBeforeUnmount(() => {
  clearInterval(runningTaskHandle);
});

const setting = ref({});

const getSetting = async () => {
  const res = await get(`${endpointS}`, {
    conditions: [
      {
        key: 'key',
        op: 'eq',
        value: props.lang,
      },
    ],
  });
  const { data } = res;
  if (data && data.length > 0) {
    setting.value = data[0];
  }
};

onMounted(getSetting);

const updateTooltip = computed(() => {
  return t('common.actions.update');
});

const installForm = ref<DependencyInstallForm>({
  names: [],
  nodes: [],
});

const uninstallForm = ref<DependencyUninstallForm>({
  names: [],
  nodes: [],
});

const isUninstallable = (dep: DependencyRepo) => {
  let node_ids = [];
  if (installed.value) {
    node_ids = dep.node_ids || [];
  } else {
    return false;
  }
  return node_ids.length > 0;
};

const tableColumns = computed<TableColumns<DependencyRepo>>(() => {
  return [
    {
      key: 'name',
      label: t('views.env.deps.dependency.form.name'),
      icon: ['fa', 'font'],
      width: '200',
      value: (row: DependencyRepo) => (
        <ClNavLink label={row.name} path={props.pathFunc(row.name!)} external />
      ),
    },
    {
      key: 'versions',
      label: t('views.env.deps.dependency.form.installedVersion'),
      icon: ['fa', 'tag'],
      width: '200',
      value: (row: DependencyRepo) => (
        <span style={{ marginRight: '5px' }}>{row.versions?.join(', ')}</span>
      ),
    },
    {
      key: 'node_ids',
      label: t('views.env.deps.dependency.form.installedNodes'),
      icon: ['fa', 'server'],
      width: '580',
      value: (row: DependencyRepo) =>
        row.node_ids?.map(id => {
          const node = allNodeDict.value.get(id);
          return node ? (
            <ClNodeType isMaster={node.is_master} label={node.name}>
              {{
                tooltip: () => (
                  <>
                    <div>
                      <label>{t('components.node.form.name')}: </label>
                      <span>{node.name}</span>
                    </div>
                    <div>
                      <label>{t('components.node.form.type')}: </label>
                      <span>
                        {node.is_master
                          ? t('components.node.nodeType.label.master')
                          : t('components.node.nodeType.label.worker')}
                      </span>
                    </div>
                  </>
                ),
              }}
            </ClNodeType>
          ) : (
            ''
          );
        }),
    },
    {
      key: 'actions',
      label: t('components.table.columns.actions'),
      fixed: 'right',
      width: '200',
      buttons: (_: DependencyRepo) => [
        {
          tooltip: t('common.actions.install'),
          onClick: async row => {
            installForm.value.names = [row.name];
            dialogVisible.value.install = true;
          },
          action: ACTION_INSTALL,
        },
        {
          tooltip: t('common.actions.uninstall'),
          disabled: row => !isUninstallable(row),
          onClick: async row => {
            uninstallForm.value.node_ids = row.node_ids || [];
            uninstallForm.value.names = [row.name];
            dialogVisible.value.uninstall = true;
          },
          action: ACTION_UNINSTALL,
        },
      ],
      disableTransfer: true,
    },
  ] as TableColumns<DependencyRepo>;
});

const tableData = ref<TableData<DependencyRepo>>([]);

const tablePagination = ref({
  page: 1,
  size: 10,
});

const tableTotal = ref(0);

const tableActionsPrefix = ref([
  {
    buttonType: 'fa-icon',
    label: t('common.actions.install'),
    tooltip: t('common.actions.install'),
    icon: ['fa', 'download'],
    type: 'primary',
    disabled: () => !installForm.value.names?.length,
    onClick: () => {
      dialogVisible.value.install = true;
    },
  },
  {
    buttonType: 'fa-icon',
    label: t('common.actions.uninstall'),
    tooltip: t('common.actions.uninstall'),
    icon: ['fa', 'trash-alt'],
    type: 'danger',
    disabled: () => !installed.value || !uninstallForm.value.names?.length,
    onClick: () => {
      dialogVisible.value.uninstall = true;
    },
  },
]);

const loading = ref(false);

const updateInstalledLoading = ref(false);

const getList = async () => {
  loading.value = true;
  try {
    if (!searchQuery.value && !installed.value) {
      tableData.value = [];
      tableTotal.value = 0;
      return;
    }
    const params = {
      ...tablePagination.value,
      query: searchQuery.value,
      installed: installed.value,
    };
    const res = await getList_(`${endpoint.value}`, params);
    if (!res) {
      tableData.value = [];
      tableTotal.value = 0;
    }
    const { data, total } = res;
    tableData.value = data || [];
    tableTotal.value = total;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const update = async () => {
  updateInstalledLoading.value = true;
  try {
    await post(`${endpoint.value}/update`);
  } finally {
    updateInstalledLoading.value = false;
    await getList();
  }
};

const actionFunctions = ref({
  getList,
  setPagination: (pagination: TablePagination) => {
    tablePagination.value = { ...pagination };
  },
});

const searchQuery = ref();

const dialogVisible = ref<{ [key: string]: boolean }>({
  install: false,
  uninstall: false,
  tasks: false,
});

const onDialogOpen = (key: string) => {
  dialogVisible.value[key] = true;
};

const onSearch = async () => {
  await actionFunctions.value.getList();
};

const onSearchClear = async () => {
  await actionFunctions.value.getList();
};

const onUpdate = async () => {
  await update();
};

const onInstalledChange = async () => {
  await actionFunctions.value.getList();
};

const onSelect = (rows: TableData<Dependency>) => {
  installForm.value.names = rows.map(d => d.name || '');
  uninstallForm.value.names = rows.map(d => d.name || '');
};

const onDialogClose = (key: string) => {
  dialogVisible.value[key] = false;
};

const onInstall = async (data: DependencyInstallForm) => {
  await post(`${endpoint.value}/install`, data);
  await actionFunctions.value.getList();
  onDialogClose('install');
};

const onUninstall = async (data: DependencyUninstallForm) => {
  await post(`${endpoint.value}/uninstall`, data);
  await actionFunctions.value.getList();
  onDialogClose('uninstall');
};

onMounted(() => store.dispatch(`node/getAllList`));
defineOptions({ name: 'ClDependencyLang' });
</script>

<template>
  <cl-list-layout
    v-loading="loading"
    class="dependency-list"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :table-pagination="tablePagination"
    :action-functions="actionFunctions"
    :visible-buttons="['export', 'customize-columns']"
    table-pagination-layout="total, prev, pager, next"
    :table-actions-prefix="tableActionsPrefix"
    :row-key="({ name, versions, node_ids }: DependencyRepo) =>
        [name, JSON.stringify(versions), JSON.stringify(node_ids), JSON.stringify(allNodes?.map(n => n._id))].join('_')"
    @select="onSelect"
  >
    <template #nav-actions-extra>
      <div class="top-bar">
        <div class="top-bar-left">
          <el-input
            class="search-query"
            v-model="searchQuery"
            :placeholder="t('views.env.deps.common.actions.searchDependencies')"
            :prefix-icon="Search"
            clearable
            @keyup.enter="onSearch"
            @clear="onSearchClear"
          />
          <cl-label-button
            class="search-btn"
            :icon="['fa', 'search']"
            :placeholder="t('common.search')"
            :disabled="!installed ? !searchQuery : false"
            @click="onSearch"
          />
          <el-radio-group
            class="view-mode"
            v-model="viewMode"
            @change="onInstalledChange"
          >
            <el-radio-button label="installed">
              <font-awesome-icon
                :icon="['fa', 'check']"
                style="margin-right: 5px"
              />
              {{ t('views.env.deps.common.status.installed') }}
            </el-radio-button>
            <el-radio-button label="installable">
              <font-awesome-icon :icon="icon" style="margin-right: 5px" />
              {{ t('views.env.deps.common.status.installable') }}
            </el-radio-button>
          </el-radio-group>
          <cl-button
            class-name="tasks-btn"
            :type="runningTaskTotal === 0 ? 'primary' : 'warning'"
            @click="() => onDialogOpen('tasks')"
          >
            <font-awesome-icon
              :icon="
                runningTaskTotal === 0 ? ['fa', 'tasks'] : ['fa', 'spinner']
              "
              :spin="runningTaskTotal > 0"
              style="margin-right: 5px"
            />
            {{
              runningTaskTotal === 0
                ? t('views.env.deps.task.tasks')
                : `${t('views.env.deps.task.tasks')} (${runningTaskTotal})`
            }}
          </cl-button>
          <cl-fa-icon-button
            class-name="update-btn"
            type="primary"
            :tooltip="updateTooltip"
            :icon="updateInstalledLoading ? ['fa', 'spinner'] : ['fa', 'sync']"
            :spin="updateInstalledLoading"
            :disabled="updateInstalledLoading"
            @click="onUpdate"
          />
        </div>
      </div>
    </template>
  </cl-list-layout>
  <cl-install-form
    :visible="dialogVisible.install"
    :lang="lang"
    :nodes="allNodes"
    :names="installForm.names"
    @confirm="onInstall"
    @close="() => onDialogClose('install')"
  />
  <cl-uninstall-form
    :visible="dialogVisible.uninstall"
    :nodes="uninstallForm.nodes"
    :names="uninstallForm.names"
    @confirm="onUninstall"
    @close="() => onDialogClose('uninstall')"
  />
</template>

<style scoped>
.search-query {
  width: 300px;
  margin-right: 10px;
}

.top-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.top-bar > * {
  display: flex;
  align-items: center;
}

.top-bar:deep(.search-btn) {
  margin-right: 0;
}

.top-bar:deep(.update-btn),
.top-bar:deep(.view-mode),
.top-bar:deep(.tasks-btn) {
  margin-left: 10px;
  margin-right: 0;
}

.top-bar .pagination {
  /*width: 100%;*/
  text-align: right;
}

.dependency-list:deep(.node-type) {
  margin-right: 10px;
}
</style>
