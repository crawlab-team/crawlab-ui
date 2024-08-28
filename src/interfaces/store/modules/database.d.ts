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
  }
}
