type LLMProviderStoreModule = BaseModule<
  LLMProviderStoreState,
  LLMProviderStoreGetters,
  LLMProviderStoreMutations,
  LLMProviderStoreActions
>;

interface LLMProviderStoreState extends BaseStoreState<LLMProvider> {}

type LLMProviderStoreGetters = BaseStoreGetters<LLMProvider>;

interface LLMProviderStoreMutations extends BaseStoreMutations<LLMProvider> {}

interface LLMProviderStoreActions extends BaseStoreActions<LLMProvider> {}
