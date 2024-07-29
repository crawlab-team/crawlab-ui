type NodeStoreModule = BaseModule<
  NodeStoreState,
  NodeStoreGetters,
  NodeStoreMutations,
  NodeStoreActions
>;

interface NodeStoreState extends BaseStoreState<CNode> {
  nodeMetricsMap: Record<string, Metric>;
}

type NodeStoreGetters = BaseStoreGetters<CNode>;

interface NodeStoreMutations extends BaseStoreMutations<CNode> {
  setAllNodeSelectOptions: StoreMutation<BaseStoreState<CNode>, SelectOption[]>;
  setAllNodeTags: StoreMutation<BaseStoreState<CNode>, string[]>;
  setNodeMetricsMap: StoreMutation<NodeStoreState, Record<string, Metric>>;
}

interface NodeStoreActions extends BaseStoreActions<CNode> {
  getNodeMetrics: StoreAction<NodeStoreState>;
}
