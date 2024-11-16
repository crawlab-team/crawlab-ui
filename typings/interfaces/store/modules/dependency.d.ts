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
    installForm: DependencyInstallForm;
    installLoading: boolean;
    uninstallForm: DependencyUninstallForm;
    uninstallLoading: boolean;
    versions: string[];
    getVersionsLoading: boolean;
    activeDependency?: Dependency;
    activeDependencyLogs: DependencyLog[];
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
    setVersions: (state: DependencyStoreState, versions: string[]) => void;
    resetVersions: (state: DependencyStoreState) => void;
    setGetVersionsLoading: (
      state: DependencyStoreState,
      loading: boolean
    ) => void;
    setActiveDependency: (
      state: DependencyStoreState,
      dependency: Dependency
    ) => void;
    resetActiveDependency: (state: DependencyStoreState) => void;
    setActiveDependencyLogs: (
      state: DependencyStoreState,
      logs: DependencyLog[]
    ) => void;
    resetActiveDependencyLogs: (state: DependencyStoreState) => void;
  }

  interface DependencyStoreActions extends BaseStoreActions<DependencyRepo> {
    searchRepoList: StoreAction<DependencyStoreState>;
    getRepoVersions: StoreAction<DependencyStoreState>;
    installDependency: StoreAction<DependencyStoreState>;
    uninstallDependency: StoreAction<DependencyStoreState>;
    getActiveDependencyLogs: StoreAction<DependencyStoreState>;
  }
}
