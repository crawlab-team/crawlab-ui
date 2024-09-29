export declare global {
  type DatabaseStoreModule = BaseModule<
    DatabaseStoreState,
    DatabaseStoreGetters,
    DatabaseStoreMutations,
    DatabaseStoreActions
  >;

  interface DatabaseStoreState extends BaseStoreState<Database> {
    metadata?: DatabaseMetadata;
    tablePreviewData: Record<string, any>[];
    tablePreviewPagination: TablePagination;
    tablePreviewTotal: number;
    activeTable?: DatabaseTable;
    activeDatabaseName?: string;
    activeNavItem?: DatabaseNavItem;
    defaultTabName?: string;
    consoleContent: string;
    consoleSelectedContent?: string;
    consoleQueryLoading?: boolean;
    consoleQueryResults?: DatabaseQueryResults;
    consoleQueryResultsActiveTabName?: string;
  }

  type DatabaseStoreGetters = BaseStoreGetters<DatabaseStoreState>;

  interface DatabaseStoreMutations extends BaseStoreMutations<Database> {
    setMetadata: StoreMutation<DatabaseStoreState, DatabaseMetadata>;
    setTablePreviewData: StoreMutation<
      DatabaseStoreState,
      Record<string, any>[]
    >;
    setTablePreviewTotal: StoreMutation<DatabaseStoreState, number>;
    setTablePreviewPagination: StoreMutation<
      DatabaseStoreState,
      TablePagination
    >;
    setActiveTable: StoreMutation<DatabaseStoreState, DatabaseTable>;
    resetActiveTable: StoreMutation<DatabaseStoreState>;
    setActiveDatabaseName: StoreMutation<DatabaseStoreState, string>;
    setActiveNavItem: StoreMutation<DatabaseStoreState, DatabaseNavItem>;
    setDefaultTabName: StoreMutation<DatabaseStoreState, string>;
    setConsoleContent: StoreMutation<DatabaseStoreState, string>;
    setConsoleSelectedContent: StoreMutation<
      DatabaseStoreState,
      string | undefined
    >;
    setConsoleQueryLoading: StoreMutation<DatabaseStoreState, boolean>;
    setConsoleQueryResults: StoreMutation<
      DatabaseStoreState,
      DatabaseQueryResults
    >;
    setConsoleQueryResultsActiveTabName: StoreMutation<
      DatabaseStoreState,
      string | undefined
    >;
  }

  interface DatabaseStoreActions extends BaseStoreActions<Database> {
    changePassword: StoreAction<
      DatabaseStoreState,
      { id: string; password: string }
    >;
    getMetadata: StoreAction<DatabaseStoreState, { id: string }>;
    getTablePreview: StoreAction<
      DatabaseStoreState,
      { id: string; database: string; table: string }
    >;
    getTable: StoreAction<
      DatabaseStoreState,
      { id: string; database: string; table: string }
    >;
    runQuery: StoreAction<
      DatabaseStoreState,
      { id: string; database: string; query: string }
    >;
  }
}
