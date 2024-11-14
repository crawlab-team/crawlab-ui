import { Store } from 'vuex';
import useEnvironmentService from '@/services/environment/environmentService';
import { getDefaultFormComponentData, translate } from '@/utils';
import useForm from '@/components/ui/form/useForm';

// i18n
const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<Environment>();

export const useEnvironment: any = (store: Store<RootStoreState>) => {
  // store
  const ns = 'environment' as ListStoreNamespace;

  return {
    ...useForm<Environment>(
      ns,
      store,
      useEnvironmentService(store),
      formComponentData
    ),
  };
};

export default useEnvironment;
