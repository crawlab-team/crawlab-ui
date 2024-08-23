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
  }
}
