import {
  TASK_MODE_ALL_NODES,
  TASK_MODE_RANDOM,
  TASK_MODE_SELECTED_NODES,
  TASK_STATUS_ABNORMAL,
  TASK_STATUS_ASSIGNED,
  TASK_STATUS_CANCELLED,
  TASK_STATUS_ERROR,
  TASK_STATUS_FINISHED,
  TASK_STATUS_PENDING,
  TASK_STATUS_RUNNING,
} from '@/constants/task';
import { translate } from '@/utils/i18n';
import { computed } from 'vue';

const t = translate;

export const getPriorityLabel = (priority: number): string => {
  if (priority <= 2) {
    return t('components.task.priority.high');
  } else if (priority <= 4) {
    return t('components.task.priority.higher');
  } else if (priority <= 6) {
    return t('components.task.priority.medium');
  } else if (priority <= 8) {
    return t('components.task.priority.lower');
  } else {
    return t('components.task.priority.low');
  }
};

export const priorityOptions: SelectOption[] = [
  {
    label: getPriorityLabel(1),
    value: 1,
  },
  {
    label: getPriorityLabel(3),
    value: 3,
  },
  {
    label: getPriorityLabel(5),
    value: 5,
  },
  {
    label: getPriorityLabel(7),
    value: 7,
  },
  {
    label: getPriorityLabel(9),
    value: 9,
  },
];

export const isCancellable = (status?: TaskStatus): boolean => {
  switch (status) {
    case TASK_STATUS_PENDING:
    case TASK_STATUS_ASSIGNED:
    case TASK_STATUS_RUNNING:
      return true;
    default:
      return false;
  }
};

export const getModeOptions = (): SelectOption[] => {
  return [
    {
      value: TASK_MODE_RANDOM,
      label: t('components.task.mode.label.randomNode'),
    },
    {
      value: TASK_MODE_ALL_NODES,
      label: t('components.task.mode.label.allNodes'),
    },
    {
      value: TASK_MODE_SELECTED_NODES,
      label: t('components.task.mode.label.selectedNodes'),
    },
  ];
};

export const getModeOptionsDict = (): Map<string, SelectOption> => {
  const modeOptions = getModeOptions();
  const dict = new Map<string, SelectOption>();
  modeOptions.forEach(op => dict.set(op.value, op));
  return dict;
};

export const getStatusOptions = (): SelectOption[] => {
  return [
    {
      label: t('components.task.status.label.pending'),
      value: TASK_STATUS_PENDING,
    },
    {
      label: t('components.task.status.label.assigned'),
      value: TASK_STATUS_ASSIGNED,
    },
    {
      label: t('components.task.status.label.running'),
      value: TASK_STATUS_RUNNING,
    },
    {
      label: t('components.task.status.label.finished'),
      value: TASK_STATUS_FINISHED,
    },
    {
      label: t('components.task.status.label.error'),
      value: TASK_STATUS_ERROR,
    },
    {
      label: t('components.task.status.label.cancelled'),
      value: TASK_STATUS_CANCELLED,
    },
    {
      label: t('components.task.status.label.abnormal'),
      value: TASK_STATUS_ABNORMAL,
    },
  ];
};

export const getToRunNodes = (
  mode: TaskMode,
  nodeIds?: string[],
  activeNodes?: CNode[]
): CNode[] => {
  if (mode === TASK_MODE_ALL_NODES) {
    // All nodes
    return activeNodes || [];
  } else if (mode === TASK_MODE_RANDOM) {
    return [];
  }

  // Selected nodes
  return activeNodes?.filter(n => nodeIds?.includes(n._id!)) || [];
};
