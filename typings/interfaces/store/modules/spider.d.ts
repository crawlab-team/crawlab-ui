type SpiderStoreModule = BaseModule<
  SpiderStoreState,
  SpiderStoreGetters,
  SpiderStoreMutations,
  SpiderStoreActions
>;

interface SpiderStoreState extends BaseStoreState<Spider>, BaseFileStoreState {
  dataDisplayAllFields: boolean;
}

type SpiderStoreGetters = BaseStoreGetters<SpiderStoreState>;

interface SpiderStoreMutations
  extends BaseStoreMutations<Spider>,
    BaseFileStoreMutations<SpiderStoreState> {
  setDataDisplayAllFields: StoreMutation<SpiderStoreState, boolean>;
}

interface SpiderStoreActions
  extends BaseStoreActions<Spider>,
    BaseFileStoreActions<SpiderStoreState> {
  runById: StoreAction<
    SpiderStoreState,
    { id: string; options: SpiderRunOptions }
  >;
}
