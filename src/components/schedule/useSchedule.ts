import { computed, watch } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/form/useForm';
import useScheduleService from '@/services/schedule/scheduleService';
import { getDefaultFormComponentData } from '@/utils/form';
import { parseExpression } from 'cron-parser';
import { getModeOptions } from '@/utils/task';
import useSpider from '@/components/spider/useSpider';
import { translate } from '@/utils/i18n';
import useScheduleDetail from '@/views/schedule/detail/useScheduleDetail';

// i18n
const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<Schedule>();

const useSchedule = (store: Store<RootStoreState>) => {
  // store
  const ns = 'schedule';
  const state = store.state[ns];

  const { allDict: allSpiderDict } = useSpider(store);

  // form
  const form = computed<Schedule>(() => state.form);

  // options for default mode
  const modeOptions = getModeOptions();

  // form rules
  const formRules: FormRules = {
    cron: {
      trigger: 'blur',
      validator: (_, value: string, callback) => {
        const invalidMessage = t(
          'components.schedule.rules.message.invalidCronExpression'
        );
        if (!value) return callback(invalidMessage);
        if (value.trim().split(' ').length != 5)
          return callback(invalidMessage);
        try {
          parseExpression(value);
          callback();
        } catch (e: any) {
          callback(e.message);
        }
      },
    },
  };

  // all schedule select options
  const allScheduleSelectOptions = computed<SelectOption[]>(() =>
    state.allList.map(d => {
      return {
        label: d.name,
        value: d._id,
      };
    })
  );

  const { activeId } = useScheduleDetail();

  watch(
    () => form.value?.spider_id,
    () => {
      if (activeId.value) return;
      if (!form.value?.spider_id) return;
      const spider = allSpiderDict.value.get(form.value?.spider_id);
      if (!spider) return;
      const payload = { ...form.value } as Schedule;
      if (spider.cmd) payload.cmd = spider.cmd;
      if (spider.param) payload.param = spider.param;
      if (spider.mode) payload.mode = spider.mode;
      if (spider.node_ids?.length) payload.node_ids = spider.node_ids;
      if (spider.node_tags?.length) payload.node_tags = spider.node_tags;
      store.commit(`${ns}/setForm`, payload);
    }
  );

  return {
    ...useForm('schedule', store, useScheduleService(store), formComponentData),
    modeOptions,
    formRules,
    allScheduleSelectOptions,
  };
};

export default useSchedule;
