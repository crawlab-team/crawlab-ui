import { Store } from 'vuex';
import useFileService from '@/services/utils/file';

const useSpiderService = (store: Store<RootStoreState>): SpiderServices => {
  const ns = 'spider';

  return {
    ...useFileService<Spider>(ns, store),
  };
};

export default useSpiderService;
