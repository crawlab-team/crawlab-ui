import { translate } from '@/utils/i18n';

const t = translate;

export const allVariables: NotificationVariable[] = [
  {
    category: 'task',
    name: 'id',
    label: t('components.notification.variables.task.id'),
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
    icon: ['fa', 'cogs'],
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
    icon: ['fa', 'keyboard'],
  },
  {
    category: 'task',
    name: 'priority',
    label: t('components.notification.variables.task.priority'),
    icon: ['fa', 'exclamation-circle'],
  },
  {
    category: 'task',
    name: 'pid',
    label: t('components.notification.variables.task.pid'),
    icon: ['fa', 'microchip'],
  },
  {
    category: 'task',
    name: 'createdAt',
    label: t('components.notification.variables.task.createdAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task',
    name: 'updatedAt',
    label: t('components.notification.variables.task.updatedAt'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task',
    name: 'stat.startTs',
    label: t('components.notification.variables.task.stat.startTs'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task',
    name: 'stat:endTs',
    label: t('components.notification.variables.task.stat.endTs'),
    icon: ['fa', 'clock'],
  },
  {
    category: 'task',
    name: 'stat:waitDuration',
    label: t('components.notification.variables.task.stat.waitDuration'),
    icon: ['fa', 'hourglass'],
  },
  {
    category: 'task',
    name: 'stat:runtimeDuration',
    label: t('components.notification.variables.task.stat.runtimeDuration'),
    icon: ['fa', 'hourglass-half'],
  },
  {
    category: 'task',
    name: 'stat:totalDuration',
    label: t('components.notification.variables.task.stat.totalDuration'),
    icon: ['fa', 'hourglass-end'],
  },
  {
    category: 'task',
    name: 'stat:resultCount',
    label: t('components.notification.variables.task.stat.resultCount'),
    icon: ['fa', 'chart-bar'],
  },
  {
    category: 'node',
    name: 'key',
    label: t('components.notification.variables.node.key'),
  },
  {
    category: 'node',
    name: 'name',
    label: t('components.notification.variables.node.name'),
  },
  {
    category: 'node',
    name: 'description',
    label: t('components.notification.variables.node.description'),
  },
  {
    category: 'node',
    name: 'status',
    label: t('components.notification.variables.node.status'),
  },
  {
    category: 'node',
    name: 'createdAt',
    label: t('components.notification.variables.node.createdAt'),
  },
  {
    category: 'node',
    name: 'updatedAt',
    label: t('components.notification.variables.node.updatedAt'),
  },
  {
    category: 'spider',
    name: 'name',
    label: t('components.notification.variables.spider.name'),
  },
  {
    category: 'spider',
    name: 'mode',
    label: t('components.notification.variables.spider.mode'),
  },
  {
    category: 'spider',
    name: 'cmd',
    label: t('components.notification.variables.spider.cmd'),
  },
  {
    category: 'spider',
    name: 'param',
    label: t('components.notification.variables.spider.param'),
  },
  {
    category: 'spider',
    name: 'priority',
    label: t('components.notification.variables.spider.priority'),
  },
  {
    category: 'spider',
    name: 'stat:results',
    label: t('components.notification.variables.spider.stat.results'),
  },
  {
    category: 'spider',
    name: 'stat:waitDuration',
    label: t('components.notification.variables.spider.stat.waitDuration'),
  },
  {
    category: 'spider',
    name: 'stat:runtimeDuration',
    label: t('components.notification.variables.spider.stat.runtimeDuration'),
  },
  {
    category: 'spider',
    name: 'stat:totalDuration',
    label: t('components.notification.variables.spider.stat.totalDuration'),
  },
  {
    category: 'spider',
    name: 'stat:averageWaitDuration',
    label: t(
      'components.notification.variables.spider.stat.averageWaitDuration'
    ),
  },
  {
    category: 'spider',
    name: 'stat:averageRuntimeDuration',
    label: t(
      'components.notification.variables.spider.stat.averageRuntimeDuration'
    ),
  },
];

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
