export declare global {
  type DataSourceStoreModule = BaseModule<
    DataSourceStoreState,
    DataSourceStoreGetters,
    DataSourceStoreMutations,
    DataSourceStoreActions
  >;

  type DataSourceStoreState = BaseStoreState<DataSource>;

  type DataSourceStoreGetters = BaseStoreGetters<DataSourceStoreState>;

  type DataSourceStoreMutations = BaseStoreMutations<DataSource>;

  interface DataSourceStoreActions extends BaseStoreActions<DataSource> {
    changePassword: StoreAction<
      DataSourceStoreState,
      { id: string; password: string }
    >;
  }
}
