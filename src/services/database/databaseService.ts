import { Store } from 'vuex';
import { getDefaultService } from '@/utils';

const useDataSourceService = (
  store: Store<RootStoreState>
): Services<Database> => {
  const ns = 'ds';

  return {
    ...getDefaultService<Database>(ns, store),
  };
};

export default useDataSourceService;
