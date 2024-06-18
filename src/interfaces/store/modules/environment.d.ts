export declare global {
  type EnvironmentStoreModule = BaseModule<
    EnvironmentStoreState,
    EnvironmentStoreGetters,
    EnvironmentStoreMutations,
    EnvironmentStoreActions
  >;

  type EnvironmentStoreState = BaseStoreState<Environment>;

  type EnvironmentStoreGetters = BaseStoreGetters<EnvironmentStoreState>;

  type EnvironmentStoreMutations = BaseStoreMutations<Environment>;

  type EnvironmentStoreActions = BaseStoreActions<Environment>;
}
