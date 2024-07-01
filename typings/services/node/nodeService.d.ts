import { Store } from 'vuex';
type Node = CNode;
declare const useNodeService: (store: Store<RootStoreState>) => Services<Node>;
export default useNodeService;
