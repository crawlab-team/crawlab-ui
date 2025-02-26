import { computed } from 'vue';
import { Store } from 'vuex';
import { useRoute } from 'vue-router';
import {
  EMPTY_OBJECT_ID,
  getDefaultFormComponentData,
  translate,
} from '@/utils';
import useNotificationAlertService from '@/services/notification/useNotificationAlertService';
import useForm from '@/components/ui/form/useForm';
import { getAllMetricGroups } from '@/utils/metric';

const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<NotificationAlert>();

const useNotificationAlert = (store: Store<RootStoreState>) => {
  const { notificationAlert: state, node: nodeState } =
    store.state as RootStoreState;

  // route
  const route = useRoute();

  // notification id
  const id = computed(() => route.params.id);

  const form = computed(() => state.form);

  const metricTargetOptions = computed<SelectOption[]>(
    () =>
      [
        { label: t('common.mode.all'), value: EMPTY_OBJECT_ID },
        ...nodeState.allList
          .filter(node => node.active)
          .map(node => ({
            label: node.name,
            value: node._id,
          })),
      ] as SelectOption[]
  );

  const metricNameOptions = computed<SelectOption[]>(() => {
    const options = [] as SelectOption<string>[];
    getAllMetricGroups().forEach(group => {
      group.metrics.forEach(metric => {
        options.push({
          label: t(`components.metric.metrics.${metric}`),
          value: metric as string,
        });
      });
    });
    return options;
  });

  const operatorOptions = computed<SelectOption<NotificationAlertOperator>[]>(
    () => [
      { value: 'ge', label: '>=' },
      { value: 'le', label: '<=' },
      { value: 'gt', label: '>' },
      { value: 'lt', label: '<' },
    ]
  );

  const lastingSecondsOptions = computed<SelectOption<number>[]>(() => [
    { value: 60, label: t('views.notification.alerts.lastingDuration.1m') },
    { value: 300, label: t('views.notification.alerts.lastingDuration.5m') },
    { value: 600, label: t('views.notification.alerts.lastingDuration.10m') },
    { value: 1800, label: t('views.notification.alerts.lastingDuration.30m') },
    { value: 3600, label: t('views.notification.alerts.lastingDuration.1h') },
  ]);

  const levelOptions = computed<SelectOption<NotificationAlertLevel>[]>(() => [
    { value: 'info', label: t('views.notification.alerts.levels.info') },
    { value: 'warning', label: t('views.notification.alerts.levels.warning') },
    {
      value: 'critical',
      label: t('views.notification.alerts.levels.critical'),
    },
  ]);

  return {
    ...useForm<NotificationAlert>(
      'notificationAlert',
      store,
      useNotificationAlertService(store),
      formComponentData
    ),
    id,
    form,
    metricTargetOptions,
    metricNameOptions,
    operatorOptions,
    lastingSecondsOptions,
    levelOptions,
  };
};

export default useNotificationAlert;
