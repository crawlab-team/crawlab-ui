export declare global {
  type DatabaseStoreModule = BaseModule<
    DatabaseStoreState,
    DatabaseStoreGetters,
    DatabaseStoreMutations,
    DatabaseStoreActions
  >;

  type DatabaseStoreState = BaseStoreState<Database>;

  type DatabaseStoreGetters = BaseStoreGetters<DatabaseStoreState>;

  type DatabaseStoreMutations = BaseStoreMutations<Database>;

  interface DatabaseStoreActions extends BaseStoreActions<Database> {
    changePassword: StoreAction<
      DatabaseStoreState,
      { id: string; password: string }
    >;
  }
}
