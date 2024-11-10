import { Store } from 'vuex';
import { getDefaultService } from '@/utils/service';

const useRoleService = (store: Store<RootStoreState>): Services<Role> => {
  const ns = 'role';

  return {
    ...getDefaultService<Role>(ns, store),
  };
};

export default useRoleService;
