type UserStoreModule = BaseModule<
  UserStoreState,
  UserStoreGetters,
  UserStoreMutations,
  UserStoreActions
>;

interface UserStoreState extends BaseStoreState<User> {}

interface UserStoreGetters extends BaseStoreGetters<User> {}

interface UserStoreMutations extends BaseStoreMutations<User> {}

interface UserStoreActions extends BaseStoreActions<User> {
  changePassword: StoreAction<UserStoreState, { id: string; password: string }>;
}
