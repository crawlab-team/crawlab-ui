import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/form/useForm';
import useSpiderService from '@/services/spider/spiderService';
import { getDefaultFormComponentData } from '@/utils/form';
import useRequest from '@/services/request';
import { FILTER_OP_CONTAINS } from '@/constants/filter';
import { getModeOptions } from '@/utils/task';
import { translate } from '@/utils/i18n';

const { getList } = useRequest();

// form component data
const formComponentData = getDefaultFormComponentData<Spider>();

const useSpider = (store: Store<RootStoreState>) => {
  // i18n
  const t = translate;

  // options for default mode
  const modeOptions = getModeOptions();

  // route
  const route = useRoute();

  // spider id
  const id = computed(() => route.params.id);

  // fetch data collections
  const fetchDataCollection = async (query: string) => {
    const conditions = [
      {
        key: 'name',
        op: FILTER_OP_CONTAINS,
        value: query,
      },
    ] as FilterConditionData[];
    const res = await getList(`/data/collections`, { conditions });
    return res.data;
  };

  // fetch data collection suggestions
  const fetchDataCollectionSuggestions = (query: string, cb: Function) => {
    fetchDataCollection(query).then(data => {
      cb(
        data?.map((d: DataCollection) => {
          return {
            _id: d._id,
            value: d.name,
          };
        })
      );
    });
  };

  return {
    ...useForm('spider', store, useSpiderService(store), formComponentData),
    id,
    modeOptions,
    fetchDataCollection,
    fetchDataCollectionSuggestions,
  };
};

export default useSpider;
