import { translate } from '@/utils/i18n';

const t = translate;

export const allVariables: NotificationVariable[] = [
  {
    category: 'task',
    name: 'id',
    label: t('components.notification.variables.common.id'),
    icon: ['fa', 'hashtag'],
  },
  {
    category: 'task',
    name: 'status',
    label: t('components.notification.variables.task.status'),
    icon: ['fa', 'check-square'],
  },
  {
    category: 'task',
    name: 'mode',
    label: t('components.notification.variables.task.mode'),
    icon: ['fa', 'cog'],
  },
  {
    category: 'task',
    name: 'cmd',
    label: t('components.notification.variables.task.cmd'),
    icon: ['fa', 'terminal'],
  },
  {
    category: 'task',
    name: 'param',
    label: t('components.notification.variables.task.param'),
    icon: ['fa', 'dollar'],
  },
  {
    category: 'task',
    name: 'priority',
    label: t('components.notification.variables.task.priority'),
    icon: ['fa', 'exclamation-circle'],
  },
  {
    category: 'task',
    name: 'error',
    label: t('components.notification.variables.task.error'),
    icon: ['fa', 'exclamation-triangle'],
  },
  {
    category: 'task',
    name: 'pid',
    label: t('components.notification.variables.task.pid'),
    icon: ['fa', 'microchip'],
  },
  {
    category: 'task',
    name: 'created_ts',
    label: t('components.notification.variables.common.createdAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task',
    name: 'created_by',
    label: t('components.notification.variables.common.createdBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'task',
    name: 'updated_ts',
    label: t('components.notification.variables.common.updatedAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task',
    name: 'updated_by',
    label: t('components.notification.variables.common.updatedBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'task_stat',
    name: 'start_ts',
    label: t('components.notification.variables.taskStat.startTs'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task_stat',
    name: 'end_ts',
    label: t('components.notification.variables.taskStat.endTs'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task_stat',
    name: 'wait_duration',
    label: t('components.notification.variables.taskStat.waitDuration'),
    icon: ['fa', 'hourglass'],
  },
  {
    category: 'task_stat',
    name: 'runtime_duration',
    label: t('components.notification.variables.taskStat.runtimeDuration'),
    icon: ['fa', 'hourglass-half'],
  },
  {
    category: 'task_stat',
    name: 'total_duration',
    label: t('components.notification.variables.taskStat.totalDuration'),
    icon: ['fa', 'hourglass-end'],
  },
  {
    category: 'task_stat',
    name: 'result_count',
    label: t('components.notification.variables.taskStat.resultCount'),
    icon: ['fa', 'chart-bar'],
  },
  {
    category: 'spider',
    name: 'id',
    label: t('components.notification.variables.common.id'),
    icon: ['fa', 'hashtag'],
  },
  {
    category: 'spider',
    name: 'name',
    label: t('components.notification.variables.spider.name'),
    icon: ['fa', 'font'],
  },
  {
    category: 'spider',
    name: 'description',
    label: t('components.notification.variables.spider.description'),
    icon: ['fa', 'comment'],
  },
  {
    category: 'spider',
    name: 'mode',
    label: t('components.notification.variables.spider.mode'),
    icon: ['fa', 'cog'],
  },
  {
    category: 'spider',
    name: 'cmd',
    label: t('components.notification.variables.spider.cmd'),
    icon: ['fa', 'terminal'],
  },
  {
    category: 'spider',
    name: 'param',
    label: t('components.notification.variables.spider.param'),
    icon: ['fa', 'dollar'],
  },
  {
    category: 'spider',
    name: 'priority',
    label: t('components.notification.variables.spider.priority'),
    icon: ['fa', 'exclamation-circle'],
  },
  {
    category: 'spider',
    name: 'created_ts',
    label: t('components.notification.variables.common.createdAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'spider',
    name: 'created_by',
    label: t('components.notification.variables.common.createdBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'spider',
    name: 'updated_ts',
    label: t('components.notification.variables.common.updatedAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'spider',
    name: 'updated_by',
    label: t('components.notification.variables.common.updatedBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'spider_stat',
    name: 'results',
    label: t('components.notification.variables.spiderStat.results'),
    icon: ['fa', 'chart-bar'],
  },
  {
    category: 'spider_stat',
    name: 'wait_duration',
    label: t('components.notification.variables.spiderStat.waitDuration'),
    icon: ['fa', 'hourglass'],
  },
  {
    category: 'spider_stat',
    name: 'runtime_duration',
    label: t('components.notification.variables.spiderStat.runtimeDuration'),
    icon: ['fa', 'hourglass-half'],
  },
  {
    category: 'spider_stat',
    name: 'total_duration',
    label: t('components.notification.variables.spiderStat.totalDuration'),
    icon: ['fa', 'hourglass-end'],
  },
  {
    category: 'spider_stat',
    name: 'average_wait_duration',
    label: t(
      'components.notification.variables.spiderStat.averageWaitDuration'
    ),
    icon: ['fa', 'hourglass'],
  },
  {
    category: 'spider_stat',
    name: 'average_runtime_duration',
    label: t(
      'components.notification.variables.spiderStat.averageRuntimeDuration'
    ),
    icon: ['fa', 'hourglass-half'],
  },
  {
    category: 'schedule',
    name: 'id',
    label: t('components.notification.variables.common.id'),
    icon: ['fa', 'hashtag'],
  },
  {
    category: 'schedule',
    name: 'name',
    label: t('components.notification.variables.schedule.name'),
    icon: ['fa', 'font'],
  },
  {
    category: 'schedule',
    name: 'description',
    label: t('components.notification.variables.schedule.description'),
    icon: ['fa', 'comment'],
  },
  {
    category: 'schedule',
    name: 'cron',
    label: t('components.notification.variables.schedule.cron'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'schedule',
    name: 'cmd',
    label: t('components.notification.variables.schedule.cmd'),
    icon: ['fa', 'terminal'],
  },
  {
    category: 'schedule',
    name: 'param',
    label: t('components.notification.variables.schedule.param'),
    icon: ['fa', 'dollar'],
  },
  {
    category: 'schedule',
    name: 'priority',
    label: t('components.notification.variables.schedule.priority'),
    icon: ['fa', 'exclamation-circle'],
  },
  {
    category: 'schedule',
    name: 'mode',
    label: t('components.notification.variables.schedule.mode'),
    icon: ['fa', 'cog'],
  },
  {
    category: 'schedule',
    name: 'enabled',
    label: t('components.notification.variables.schedule.enabled'),
    icon: ['fa', 'check-square'],
  },
  {
    category: 'schedule',
    name: 'created_ts',
    label: t('components.notification.variables.common.createdAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'schedule',
    name: 'created_by',
    label: t('components.notification.variables.common.createdBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'schedule',
    name: 'updated_ts',
    label: t('components.notification.variables.common.updatedAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'schedule',
    name: 'updated_by',
    label: t('components.notification.variables.common.updatedBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'node',
    name: 'id',
    label: t('components.notification.variables.common.id'),
    icon: ['fa', 'hashtag'],
  },
  {
    category: 'node',
    name: 'key',
    label: t('components.notification.variables.node.key'),
    icon: ['fa', 'key'],
  },
  {
    category: 'node',
    name: 'name',
    label: t('components.notification.variables.node.name'),
    icon: ['fa', 'font'],
  },
  {
    category: 'node',
    name: 'description',
    label: t('components.notification.variables.node.description'),
    icon: ['fa', 'comment'],
  },
  {
    category: 'node',
    name: 'status',
    label: t('components.notification.variables.node.status'),
    icon: ['fa', 'check-square'],
  },
  {
    category: 'node',
    name: 'created_ts',
    label: t('components.notification.variables.common.createdAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'node',
    name: 'created_by',
    label: t('components.notification.variables.common.createdBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'node',
    name: 'updated_ts',
    label: t('components.notification.variables.common.updatedAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'node',
    name: 'updated_by',
    label: t('components.notification.variables.common.updatedBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'alert',
    name: 'name',
    label: t('components.notification.variables.alert.name'),
    icon: ['fa', 'font'],
  },
  {
    category: 'alert',
    name: 'name',
    label: t('components.notification.variables.alert.description'),
    icon: ['fa', 'comment'],
  },
  {
    category: 'alert',
    name: 'enabled',
    label: t('components.notification.variables.alert.enabled'),
    icon: ['fa', 'check-square'],
  },
  {
    category: 'alert',
    name: 'metric_name',
    label: t('components.notification.variables.alert.metricName'),
    icon: ['fa', 'chart-bar'],
  },
  {
    category: 'alert',
    name: 'operator',
    label: t('components.notification.variables.alert.operator'),
    icon: ['fa', 'equals'],
  },
  {
    category: 'alert',
    name: 'lasting_seconds',
    label: t('components.notification.variables.alert.lastingDuration'),
    icon: ['fa', 'hourglass'],
  },
  {
    category: 'alert',
    name: 'target_value',
    label: t('components.notification.variables.alert.targetValue'),
    icon: ['fa', 'bullseye'],
  },
  {
    category: 'alert',
    name: 'level',
    label: t('components.notification.variables.alert.level'),
    icon: ['fa', 'exclamation-triangle'],
  },
  {
    category: 'alert',
    name: 'created_ts',
    label: t('components.notification.variables.common.createdAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'alert',
    name: 'created_by',
    label: t('components.notification.variables.common.createdBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'alert',
    name: 'updated_ts',
    label: t('components.notification.variables.common.updatedAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'alert',
    name: 'updated_by',
    label: t('components.notification.variables.common.updatedBy'),
    icon: ['fa', 'user'],
  },
  {
    category: 'metric',
    name: 'cpu_usage_percent',
    label: t('components.metric.metrics.cpu_usage_percent'),
    icon: ['fa', 'microchip'],
  },
  {
    category: 'metric',
    name: 'total_memory',
    label: t('components.metric.metrics.total_memory'),
    icon: ['fa', 'memory'],
  },
  {
    category: 'metric',
    name: 'available_memory',
    label: t('components.metric.metrics.available_memory'),
    icon: ['fa', 'memory'],
  },
  {
    category: 'metric',
    name: 'used_memory',
    label: t('components.metric.metrics.used_memory'),
    icon: ['fa', 'memory'],
  },
  {
    category: 'metric',
    name: 'used_memory_percent',
    label: t('components.metric.metrics.used_memory_percent'),
    icon: ['fa', 'memory'],
  },
  {
    category: 'metric',
    name: 'total_disk',
    label: t('components.metric.metrics.total_disk'),
    icon: ['fa', 'hdd'],
  },
  {
    category: 'metric',
    name: 'available_disk',
    label: t('components.metric.metrics.available_disk'),
    icon: ['fa', 'hdd'],
  },
  {
    category: 'metric',
    name: 'used_disk',
    label: t('components.metric.metrics.used_disk'),
    icon: ['fa', 'hdd'],
  },
  {
    category: 'metric',
    name: 'used_disk_percent',
    label: t('components.metric.metrics.used_disk_percent'),
    icon: ['fa', 'hdd'],
  },
  {
    category: 'metric',
    name: 'disk_read_bytes_rate',
    label: t('components.metric.metrics.disk_read_bytes_rate'),
    icon: ['fa', 'hdd'],
  },
  {
    category: 'metric',
    name: 'disk_write_bytes_rate',
    label: t('components.metric.metrics.disk_write_bytes_rate'),
    icon: ['fa', 'hdd'],
  },
  {
    category: 'metric',
    name: 'network_bytes_sent_rate',
    label: t('components.metric.metrics.network_bytes_sent_rate'),
    icon: ['fa', 'network-wired'],
  },
  {
    category: 'metric',
    name: 'network_bytes_recv_rate',
    label: t('components.metric.metrics.network_bytes_recv_rate'),
    icon: ['fa', 'network-wired'],
  },
];

export const getTriggerTarget = (
  trigger?: NotificationTrigger
): NotificationTriggerTarget | undefined => {
  if (trigger?.startsWith('task')) {
    return 'task';
  } else if (trigger?.startsWith('node')) {
    return 'node';
  } else if (trigger === 'alert') {
    return 'alert';
  } else {
    return;
  }
};

export const triggerTargetVariableCategoryMap: Record<
  NotificationTriggerTarget,
  NotificationVariableCategory[]
> = {
  task: [
    'task',
    'task_stat',
    'node',
    'spider',
    'spider_stat',
    'git',
    'project',
    'schedule',
    'user',
  ],
  node: ['node'],
  alert: ['alert', 'node', 'metric'],
};

export const isValidVariable = ({
  category,
  name,
}: {
  category?: NotificationVariableCategory;
  name: string;
}) => {
  if (!category) {
    return allVariables.some(v => `${v.category}:${v.name}` === name);
  }

  return allVariables.some(v => v.category === category && v.name === name);
};

export const allTemplates: NotificationSettingTemplate[] = [
  {
    key: 'task_finish',
    name: 'components.notification.setting.templates.task_finish.name',
    description:
      'components.notification.setting.templates.task_finish.description',
    trigger: 'task_finish',
    template_mode: 'markdown',
    title: 'components.notification.setting.templates.task_finish.title',
    template_markdown:
      'components.notification.setting.templates.task_finish.template_markdown',
  },
  {
    key: 'task_error',
    name: 'components.notification.setting.templates.task_error.name',
    description:
      'components.notification.setting.templates.task_error.description',
    trigger: 'task_error',
    template_mode: 'markdown',
    title: 'components.notification.setting.templates.task_error.title',
    template_markdown:
      'components.notification.setting.templates.task_error.template_markdown',
  },
  {
    key: 'node_status_change',
    name: 'components.notification.setting.templates.node_status_change.name',
    description:
      'components.notification.setting.templates.node_status_change.description',
    trigger: 'node_status_change',
    template_mode: 'markdown',
    title: 'components.notification.setting.templates.node_status_change.title',
    template_markdown:
      'components.notification.setting.templates.node_status_change.template_markdown',
  },
  {
    key: 'node_offline',
    name: 'components.notification.setting.templates.node_offline.name',
    description:
      'components.notification.setting.templates.node_offline.description',
    trigger: 'node_offline',
    template_mode: 'markdown',
    title: 'components.notification.setting.templates.node_offline.title',
    template_markdown:
      'components.notification.setting.templates.node_offline.template_markdown',
  },
  {
    key: 'alert_cpu_critical',
    name: 'components.notification.setting.templates.alert_cpu_critical.name',
    description:
      'components.notification.setting.templates.alert_cpu_critical.description',
    trigger: 'alert',
    template_mode: 'markdown',
    title: 'components.notification.setting.templates.alert_cpu_critical.title',
    template_markdown:
      'components.notification.setting.templates.alert_cpu_critical.template_markdown',
  },
  {
    key: 'alert_memory_warning',
    name: 'components.notification.setting.templates.alert_memory_warning.name',
    description:
      'components.notification.setting.templates.alert_memory_warning.description',
    trigger: 'alert',
    template_mode: 'markdown',
    title:
      'components.notification.setting.templates.alert_memory_warning.title',
    template_markdown:
      'components.notification.setting.templates.alert_memory_warning.template_markdown',
  },
];

export const alertTemplates: NotificationAlertTemplate[] = [
  {
    key: 'alert_cpu_critical',
    name: 'components.notification.setting.templates.alert_cpu_critical.name',
    description:
      'components.notification.setting.templates.alert_cpu_critical.description',
    metric_name: 'cpu_usage_percent',
    operator: 'gt',
    target_value: 90,
    lasting_seconds: 300,
    level: 'critical',
  },
  {
    key: 'alert_cpu_warning',
    name: 'components.notification.setting.templates.alert_cpu_warning.name',
    description:
      'components.notification.setting.templates.alert_cpu_warning.description',
    metric_name: 'cpu_usage_percent',
    operator: 'gt',
    target_value: 80,
    lasting_seconds: 300,
    level: 'warning',
  },
  {
    key: 'alert_memory_critical',
    name: 'components.notification.setting.templates.alert_memory_critical.name',
    description:
      'components.notification.setting.templates.alert_memory_critical.description',
    metric_name: 'used_memory_percent',
    operator: 'gt',
    target_value: 90,
    lasting_seconds: 300,
    level: 'critical',
  },
  {
    key: 'alert_memory_warning',
    name: 'components.notification.setting.templates.alert_memory_warning.name',
    description:
      'components.notification.setting.templates.alert_memory_warning.description',
    metric_name: 'used_memory_percent',
    operator: 'gt',
    target_value: 70,
    lasting_seconds: 300,
    level: 'warning',
  },
  {
    key: 'alert_disk_critical',
    name: 'components.notification.setting.templates.alert_disk_critical.name',
    description:
      'components.notification.setting.templates.alert_disk_critical.description',
    metric_name: 'used_disk_percent',
    operator: 'gt',
    target_value: 90,
    lasting_seconds: 300,
    level: 'critical',
  },
  {
    key: 'alert_disk_warning',
    name: 'components.notification.setting.templates.alert_disk_warning.name',
    description:
      'components.notification.setting.templates.alert_disk_warning.description',
    metric_name: 'used_disk_percent',
    operator: 'gt',
    target_value: 70,
    lasting_seconds: 300,
    level: 'warning',
  },
];

export const getTriggerOptions = (): SelectOption<string>[] => [
  {
    label: t('views.notification.settings.triggerTargets.task'),
    icon: ['fa', 'tasks'],
    value: 'task',
    children: [
      {
        label: t('views.notification.settings.triggers.task.finish'),
        value: 'task_finish',
        icon: ['fa', 'flag-checkered'],
      },
      {
        label: t('views.notification.settings.triggers.task.error'),
        value: 'task_error',
        icon: ['fa', 'times'],
      },
      {
        label: t('views.notification.settings.triggers.task.emptyResults'),
        value: 'task_empty_results',
        icon: ['fa', 'exclamation-circle'],
      },
    ],
  },
  {
    label: t('views.notification.settings.triggerTargets.node'),
    icon: ['fa', 'server'],
    value: 'node',
    children: [
      {
        label: t('views.notification.settings.triggers.node.statusChange'),
        value: 'node_status_change',
        icon: ['fa', 'exchange-alt'],
      },
      {
        label: t('views.notification.settings.triggers.node.online'),
        value: 'node_online',
        icon: ['fa', 'check-circle'],
      },
      {
        label: t('views.notification.settings.triggers.node.offline'),
        value: 'node_offline',
        icon: ['fa', 'times-circle'],
      },
    ],
  },
  {
    label: t('views.notification.settings.triggerTargets.alert'),
    icon: ['fa', 'bell'],
    value: 'alert',
  },
];

export const hasNotificationSettingMailChannel = (
  form: NotificationSetting,
  allChannelDict: Map<string, NotificationChannel>
) => {
  return form.channel_ids?.some(channelId => {
    const channel = allChannelDict.get(channelId) as
      | NotificationChannel
      | undefined;
    return channel?.type === 'mail';
  });
};

export const hasNotificationSettingChannelWarningMissingMailConfigFields = (
  form: NotificationSetting,
  allChannelDict: Map<string, NotificationChannel>
) => {
  const hasMailChannel = hasNotificationSettingMailChannel(
    form,
    allChannelDict
  );

  if (hasMailChannel) {
    return !form.sender_email || !form.mail_to;
  }

  return false;
};
