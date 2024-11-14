import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useTaskService from '@/services/task/taskService';
import { getDefaultFormComponentData } from '@/utils/form';
import useSpider from '@/components/core/spider/useSpider';
import {
  getModeOptions,
  getModeOptionsDict,
  getPriorityLabel,
} from '@/utils/task';
import { formatTimeAgo } from '@/utils/time';

// form component data
const formComponentData = getDefaultFormComponentData<Task>();

const useTask = (store: Store<RootStoreState>) => {
  const ns = 'task' as ListStoreNamespace;
  const { task: state } = store.state as RootStoreState;

  // options for default mode
  const modeOptions = getModeOptions();
  const modeOptionsDict = computed(() => getModeOptionsDict());

  const { allDict: allSpiderDict } = useSpider(store);

  // route
  const route = useRoute();

  // task id
  const id = computed(() => route.params.id);

  const allListSelectOptions = computed<SelectOption[]>(() =>
    state.allList.map(task => {
      const spider = allSpiderDict.value.get(task.spider_id!);
      const timeAgo = formatTimeAgo(task.created_ts!);
      return {
        label: `${spider?.name} (${timeAgo})`,
        value: task._id,
      };
    })
  );

  return {
    ...useForm<Task>('task', store, useTaskService(store), formComponentData),
    allSpiderDict,
    id,
    modeOptions,
    modeOptionsDict,
    getPriorityLabel,
    allListSelectOptions,
  };
};

export default useTask;
