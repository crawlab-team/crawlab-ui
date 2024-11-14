import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useRoleService from '@/services/role/roleService';
import { getDefaultFormComponentData } from '@/utils/form';
import { computed } from 'vue';
import { getRouteSelectOptions } from '@/utils';

// form component data
const formComponentData = getDefaultFormComponentData<Role>();

const useRole = (store: Store<RootStoreState>) => {
  const routesOptions = computed(() => getRouteSelectOptions());

  return {
    ...useForm<Role>('role', store, useRoleService(store), formComponentData),
    routesOptions,
  };
};

export default useRole;
