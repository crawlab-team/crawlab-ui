type ProjectStoreModule = BaseModule<
  ProjectStoreState,
  ProjectStoreGetters,
  ProjectStoreMutations,
  ProjectStoreActions
>;

interface ProjectStoreState extends BaseStoreState<Project> {}

type ProjectStoreGetters = BaseStoreGetters<Project>;

interface ProjectStoreMutations extends BaseStoreMutations<Project> {}

interface ProjectStoreActions extends BaseStoreActions<Project> {}
