import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useSpiderService from '@/services/spider/spiderService';
import { getDefaultFormComponentData } from '@/utils/form';
import useRequest from '@/services/request';
import { FILTER_OP_CONTAINS } from '@/constants/filter';
import { getModeOptions } from '@/utils/task';
import { translate } from '@/utils/i18n';

// form component data
const formComponentData = getDefaultFormComponentData<Spider>();

const useSpider = (store: Store<RootStoreState>) => {
  // options for default mode
  const modeOptions = getModeOptions();

  // route
  const route = useRoute();

  // spider id
  const id = computed(() => route.params.id);

  return {
    ...useForm<Spider>(
      'spider',
      store,
      useSpiderService(store),
      formComponentData
    ),
    id,
    modeOptions,
  };
};

export default useSpider;
