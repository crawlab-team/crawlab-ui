import { Store } from 'vuex';
import { getDefaultService } from '@/utils';

const useDataSourceService = (
  store: Store<RootStoreState>
): Services<DataSource> => {
  const ns = 'ds';

  return {
    ...getDefaultService<DataSource>(ns, store),
  };
};

export default useDataSourceService;
