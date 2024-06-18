import { Store } from 'vuex';
import { getDefaultService } from '@/utils/service';

const useEnvironmentService = (
  store: Store<RootStoreState>
): Services<Environment> => {
  const ns = 'environment';

  return {
    ...getDefaultService<Environment>(ns, store),
  };
};

export default useEnvironmentService;
