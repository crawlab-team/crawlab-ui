export declare global {
  type RoleStoreModule = BaseModule<
    RoleStoreState,
    RoleStoreGetters,
    RoleStoreMutations,
    RoleStoreActions
  >;

  interface RoleStoreState extends BaseStoreState<Role> {}

  type RoleStoreGetters = BaseStoreGetters<Role>;

  interface RoleStoreMutations extends BaseStoreMutations<Role> {}

  interface RoleStoreActions extends BaseStoreActions<Role> {}
}
