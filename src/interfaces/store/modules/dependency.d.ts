export declare global {
  type DependencyStoreModule = BaseModule<
    DependencyStoreState,
    DependencyStoreGetters,
    DependencyStoreMutations,
    DependencyStoreActions
  >;

  interface DependencyStoreState extends BaseStoreState<DependencyRepo> {
    lang: DependencyLang;
    searchQuery: string;
    repoTabName: DependencyRepoTabName;
    installedDependenciesTableLoading: boolean;
    installedDependenciesTableData: TableData<DependencyRepo>;
    installedDependenciesTableTotal: number;
    installedDependenciesTablePagination: TablePagination;
    searchRepoTableLoading: boolean;
    searchRepoTableData: TableData<DependencyRepo>;
    searchRepoTableTotal: number;
    searchRepoTablePagination: TablePagination;
    configSetupTableLoading: boolean;
    configSetupTableData: TableData<DependencyConfigSetup>;
    configSetupTableTotal: number;
    configSetupTablePagination: TablePagination;
    installForm: DependencyInstallForm;
    installLoading: boolean;
    uninstallForm: DependencyUninstallForm;
    uninstallLoading: boolean;
    setupForm: DependencySetupForm;
    setupLoading: boolean;
    versions: string[];
    getVersionsLoading: boolean;
    activeTargetId?: string;
    activeTargetName?: string;
    activeTargetStatus?: DependencyStatus;
    activeTargetLogs: DependencyLog[];
    config?: DependencyConfig;
    configVersions: string[];
    getConfigVersionsLoading?: boolean;
    activeConfigSetup?: DependencyConfigSetup;
  }

  interface DependencyStoreGetters
    extends BaseStoreGetters<DependencyStoreState> {}

  interface DependencyStoreMutations
    extends BaseStoreMutations<DependencyRepo> {
    setLang: (state: DependencyStoreState, lang: DependencyLang) => void;
    setSearchQuery: (state: DependencyStoreState, query: string) => void;
    setRepoTabName: (
      state: DependencyStoreState,
      name: DependencyRepoTabName
    ) => void;
    setInstalledDependenciesTableLoading: (
      state: DependencyStoreState,
      loading: boolean
    ) => void;
    setInstalledDependenciesTableData: (
      state: DependencyStoreState,
      data: TableDataWithTotal<DependencyRepo>
    ) => void;
    resetInstalledDependenciesTableData: (state: DependencyStoreState) => void;
    setInstalledDependenciesTablePagination: (
      state: DependencyStoreState,
      pagination: TablePagination
    ) => void;
    resetInstalledDependenciesTablePagination: (
      state: DependencyStoreState
    ) => void;
    setSearchRepoTableLoading: (
      state: DependencyStoreState,
      loading: boolean
    ) => void;
    setSearchRepoTableData: (
      state: DependencyStoreState,
      data: TableDataWithTotal<DependencyRepo>
    ) => void;
    resetSearchRepoTableData: (state: DependencyStoreState) => void;
    setSearchRepoTablePagination: (
      state: DependencyStoreState,
      pagination: TablePagination
    ) => void;
    resetSearchRepoTablePagination: (state: DependencyStoreState) => void;
    setConfigSetupTableLoading: (
      state: DependencyStoreState,
      loading: boolean
    ) => void;
    setConfigSetupTableData: (
      state: DependencyStoreState,
      data: TableDataWithTotal<DependencyRepo>
    ) => void;
    resetConfigSetupTableData: (state: DependencyStoreState) => void;
    setConfigSetupTablePagination: (
      state: DependencyStoreState,
      pagination: TablePagination
    ) => void;
    resetConfigSetupTablePagination: (state: DependencyStoreState) => void;
    setInstallForm: (
      state: DependencyStoreState,
      form: DependencyInstallForm
    ) => void;
    resetInstallForm: (state: DependencyStoreState) => void;
    setInstallLoading: (state: DependencyStoreState, loading: boolean) => void;
    setUninstallForm: (
      state: DependencyStoreState,
      form: DependencyUninstallForm
    ) => void;
    resetUninstallForm: (state: DependencyStoreState) => void;
    setUninstallLoading: (
      state: DependencyStoreState,
      loading: boolean
    ) => void;
    setSetupForm: (
      state: DependencyStoreState,
      form: DependencySetupForm
    ) => void;
    resetSetupForm: (state: DependencyStoreState) => void;
    setSetupLoading: (state: DependencyStoreState, loading: boolean) => void;
    setVersions: (state: DependencyStoreState, versions: string[]) => void;
    resetVersions: (state: DependencyStoreState) => void;
    setGetVersionsLoading: (
      state: DependencyStoreState,
      loading: boolean
    ) => void;
    setActiveTargetId: (state: DependencyStoreState, id: string) => void;
    resetActiveTargetId: (state: DependencyStoreState) => void;
    setActiveTargetName: (state: DependencyStoreState, name: string) => void;
    resetActiveTargetName: (state: DependencyStoreState) => void;
    setActiveTargetStatus: (
      state: DependencyStoreState,
      status: DependencyStatus
    ) => void;
    resetActiveTargetStatus: (state: DependencyStoreState) => void;
    setActiveTargetLogs: (
      state: DependencyStoreState,
      logs: DependencyLog[]
    ) => void;
    resetActiveTargetLogs: (state: DependencyStoreState) => void;
    setConfig: (state: DependencyStoreState, config: DependencyConfig) => void;
    resetConfig: (state: DependencyStoreState) => void;
    setConfigVersions: (
      state: DependencyStoreState,
      versions: string[]
    ) => void;
    resetConfigVersions: (state: DependencyStoreState) => void;
    setGetConfigVersionsLoading: (
      state: DependencyStoreState,
      loading: boolean
    ) => void;
    setActiveConfigSetup: (
      state: DependencyStoreState,
      configSetup: DependencyConfigSetup
    ) => void;
    resetActiveConfigSetup: (state: DependencyStoreState) => void;
  }

  interface DependencyStoreActions extends BaseStoreActions<DependencyRepo> {
    getInstalledDependencyList: StoreAction<DependencyStoreState>;
    searchRepoList: StoreAction<DependencyStoreState>;
    getRepoVersions: StoreAction<DependencyStoreState>;
    installDependency: StoreAction<DependencyStoreState>;
    uninstallDependency: StoreAction<DependencyStoreState>;
    setupConfig: StoreAction<DependencyStoreState>;
    getActiveTargetLogs: StoreAction<DependencyStoreState>;
    getDependencyConfig: StoreAction<DependencyStoreState>;
    saveDependencyConfig: StoreAction<DependencyStoreState>;
    getDependencyConfigVersions: StoreAction<DependencyStoreActions>;
    getConfigSetupList: StoreAction<DependencyStoreState>;
    installConfigSetup: StoreAction<DependencyStoreState>;
  }
}
