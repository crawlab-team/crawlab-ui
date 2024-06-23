import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/form/useForm';
import useTaskService from '@/services/task/taskService';
import { getDefaultFormComponentData } from '@/utils/form';
import {
  FORM_FIELD_TYPE_INPUT_WITH_BUTTON,
  FORM_FIELD_TYPE_SELECT,
} from '@/constants/form';
import useSpider from '@/components/spider/spider';
import {
  getModeOptions,
  getModeOptionsDict,
  getPriorityLabel,
} from '@/utils/task';
import { translate } from '@/utils/i18n';

// i18n
const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<Task>();

const useTask = (store: Store<RootStoreState>) => {
  // store state
  const { task: state } = store.state as RootStoreState;

  // options for default mode
  const modeOptions = getModeOptions();
  const modeOptionsDict = computed(() => getModeOptionsDict());

  // priority options
  const priorityOptions = (() => {
    const opts = [] as SelectOption[];
    for (let i = 1; i <= 10; i++) {
      opts.push({
        label: getPriorityLabel(i),
        value: i,
      });
    }
    return opts;
  })();

  const { allDict: allSpiderDict } = useSpider(store);

  // route
  const route = useRoute();

  // task id
  const id = computed(() => route.params.id);

  return {
    ...useForm('task', store, useTaskService(store), formComponentData),
    allSpiderDict,
    id,
    modeOptions,
    modeOptionsDict,
    priorityOptions,
    getPriorityLabel,
  };
};

export default useTask;
