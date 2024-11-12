export declare global {
  type RoleStoreModule = BaseModule<
    RoleStoreState,
    RoleStoreGetters,
    RoleStoreMutations,
    RoleStoreActions
  >;

  interface RoleStoreState extends BaseStoreState<Role> {
    pagesCheckAllStatus: CheckboxStatus;
  }

  interface RoleStoreGetters extends BaseStoreGetters<Role> {}

  interface RoleStoreMutations extends BaseStoreMutations<Role> {
    setPagesCheckAllStatus: (
      state: RoleStoreState,
      status: CheckboxStatus
    ) => void;
  }

  interface RoleStoreActions extends BaseStoreActions<Role> {}
}
