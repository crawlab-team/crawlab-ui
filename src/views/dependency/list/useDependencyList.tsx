import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import { getStore } from '@/store';
import { useList } from '@/layouts/content';
import {
  getDefaultPagination,
  getIconByAction,
  getPlaceholderColumn,
  onListFilterChangeByKey,
  setupAutoUpdate,
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
  ClNodeTag,
  ClTag,
  useNode,
} from '@/components';
import {
  getNormalizedDependencies,
  getRepoExternalPath,
  getRepoName,
} from '@/utils/dependency';
import type { TagProps } from '@/components/ui/tag/types';

const t = translate;

const useDependencyList = () => {
  // router
  const router = useRouter();

  // store
  const ns = 'dependency';
  const store = getStore();
  const { dependency: state, node: nodeState } = store.state as RootStoreState;

  const { activeNodesSorted } = useNode(store);

  const navActions = computed<ListActionGroup[]>(() => [
    {
      action: ACTION_FILTER,
      name: 'filter',
      children: [
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-lang',
          className: 'select-lang',
          defaultValue: state.lang,
          onChange: value => {
            onListFilterChangeByKey(store, ns, 'type', FILTER_OP_EQUAL, {
              update: false,
            })(value);
            store.commit(`${ns}/setLang`, value);
          },
          options: [
            {
              label: t('views.env.deps.lang.python'),
              value: 'python',
              icon: ['fab', 'python'],
            },
            {
              label: t('views.env.deps.lang.node'),
              value: 'node',
              icon: ['fab', 'node-js'],
            },
            {
              label: t('views.env.deps.lang.go'),
              value: 'go',
              icon: ['svg', 'go'],
            },
            {
              label: t('views.env.deps.lang.java'),
              value: 'java',
              icon: ['fab', 'java'],
            },
            {
              label: t('views.env.deps.lang.browser'),
              value: 'browser',
              icon: ['svg', 'chromium'],
            },
          ],
          clearable: false,
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
          prefixIcon: ['fa', 'search'],
          placeholder: t('views.env.deps.navActions.filter.search.placeholder'),
          onChange: async value => {
            await updateSearchQuery(value);
          },
          onEnter: async value => {
            await updateSearchQuery(value);
            await Promise.all([
              store.dispatch(`${ns}/getInstalledDependencyList`),
              store.dispatch(`${ns}/searchRepoList`),
            ]);
          },
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-nodes',
          className: 'select-nodes',
          placeholder: t(
            'views.env.deps.navActionsExtra.filter.select.nodes.label'
          ),
          onChange: async value => {
            await onListFilterChangeByKey(
              store,
              ns,
              'node_id',
              FILTER_OP_EQUAL,
              { update: false }
            )(value);
          },
          options: nodeState.allList
            .filter(n => n.active)
            .map(node => {
              return {
                label: node.name,
                value: node._id,
              };
            }),
        },
        {
          className: 'search-btn',
          buttonType: 'label',
          label: t('common.actions.search'),
          icon: ['fa', 'search'],
          onClick: async () => {
            await Promise.all([
              store.dispatch(`${ns}/getInstalledDependencyList`),
              store.dispatch(`${ns}/searchRepoList`),
            ]);
          },
        },
        {
          className: 'configure-btn',
          buttonType: 'label',
          label: t('common.actions.configure'),
          icon: ['fa', 'cog'],
          onClick: async () => {
            store.commit(`${ns}/showDialog`, 'config');
          },
        },
        {
          className: 'setup-btn',
          buttonType: 'label',
          label: t('views.env.deps.repos.actions.installEnvironments.label'),
          tooltip: t(
            'views.env.deps.repos.actions.installEnvironments.tooltip'
          ),
          icon: ['fa', 'server'],
          onClick: async () => {
            store.commit(`${ns}/setSetupForm`, {
              mode: 'all',
              version: state.config?.default_version,
            });
            store.commit(`${ns}/showDialog`, 'setup');
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
      name: row.name,
    } as DependencyInstallForm);
    store.commit(`${ns}/showDialog`, 'install');
  };

  const onClickUninstall = async (row: DependencyRepo) => {
    store.commit(`${ns}/setUninstallForm`, {
      ...state.uninstallForm,
      names: [row.name],
    } as DependencyUninstallForm);
    store.commit(`${ns}/showDialog`, 'uninstall');
  };

  const onClickConfigSetup = async (row: DependencyConfigSetup) => {
    store.commit(`${ns}/setActiveConfigSetup`, row);
    store.commit(`${ns}/setSetupForm`, {
      node_id: row.node_id,
      version: state.config?.default_version,
    });
    store.commit(`${ns}/showDialog`, 'setup');
  };

  const onViewConfigSetupLogs = async (row: DependencyConfigSetup) => {
    store.commit(`${ns}/setActiveTargetId`, row._id);
    store.commit(`${ns}/showDialog`, 'logs');
  };

  const isLoading = (dep: Dependency) => {
    return dep.status === 'installing' || dep.status === 'uninstalling';
  };

  const getTypeByDep = (dep: Dependency): BasicType | undefined => {
    switch (dep.status) {
      case 'installing':
      case 'uninstalling':
        return 'warning';
      case 'error':
      case 'abnormal':
        return 'danger';
    }
  };

  // table columns
  const tableColumns = computed<TableColumns<DependencyRepo>>(() => {
    switch (state.repoTabName) {
      case 'nodes':
        return [
          {
            key: 'name', // name
            className: 'name',
            label: t('views.nodes.table.columns.name'),
            icon: ['fa', 'font'],
            width: '150',
            value: (row: DependencyConfigSetup) => (
              <ClNodeTag
                node={row.node}
                clickable
                onClick={async () => {
                  await router.push(`/nodes/${row.node!._id!}`);
                }}
              />
            ),
            hasSort: true,
            hasFilter: true,
            allowFilterSearch: true,
          },
          {
            key: 'status',
            className: 'status',
            label: t('views.env.deps.configSetup.form.status'),
            icon: ['fa', 'info-circle'],
            width: '150',
            value: (row: DependencyConfigSetup) => {
              let tagProps: TagProps;
              let label: string;
              if (!row.node?.active) {
                label = t('common.status.unknown');
                tagProps = {
                  icon: ['fa', 'question'],
                  type: 'info',
                };
              } else {
                switch (row.status) {
                  case 'installed':
                    tagProps = {
                      icon: ['fa', 'check'],
                      type: 'success',
                      clickable: true,
                    };
                    break;
                  case 'installing':
                  case 'uninstalling':
                    tagProps = {
                      icon: ['fa', 'spinner'],
                      type: 'warning',
                      spinning: true,
                      clickable: true,
                    };
                    break;
                  case 'error':
                  case 'abnormal':
                    tagProps = {
                      icon: ['fa', 'times'],
                      type: 'danger',
                      clickable: true,
                    };
                    break;
                  default:
                    tagProps = {
                      icon: getIconByAction(ACTION_INSTALL),
                      type: 'info',
                      clickable: true,
                    };
                }
                label = t(`views.env.deps.dependency.status.${row.status}`);
              }
              return (
                <ClTag
                  {...tagProps}
                  label={label}
                  onClick={async () => {
                    switch (row.status) {
                      case 'uninstalled':
                        await onClickConfigSetup(row);
                        break;
                      default:
                        await onViewConfigSetupLogs(row);
                    }
                  }}
                />
              );
            },
          },
          {
            key: 'version',
            className: 'version',
            label: t('views.env.deps.configSetup.form.version'),
            icon: ['fa', 'tag'],
            width: '150',
          },
          getPlaceholderColumn(),
          {
            key: 'actions',
            label: t('components.table.columns.actions'),
            fixed: 'right',
            width: '200',
            buttons: (_: DependencyConfigSetup) => [
              {
                tooltip: t('common.actions.install'),
                disabled: row =>
                  !row.node?.active || row.status === 'installing',
                onClick: onClickConfigSetup,
                action: ACTION_INSTALL,
              },
            ],
            disableTransfer: true,
          },
        ] as TableColumns<DependencyConfigSetup>;
      default:
        return [
          {
            key: 'name',
            label: t('views.env.deps.dependency.form.name'),
            icon: ['fa', 'font'],
            width: '200',
            value: (row: DependencyRepo) => {
              const path = getRepoExternalPath(row);
              const name = getRepoName(row);
              if (!path) return name || row.name;
              return <ClNavLink label={name} path={path} external />;
            },
          },
          {
            key: 'versions',
            label: t('views.env.deps.dependency.form.installedVersion'),
            icon: ['fa', 'tag'],
            width: '200',
            value: (row: DependencyRepo) => (
              <ClDependencyVersions
                name={row.name}
                dependencies={getNormalizedDependencies(row.dependencies)}
                latestVersion={row.latest_version}
                onClick={() => onClickInstall(row)}
              />
            ),
          },
          {
            key: 'node_ids',
            label: t('views.env.deps.dependency.form.installedNodes'),
            icon: ['fa', 'server'],
            width: '580',
            value: (row: DependencyRepo) => {
              return activeNodesSorted.value.map(node => {
                const dep = row.dependencies?.find(
                  dep => dep.node_id === node._id
                );
                if (!dep) return;
                return (
                  <ClNodeTag
                    key={node._id}
                    node={node}
                    loading={isLoading(dep)}
                    hit={isLoading(dep)}
                    type={getTypeByDep(dep)}
                    clickable
                    onClick={() => {
                      store.commit(`${ns}/setActiveTargetId`, dep._id);
                      store.commit(`${ns}/showDialog`, 'logs');
                    }}
                  >
                    {{
                      'extra-items': () => {
                        let color: string;
                        switch (dep.status) {
                          case 'installing':
                          case 'uninstalling':
                            color = 'var(--cl-warning-color)';
                            break;
                          case 'installed':
                          case 'uninstalled':
                            color = 'var(--cl-success-color)';
                            break;
                          case 'error':
                          case 'abnormal':
                            color = 'var(--cl-danger-color)';
                            break;
                          default:
                            color = 'inherit';
                        }
                        return (
                          <div class="tooltip-wrapper">
                            <div class="tooltip-title">
                              <label>{t('views.env.deps.label')}</label>
                            </div>
                            <div class="tooltip-item">
                              <label>
                                {t('views.env.deps.dependency.form.status')}:
                              </label>
                              <span
                                style={{
                                  color,
                                }}
                              >
                                {t(
                                  `views.env.deps.dependency.status.${dep.status}`
                                )}
                              </span>
                            </div>
                            {dep.error && (
                              <div class="tooltip-item">
                                <label>
                                  {t('views.env.deps.dependency.form.error')}:
                                </label>
                                <span
                                  style={{
                                    color,
                                  }}
                                >
                                  {dep.error}
                                </span>
                              </div>
                            )}
                            {dep.version && (
                              <div class="tooltip-item">
                                <label>
                                  {t('views.env.deps.dependency.form.version')}:
                                </label>
                                <span>{dep.version}</span>
                              </div>
                            )}
                          </div>
                        );
                      },
                    }}
                  </ClNodeTag>
                );
              });
            },
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
                disabled: (row: DependencyRepo) => {
                  return (
                    !row.node_ids?.length ||
                    !row.dependencies?.some(dep => {
                      return dep.status === 'installed';
                    })
                  );
                },
                onClick: onClickUninstall,
                action: ACTION_UNINSTALL,
              },
            ],
            disableTransfer: true,
          },
        ] as TableColumns<DependencyRepo>;
    }
  });

  const installedDependenciesTableDataDict = computed(() => {
    const dict = new Map<string, DependencyRepo>();
    state.installedDependenciesTableData.forEach(d => {
      const key = d.name!;
      dict.set(key, d);
    });
    return dict;
  });

  const searchRepoTableData = computed(() =>
    state.searchRepoTableData.map(d => {
      const key = d.name!;
      const installedItem =
        installedDependenciesTableDataDict.value.get(key) || {};
      return {
        ...installedItem,
        ...d,
        node_ids: installedItem?.node_ids || [],
        versions: installedItem?.versions || ['N/A'],
        dependencies: installedItem?.dependencies || [],
        latest_version: d.latest_version || '',
      } as DependencyRepo;
    })
  );

  const configSetupTableData = computed(() => state.configSetupTableData);

  // get data
  const getData = async () => {
    await Promise.all([
      store.dispatch(`${ns}/getDependencyConfig`),
      store.dispatch(`${ns}/getInstalledDependencyList`),
      store.dispatch(`${ns}/searchRepoList`),
      store.dispatch(`${ns}/getConfigSetupList`),
    ]);
  };

  // config
  const config = computed<DependencyConfig | undefined>(() => state.config);

  // programming language
  const lang = computed<DependencyLang>(() => state.lang);
  watch(lang, getData);

  // table data
  const tableLoading = computed(() => {
    switch (state.repoTabName) {
      // case 'installed':
      //   return state.tableLoading;
      case 'search':
        return state.searchRepoTableLoading;
      default:
        return false;
    }
  });
  const tableData = computed(() => {
    switch (state.repoTabName) {
      case 'installed':
        console.debug('installed', state.installedDependenciesTableData);
        return state.installedDependenciesTableData || [];
      case 'search':
        console.debug('search');
        return searchRepoTableData.value || [];
      case 'nodes':
        console.debug('nodes');
        return configSetupTableData.value || [];
      default:
        return [];
    }
  });
  const tableTotal = computed(() => {
    switch (state.repoTabName) {
      case 'installed':
        return state.installedDependenciesTableTotal;
      case 'search':
        return state.searchRepoTableTotal;
      case 'nodes':
        return state.configSetupTableTotal;
      default:
        return 0;
    }
  });
  const tablePagination = computed(() => {
    switch (state.repoTabName) {
      case 'installed':
        return state.installedDependenciesTablePagination;
      case 'search':
        return state.searchRepoTablePagination;
      case 'nodes':
        return state.configSetupTablePagination;
      default:
        return getDefaultPagination();
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
        store.dispatch(`${ns}/getInstalledDependencyList`),
        store.dispatch(`${ns}/searchRepoList`),
        store.dispatch(`${ns}/getConfigSetupList`),
      ]);
    },
    setPagination: (pagination: TablePagination) => {
      switch (state.repoTabName) {
        case 'installed':
          store.commit(
            `${ns}/setInstalledDependenciesTablePagination`,
            pagination
          );
          break;
        case 'search':
          store.commit(`${ns}/setSearchRepoTablePagination`, pagination);
          break;
        case 'nodes':
          store.commit(`${ns}/setConfigSetupTablePagination`, pagination);
          break;
      }
    },
  } as ListLayoutActionFunctions;

  // repo tabs
  const repoTabItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [];

    // installed tab
    const installedItem = {
      id: 'installed',
      title: `${t('views.env.deps.repos.tabs.installed')} (${state.installedDependenciesTableTotal})`,
      icon: ['fas', 'cubes'],
    };
    items.push(installedItem);

    // search tab
    let searchItem: NavItem | undefined = {
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
      case 'go':
        searchItem = {
          ...searchItem,
          title: t('views.env.deps.repos.tabs.search.go'),
          icon: ['svg', 'go'],
        };
        break;
      case 'java':
        searchItem = {
          ...searchItem,
          title: t('views.env.deps.repos.tabs.search.maven'),
          icon: ['svg', 'maven'],
        };
        break;
      case 'browser':
        searchItem = undefined;
        break;
      default:
        searchItem = {
          id: 'search',
          title: '',
          icon: ['fas', 'search'],
        };
    }
    if (searchItem) {
      if (state.searchQuery) {
        searchItem.title = `${searchItem.title} (${state.searchRepoTableTotal})`;
      }
      items.push(searchItem);
    }

    // nodes tab
    const nodesItem: NavItem = {
      id: 'nodes',
      title: t('views.env.deps.repos.tabs.nodes'),
      icon: ['fas', 'server'],
    };
    items.push(nodesItem);

    return items;
  });
  const repoTabName = computed(() => {
    return state.repoTabName;
  });

  const onClickTableEmptySearch = () => {
    const elVNodeCtx = (
      document.querySelector<HTMLDivElement>('#filter-search .el-input') as any
    )?.__vnode?.ctx;
    elVNodeCtx?.exposed?.focus?.();
  };

  const onClickTableEmptyConfigNotSetup = () => {
    store.commit(`${ns}/setSetupForm`, {
      mode: 'all',
      version: state.config?.default_version,
    });
    store.commit(`${ns}/showDialog`, 'setup');
  };

  const onClickTableEmptyJava = async () => {
    await router.push('/spiders');
  };

  onBeforeUnmount(() => {
    store.commit(`${ns}/setSearchQuery`, '');
  });

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Task>;

  setupListComponent(ns, store, ['node'], false);

  setupAutoUpdate(getData, 10000);
  onBeforeMount(async () => {
    await Promise.all([
      store.dispatch(`${ns}/getDependencyConfig`),
      store.dispatch(`${ns}/getConfigSetupList`),
    ]);
  });

  return {
    ...useList<Dependency>(ns, store, opts),
    config,
    lang,
    tableLoading,
    tableColumns,
    tableData,
    tableTotal,
    tablePagination,
    actionFunctions,
    repoTabName,
    repoTabItems,
    onClickTableEmptySearch,
    onClickTableEmptyConfigNotSetup,
    onClickTableEmptyJava,
  };
};

export default useDependencyList;
