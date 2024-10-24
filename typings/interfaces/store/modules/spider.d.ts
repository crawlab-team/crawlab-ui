type SpiderStoreModule = BaseModule<
  SpiderStoreState,
  SpiderStoreGetters,
  SpiderStoreMutations,
  SpiderStoreActions
>;

interface SpiderStoreState extends BaseStoreState<Spider>, BaseFileStoreState {
  dataDisplayAllFields: boolean;
  databaseMetadata?: DatabaseMetadata;
}

interface SpiderStoreGetters extends BaseStoreGetters<SpiderStoreState> {
  databaseTableSelectOptions: StoreGetter<SpiderStoreState, SelectOption[]>;
}

interface SpiderStoreMutations
  extends BaseStoreMutations<Spider>,
    BaseFileStoreMutations<SpiderStoreState> {
  setDataDisplayAllFields: StoreMutation<SpiderStoreState, boolean>;
  setDatabaseMetadata: StoreMutation<SpiderStoreState, DatabaseMetadata>;
}

interface SpiderStoreActions
  extends BaseStoreActions<Spider>,
    BaseFileStoreActions<SpiderStoreState> {
  runById: StoreAction<
    SpiderStoreState,
    { id: string; options: SpiderRunOptions }
  >;
  getDatabaseMetadata: StoreAction<SpiderStoreState, string>;
}
