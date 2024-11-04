import { computed, watch } from 'vue';
import { getStore } from '@/store';
import { useList } from '@/layouts/content';
import {
  getDefaultPagination,
  onListFilterChangeByKey,
  setupListComponent,
  translate,
} from '@/utils';
import {
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_INSTALL,
  ACTION_UNINSTALL,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
} from '@/constants';
import {
  ClDependencyVersions,
  ClNavLink,
  ClNodeType,
  useNode,
} from '@/components';
import { getRepoExternalPath } from '@/utils/dependency';
import { compare, valid } from 'semver';

const t = translate;

const useDependencyList = () => {
  // store
  const ns = 'dependency';
  const store = getStore();
  const { dependency: state, node: nodeState } = store.state as RootStoreState;

  const { allDict: allNodeDict } = useNode(store);

  const navActions = computed<ListActionGroup[]>(() => [
    {
      action: ACTION_FILTER,
      name: 'filter',
      children: [
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-lang',
          className: 'select-lang',
          onChange: value => {
            onListFilterChangeByKey(store, ns, 'type', FILTER_OP_EQUAL)(value);
            store.commit(`${ns}/setLang`, value);
          },
          options: [
            { label: 'Python', value: 'python', icon: ['fab', 'python'] },
            { label: 'Node.js', value: 'node', icon: ['fab', 'node-js'] },
          ],
          noAllOption: true,
        },
      ],
    },
    {
      action: ACTION_FILTER,
      name: 'filter',
      children: [
        {
          action: ACTION_FILTER_SEARCH,
          id: 'filter-search',
          className: 'search',
          placeholder: t('views.env.deps.navActions.filter.search.placeholder'),
          onChange: async value => {
            await updateSearchQuery(value);
          },
          onEnter: async value => {
            await updateSearchQuery(value);
            await Promise.all([
              store.dispatch(`${ns}/getList`),
              store.dispatch(`${ns}/searchRepoList`),
            ]);
          },
        },
        {
          className: 'search-btn',
          buttonType: 'label',
          label: t('common.actions.search'),
          icon: ['fa', 'search'],
          onClick: async () => {
            await Promise.all([
              store.dispatch(`${ns}/getList`),
              store.dispatch(`${ns}/searchRepoList`),
            ]);
          },
        },
      ],
    },
  ]);

  const updateSearchQuery = async (value: any) => {
    await onListFilterChangeByKey(store, ns, 'name', FILTER_OP_CONTAINS, {
      update: false,
    })(value);
    store.commit(`${ns}/setSearchQuery`, value);
  };

  const onClickInstall = async (row: DependencyRepo) => {
    store.commit(`${ns}/setInstallForm`, {
      ...state.installForm,
      names: [row.name],
    });
    store.commit(`${ns}/showDialog`, 'install');
  };

  // table columns
  const tableColumns = computed<TableColumns<DependencyRepo>>(() => {
    return [
      {
        key: 'name',
        label: t('views.env.deps.dependency.form.name'),
        icon: ['fa', 'font'],
        width: '200',
        value: (row: DependencyRepo) => {
          const path = getRepoExternalPath(row);
          if (!path) return row.name;
          return <ClNavLink label={row.name} path={path} external />;
        },
      },
      {
        key: 'versions',
        label: t('views.env.deps.dependency.form.installedVersion'),
        icon: ['fa', 'tag'],
        width: '200',
        value: (row: DependencyRepo) => (
          <ClDependencyVersions
            repo={row}
            onClick={() => onClickInstall(row)}
          />
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
            onClick: onClickInstall,
            action: ACTION_INSTALL,
          },
          {
            tooltip: t('common.actions.uninstall'),
            // disabled: row => !isUninstallable(row),
            // onClick: async row => {
            //   uninstallForm.value.node_ids = row.node_ids || [];
            //   uninstallForm.value.names = [row.name];
            //   dialogVisible.value.uninstall = true;
            // },
            action: ACTION_UNINSTALL,
          },
        ],
        disableTransfer: true,
      },
    ] as TableColumns<DependencyRepo>;
  });

  const tableDataDict = computed(() => {
    const dict = new Map<string, DependencyRepo>();
    state.tableData.forEach(d => {
      const key = d.name!;
      dict.set(key, d);
    });
    return dict;
  });

  const searchRepoTableData = computed(() =>
    state.searchRepoTableData.map(d => {
      const key = d.name!;
      const installedItem = tableDataDict.value.get(key);
      return {
        ...installedItem,
        ...d,
        node_ids: installedItem?.node_ids || [],
        versions: installedItem?.versions || ['N/A'],
        latest_version: d.latest_version || '',
      } as DependencyRepo;
    })
  );

  // programming language
  const lang = computed<DependencyLang>(() => state.lang);
  watch(lang, async () => {
    await Promise.all([
      store.dispatch(`${ns}/getList`),
      store.dispatch(`${ns}/searchRepoList`),
    ]);
  });

  // table data
  const tableLoading = computed(() => {
    switch (state.repoTabName) {
      case 'installed':
        return state.tableLoading;
      case 'search':
        return state.searchRepoTableLoading;
      default:
        return false;
    }
  });
  const tableData = computed(() => {
    switch (state.repoTabName) {
      case 'installed':
        return state.tableData;
      case 'search':
        return searchRepoTableData.value;
      default:
        return [];
    }
  });
  const tableTotal = computed(() => {
    switch (state.repoTabName) {
      case 'installed':
        return state.tableTotal;
      case 'search':
        return state.searchRepoTableTotal;
      default:
        return 0;
    }
  });
  const tablePagination = computed(() => {
    switch (state.repoTabName) {
      case 'installed':
        return state.tablePagination;
      case 'search':
        return state.searchRepoTablePagination;
      default:
        return getDefaultPagination();
    }
  });
  const tablePageSizes = computed(() => {
    if (state.lang === 'python' && state.repoTabName === 'search') {
      return [20];
    }
  });
  watch(tablePageSizes, () => {
    // set default page size if not in the list
    if (
      tablePageSizes.value &&
      !tablePageSizes.value.some(size => size === tablePagination.value.size)
    ) {
      store.commit(`${ns}/setSearchRepoTablePagination`, {
        ...tablePagination.value,
        size: tablePageSizes.value[0],
      });
    }
  });

  // action functions
  const { actionFunctions: originalActionFunctions } = useList<Dependency>(
    ns,
    store
  );
  const actionFunctions = {
    ...originalActionFunctions,
    getList: async () => {
      await Promise.all([
        store.dispatch(`${ns}/getList`),
        store.dispatch(`${ns}/searchRepoList`),
      ]);
    },
    setPagination: (pagination: TablePagination) => {
      switch (state.repoTabName) {
        case 'installed':
          store.commit(`${ns}/setTablePagination`, pagination);
          break;
        case 'search':
          store.commit(`${ns}/setSearchRepoTablePagination`, pagination);
          break;
      }
    },
  } as ListLayoutActionFunctions;

  // repo tabs
  const repoTabItems = computed<NavItem[]>(() => {
    const installedItem = {
      id: 'installed',
      title: `${t('views.env.deps.repos.tabs.installed')} (${state.tableTotal})`,
      icon: state.tableLoading ? ['fa', 'spinner'] : ['fas', 'server'],
      iconSpinning: state.tableLoading,
      disabled: state.tableLoading,
    };
    let searchItem: NavItem = {
      id: 'search',
    };
    switch (lang.value) {
      case 'python':
        searchItem = {
          ...searchItem,
          title: t('views.env.deps.repos.tabs.search.pypi'),
          icon: ['fab', 'python'],
        };
        break;
      case 'node':
        searchItem = {
          ...searchItem,
          title: t('views.env.deps.repos.tabs.search.npm'),
          icon: ['fab', 'node-js'],
        };
        break;
      default:
        searchItem = {
          id: 'search',
          title: '',
          icon: ['fas', 'search'],
        };
    }
    if (state.searchRepoTableLoading) {
      searchItem = {
        ...searchItem,
        icon: ['fa', 'spinner'],
        iconSpinning: true,
      };
    }
    if (state.searchQuery) {
      searchItem.title = `${searchItem.title} (${state.searchRepoTableTotal})`;
    }
    return [installedItem, searchItem] as NavItem[];
  });
  const repoTabName = computed(() => state.repoTabName);

  const onClickTableEmptySearch = () => {
    const elVNodeCtx = (
      document.querySelector<HTMLDivElement>('#filter-search .el-input') as any
    )?.__vnode?.ctx;
    elVNodeCtx?.exposed?.focus?.();
  };

  // row key
  const allNodes = computed(() => nodeState.allList);
  const rowKey = ({ name, versions, node_ids }: DependencyRepo) =>
    [
      name,
      JSON.stringify(versions),
      JSON.stringify(node_ids),
      JSON.stringify(allNodes.value?.map(n => n._id)),
    ].join('_');

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Task>;

  setupListComponent(ns, store, ['node'], false);

  return {
    ...useList<Dependency>(ns, store, opts),
    lang,
    tableLoading,
    tableColumns,
    tableData,
    tableTotal,
    tablePagination,
    tablePageSizes,
    actionFunctions,
    repoTabName,
    repoTabItems,
    onClickTableEmptySearch,
    rowKey,
  };
};

export default useDependencyList;
