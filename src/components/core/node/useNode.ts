import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useNodeService from '@/services/node/nodeService';
import { getDefaultFormComponentData } from '@/utils/form';

type Node = CNode;

// form component data
const formComponentData = getDefaultFormComponentData<Node>();

const useNode = (store: Store<RootStoreState>) => {
  // store
  const ns = 'node';

  // form rules
  const formRules: FormRules = {};

  return {
    ...useForm<Node>(ns, store, useNodeService(store), formComponentData),
    formRules,
  };
};

export default useNode;
