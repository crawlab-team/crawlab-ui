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
    activeTargetLogs: DependencyLog[];
    config?: DependencyConfig;
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
    setActiveTargetLogs: (
      state: DependencyStoreState,
      logs: DependencyLog[]
    ) => void;
    resetActiveTargetLogs: (state: DependencyStoreState) => void;
    setConfig: (state: DependencyStoreState, config: DependencyConfig) => void;
    resetConfig: (state: DependencyStoreState) => void;
    setActiveConfigSetup: (
      state: DependencyStoreState,
      configSetup: DependencyConfigSetup
    ) => void;
    resetActiveConfigSetup: (state: DependencyStoreState) => void;
  }

  interface DependencyStoreActions extends BaseStoreActions<DependencyRepo> {
    searchRepoList: StoreAction<DependencyStoreState>;
    getRepoVersions: StoreAction<DependencyStoreState>;
    installDependency: StoreAction<DependencyStoreState>;
    uninstallDependency: StoreAction<DependencyStoreState>;
    setupConfig: StoreAction<DependencyStoreState>;
    getActiveTargetLogs: StoreAction<DependencyStoreState>;
    getDependencyConfig: StoreAction<DependencyStoreState>;
    saveDependencyConfig: StoreAction<DependencyStoreState>;
    getConfigSetupList: StoreAction<DependencyStoreState>;
    installConfigSetup: StoreAction<DependencyStoreState, { id: string }>;
  }
}
