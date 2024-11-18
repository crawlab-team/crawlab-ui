import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  ACTION_ADD,
  ACTION_CANCEL,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_FORCE_CANCEL,
  ACTION_RESTART,
  ACTION_VIEW,
  ACTION_VIEW_DATA,
  ACTION_VIEW_LOGS,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
  TABLE_COLUMN_NAME_ACTIONS,
  TASK_STATUS_PENDING,
  TASK_STATUS_RUNNING,
} from '@/constants';
import { useList } from '@/layouts';
import { onListFilterChangeByKey, setupListComponent } from '@/utils/list';
import { translate } from '@/utils/i18n';
import { getStatusOptions, priorityOptions } from '@/utils/task';
import useRequest from '@/services/request';
import {
  ClNodeTag,
  ClNavLink,
  ClTime,
  ClDuration,
  ClTaskStatus,
  ClTaskPriority,
  ClTaskResults,
  ClTaskCommand,
} from '@/components';
import { getIconByAction } from '@/utils/icon';

const { post } = useRequest();

const useTaskList = () => {
  // i18n
  const t = translate;

  // store
  const ns = 'task';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // router
  const router = useRouter();

  // use list
  const { actionFunctions } = useList<Task>(ns, store);

  // action functions
  const { deleteByIdConfirm } = actionFunctions;

  // cancel task function
  const cancelTask = async (row: Task, force: boolean) => {
    if (force) {
      ElMessage.info(t('common.message.info.forceCancel'));
    } else {
      ElMessage.info(t('common.message.info.cancel'));
    }

    try {
      await post(`/tasks/${row._id}/cancel`, { force });
      await store.dispatch(`${ns}/getList`);
    } catch (e) {
      ElMessage.error(t('common.message.error.action'));
    }
  };

  // all node dict
  const allNodeDict = computed<Map<string, CNode>>(
    () => store.getters['node/allDict']
  );

  // all spider dict
  const allSpiderDict = computed<Map<string, Spider>>(
    () => store.getters['spider/allDict']
  );

  // all schedule dict
  const allScheduleDict = computed<Map<string, Schedule>>(
    () => store.getters['schedule/allDict']
  );

  // nav actions
  const navActions = computed<ListActionGroup[]>(() => [
    {
      name: 'common',
      children: [
        {
          action: ACTION_ADD,
          id: 'add-btn',
          className: 'add-btn',
          buttonType: 'label',
          label: t('views.tasks.navActions.new.label'),
          tooltip: t('views.tasks.navActions.new.tooltip'),
          icon: getIconByAction(ACTION_ADD),
          type: 'success',
          onClick: () => {
            commit(`${ns}/showDialog`, 'create');
          },
        },
      ],
    },
    {
      action: ACTION_FILTER,
      name: 'filter',
      children: [
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-status',
          className: 'filter-select-status',
          label: t('views.tasks.navActionsExtra.filter.select.status.label'),
          options: getStatusOptions(),
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'status',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-node',
          className: 'filter-select-node',
          label: t('views.tasks.navActionsExtra.filter.select.node.label'),
          optionsRemote: {
            colName: 'nodes',
          },
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'node_id',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-spider',
          className: 'filter-select-spider',
          label: t('views.tasks.navActionsExtra.filter.select.spider.label'),
          optionsRemote: {
            colName: 'spiders',
          },
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'spider_id',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-schedule',
          className: 'filter-select-schedule',
          label: t('views.tasks.navActionsExtra.filter.select.schedule.label'),
          optionsRemote: {
            colName: 'schedules',
          },
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'schedule_id',
            FILTER_OP_EQUAL
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<Task>>(
    () =>
      [
        {
          key: 'node_id',
          label: t('views.tasks.table.columns.node'),
          icon: ['fa', 'server'],
          width: '160',
          value: (row: Task) => {
            if (!row.node_id) return;
            const node = allNodeDict.value.get(row.node_id);
            if (!node) return;
            return (
              <ClNodeTag
                node={node}
                clickable
                onClick={async () => {
                  await router.push(`/nodes/${node?._id}`);
                }}
              />
            );
          },
        },
        {
          key: 'spider_id',
          label: t('views.tasks.table.columns.spider'),
          icon: ['fa', 'spider'],
          width: '160',
          value: (row: Task) => {
            if (!row.spider_id) return;
            const spider = row.spider || allSpiderDict.value.get(row.spider_id);
            return (
              <ClNavLink
                label={spider?.name}
                path={`/spiders/${spider?._id}`}
              />
            );
          },
        },
        {
          key: 'schedule_id',
          label: t('views.tasks.table.columns.schedule'),
          icon: ['fa', 'clock'],
          width: '160',
          value: (row: Task) => {
            if (!row.schedule_id) return;
            const schedule = allScheduleDict.value.get(row.schedule_id);
            return (
              <ClNavLink
                label={schedule?.name}
                path={`/schedules/${schedule?._id}`}
              />
            );
          },
        },
        {
          key: 'priority',
          label: t('views.tasks.table.columns.priority'),
          icon: ['fa', 'sort-numeric-down'],
          width: '120',
          value: (row: Task) => {
            return <ClTaskPriority priority={row.priority} />;
          },
        },
        {
          key: 'config',
          label: t('views.tasks.table.columns.cmd'),
          icon: ['fa', 'terminal'],
          width: '160',
          value: (row: Task) => {
            return (
              <ClTaskCommand
                task={row}
                spider={allSpiderDict.value?.get(row.spider_id as string)}
                size="small"
              />
            );
          },
        },
        {
          key: 'status',
          label: t('views.tasks.table.columns.status'),
          icon: ['fa', 'check-square'],
          width: '120',
          value: (row: Task) => {
            return (
              <ClTaskStatus
                status={row.status}
                error={row.error}
                clickable
                onClick={async () => {
                  await router.push(`/tasks/${row._id}/logs`);
                }}
              />
            );
          },
        },
        {
          key: 'stat_create_ts',
          label: t('views.tasks.table.columns.stat.create_ts'),
          icon: ['fa', 'clock'],
          width: '120',
          value: (row: Task) => {
            if (!row.stat?.create_ts || row.stat?.create_ts.startsWith('000')) {
              return;
            }
            return <ClTime time={row.stat?.create_ts} />;
          },
          defaultHidden: true,
        },
        {
          key: 'stat_start_ts',
          label: t('views.tasks.table.columns.stat.start_ts'),
          icon: ['fa', 'clock'],
          width: '120',
          value: (row: Task) => {
            if (!row.stat?.start_ts || row.stat?.start_ts.startsWith('000')) {
              return;
            }
            return <ClTime time={row.stat?.start_ts} />;
          },
        },
        {
          key: 'stat_end_ts',
          label: t('views.tasks.table.columns.stat.end_ts'),
          icon: ['fa', 'clock'],
          width: '120',
          value: (row: Task) => {
            if (!row.stat?.end_ts || row.stat?.end_ts.startsWith('000')) {
              return;
            }
            return <ClTime time={row.stat?.end_ts} />;
          },
        },
        {
          key: 'stat_wait_duration',
          label: t('views.tasks.table.columns.stat.wait_duration'),
          icon: ['fa', 'stopwatch'],
          width: '160',
          value: (row: Task) => {
            if (!row.stat?.wait_duration) return;
            return <ClDuration duration={row.stat?.wait_duration} />;
          },
          defaultHidden: true,
        },
        {
          key: 'stat_runtime_duration',
          label: t('views.tasks.table.columns.stat.runtime_duration'),
          icon: ['fa', 'stopwatch'],
          width: '160',
          value: (row: Task) => {
            if (!row.stat?.runtime_duration) return;
            return <ClDuration duration={row.stat?.runtime_duration} />;
          },
          defaultHidden: true,
        },
        {
          key: 'stat_total_duration',
          label: t('views.tasks.table.columns.stat.total_duration'),
          icon: ['fa', 'stopwatch'],
          width: '160',
          value: (row: Task) => {
            if (!row.stat?.total_duration) return;
            return <ClDuration duration={row.stat?.total_duration} />;
          },
        },
        {
          key: 'stat_result_count',
          label: t('views.tasks.table.columns.stat.results'),
          icon: ['fa', 'table'],
          width: '150',
          value: (row: Task) => {
            if (row.stat?.result_count === undefined) return;
            return (
              <ClTaskResults
                results={row.stat.result_count}
                status={row.status}
                clickable
                onClick={async () => {
                  await router.push(`/tasks/${row._id}/data`);
                }}
              />
            );
          },
        },
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          icon: ['fa', 'tools'],
          width: '150',
          fixed: 'right',
          buttons: (row: Task) =>
            (
              [
                {
                  tooltip: t('common.actions.view'),
                  onClick: async (row: Task) => {
                    await router.push(`/tasks/${row._id}`);
                  },
                  action: ACTION_VIEW,
                },
                {
                  tooltip: t('common.actions.viewLogs'),
                  onClick: async (row: Task) => {
                    await router.push(`/tasks/${row._id}/logs`);
                  },
                  action: ACTION_VIEW_LOGS,
                },
                {
                  icon: getIconByAction(ACTION_VIEW_DATA),
                  className: 'view-data-btn',
                  tooltip: t('common.actions.viewData'),
                  contextMenu: true,
                  onClick: async (row: Task) => {
                    await router.push(`/tasks/${row._id}/data`);
                  },
                  action: ACTION_VIEW_DATA,
                },
                {
                  tooltip: t('common.actions.restart'),
                  contextMenu: true,
                  onClick: async (row: Task) => {
                    await ElMessageBox.confirm(
                      t('common.messageBox.confirm.restart'),
                      t('common.actions.restart'),
                      {
                        type: 'warning',
                        confirmButtonClass: 'restart-confirm-btn',
                      }
                    );
                    await post(`/tasks/${row._id}/restart`);
                    ElMessage.success(t('common.message.success.restart'));
                    await store.dispatch(`task/getList`);
                  },
                  action: ACTION_RESTART,
                },
                {
                  tooltip: t('common.actions.cancel'),
                  contextMenu: true,
                  onClick: async (row: Task) => {
                    await ElMessageBox.confirm(
                      t('common.messageBox.confirm.cancel'),
                      t('common.actions.cancel'),
                      {
                        type: 'warning',
                        confirmButtonClass: 'cancel-confirm-btn',
                      }
                    );
                    await cancelTask(row, false);
                  },
                  action: ACTION_CANCEL,
                },
                {
                  tooltip: t('common.actions.forceCancel'),
                  contextMenu: true,
                  onClick: async (row: Task) => {
                    await ElMessageBox.confirm(
                      t('common.messageBox.confirm.forceCancel'),
                      t('common.actions.forceCancel'),
                      {
                        type: 'warning',
                        confirmButtonClass: 'cancel-confirm-btn',
                      }
                    );
                    await cancelTask(row, true);
                  },
                  action: ACTION_FORCE_CANCEL,
                },
                {
                  tooltip: t('common.actions.delete'),
                  contextMenu: true,
                  onClick: deleteByIdConfirm,
                  action: ACTION_DELETE,
                },
              ] as TableColumnButton<Task>[]
            ).filter(btn => {
              switch (btn.action) {
                case ACTION_CANCEL:
                  return [TASK_STATUS_PENDING, TASK_STATUS_RUNNING].includes(
                    row.status!
                  );
                case ACTION_FORCE_CANCEL:
                  return row.status === TASK_STATUS_RUNNING;
                case ACTION_DELETE:
                  return ![TASK_STATUS_PENDING, TASK_STATUS_RUNNING].includes(
                    row.status!
                  );
                default:
                  return true;
              }
            }),
          disableTransfer: true,
        },
      ] as TableColumns<Task>
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Task>;

  // init
  setupListComponent(ns, store, ['node', 'project', 'spider', 'schedule']);

  return {
    ...useList<Task>(ns, store, opts),
  };
};

export default useTaskList;
