type AiStoreModule = BaseModule<
  AiStoreState,
  AiStoreGetters,
  AiStoreMutations,
  AiStoreActions
>;

interface AiStoreState extends BaseStoreState<LLMProvider> {}

type AiStoreGetters = BaseStoreGetters<LLMProvider>;

interface AiStoreMutations extends BaseStoreMutations<LLMProvider> {}

interface AiStoreActions extends BaseStoreActions<LLMProvider> {}
