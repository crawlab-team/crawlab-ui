import { Store } from 'vuex';
import useFileService from '@/services/utils/file';

const useGitService = (store: Store<RootStoreState>): GitServices => {
  const ns = 'git';

  return {
    ...useFileService<Git>(ns, store),
  };
};

export default useGitService;
