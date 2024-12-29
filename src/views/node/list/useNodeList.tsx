import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import {
  getDefaultUseListOptions,
  onListFilterChangeByKey,
  setupListComponent,
} from '@/utils/list';
import useList from '@/layouts/content/list/useList';
import NodeType from '@/components/core/node/NodeType.vue';
import {
  TABLE_COLUMN_NAME_ACTIONS,
  TABLE_ACTION_EDIT,
  TABLE_ACTION_CUSTOMIZE_COLUMNS,
  TABLE_ACTION_EXPORT,
} from '@/constants/table';
import { ElMessage, ElMessageBox } from 'element-plus';
import useNodeService from '@/services/node/nodeService';
import { useRouter } from 'vue-router';
import { NODE_STATUS_OFFLINE, NODE_STATUS_ONLINE } from '@/constants/node';
import { translate } from '@/utils/i18n';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_ENABLE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_VIEW,
  ACTION_VIEW_MONITORING,
  ACTION_VIEW_TASKS,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
} from '@/constants';
import {
  getIconByAction,
  isAllowedAction,
  isPro,
  setupAutoUpdate,
} from '@/utils';
import {
  ClCurrentMetrics,
  ClNavLink,
  ClNodeRunners,
  ClNodeStatus,
  ClSwitch,
} from '@/components';

type Node = CNode;

const useNodeList = () => {
  // router
  const router = useRouter();

  // store
  const ns = 'node';
  const store = useStore<RootStoreState>();
  const { node: state } = store.state as RootStoreState;

  // i18n
  const t = translate;

  // services
  const { getList, deleteById } = useNodeService(store);

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
          label: t('views.nodes.navActions.new.label'),
          tooltip: t('views.nodes.navActions.new.tooltip'),
          icon: getIconByAction(ACTION_ADD),
          type: 'success',
          onClick: async () => {
            const message = (
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    marginBottom: '10px',
                    lineHeight: '1.5',
                  }}
                >
                  {t('views.nodes.notice.create.content')}
                </div>
                <a
                  href={t('views.nodes.notice.create.link.url')}
                  target="_blank"
                  style={{
                    color: '#409eff',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {t('views.nodes.notice.create.link.label')}
                </a>
              </div>
            );
            const title = t('views.nodes.notice.create.title');
            await ElMessageBox({
              title,
              message,
            });
          },
        },
      ],
    },
    {
      action: ACTION_FILTER,
      name: 'filter',
      children: [
        {
          action: ACTION_FILTER_SEARCH,
          id: 'filter-search',
          className: 'search',
          placeholder: t('views.nodes.navActions.filter.search.placeholder'),
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'name',
            FILTER_OP_CONTAINS
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-type',
          className: 'filter-select-type',
          label: t('views.nodes.navActionsExtra.filter.select.type.label'),
          options: [
            { label: t('components.node.nodeType.label.master'), value: true },
            { label: t('components.node.nodeType.label.worker'), value: false },
          ],
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'is_master',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-status',
          className: 'filter-select-status',
          label: t('views.nodes.navActionsExtra.filter.select.status.label'),
          options: [
            {
              label: t('components.node.nodeStatus.label.online'),
              value: NODE_STATUS_ONLINE,
            },
            {
              label: t('components.node.nodeStatus.label.offline'),
              value: NODE_STATUS_OFFLINE,
            },
          ],
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'status',
            FILTER_OP_EQUAL
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-enabled',
          className: 'filter-select-enabled',
          label: t('views.nodes.navActionsExtra.filter.select.enabled.label'),
          options: [
            { label: t('common.control.enabled'), value: true },
            { label: t('common.control.disabled'), value: false },
          ],
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'enabled',
            FILTER_OP_EQUAL
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<Node>>(() =>
    (
      [
        {
          key: 'name', // name
          className: 'name',
          label: t('views.nodes.table.columns.name'),
          icon: ['fa', 'font'],
          width: '150',
          value: (row: Node) => (
            <ClNavLink path={`/nodes/${row._id}`} label={row.name} />
          ),
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: 'node_type', // is_master
          className: 'node_type',
          label: t('views.nodes.table.columns.nodeType'),
          icon: ['fa', 'list'],
          width: '150',
          value: (row: Node) => {
            return <NodeType isMaster={row.is_master} />;
          },
          hasFilter: true,
          allowFilterItems: true,
          filterItems: [
            { label: t('components.node.nodeType.label.master'), value: true },
            { label: t('components.node.nodeType.label.worker'), value: false },
          ],
        },
        {
          key: 'status',
          className: 'status',
          label: t('views.nodes.table.columns.status'),
          icon: ['fa', 'heartbeat'],
          width: '150',
          value: (row: Node) => {
            return <ClNodeStatus status={row.status} />;
          },
          hasFilter: true,
          allowFilterItems: true,
          filterItems: [
            {
              label: t('components.node.nodeStatus.label.online'),
              value: NODE_STATUS_ONLINE,
            },
            {
              label: t('components.node.nodeStatus.label.offline'),
              value: NODE_STATUS_OFFLINE,
            },
          ],
        },
        {
          key: 'runners',
          className: 'runners',
          label: t('views.nodes.table.columns.runners'),
          icon: ['fa', 'play'],
          width: '160',
          value: (row: Node) => {
            if (
              row.max_runners === undefined ||
              !row.status ||
              ![NODE_STATUS_ONLINE, NODE_STATUS_OFFLINE].includes(row.status)
            ) {
              return;
            }
            return (
              <ClNodeRunners
                current={row.current_runners}
                max={row.max_runners}
                status={row.status}
              />
            );
          },
        },
        {
          key: 'enabled',
          className: 'enabled',
          label: t('views.nodes.table.columns.enabled'),
          icon: ['fa', 'toggle-on'],
          width: '120',
          value: (row: Node) => {
            return (
              <ClSwitch
                modelValue={row.enabled}
                disabled={
                  !isAllowedAction(
                    router.currentRoute.value.path,
                    ACTION_ENABLE
                  )
                }
                onUpdate:modelValue={async (value: boolean) => {
                  row.enabled = value;
                  await store.dispatch(`${ns}/updateById`, {
                    id: row._id,
                    form: row,
                  });
                  if (row.enabled) {
                    ElMessage.success(t('common.message.success.enabled'));
                  } else {
                    ElMessage.success(t('common.message.success.disabled'));
                  }
                }}
              />
            );
          },
          hasFilter: true,
          allowFilterItems: true,
          filterItems: [
            { label: t('common.control.enabled'), value: true },
            { label: t('common.control.disabled'), value: false },
          ],
        },
        {
          key: 'current-metric',
          className: 'current-metric',
          label: t('views.nodes.table.columns.currentMetrics'),
          icon: ['fa', 'chart-line'],
          width: '200',
          value: (row: Node) => {
            if (!row._id) return;
            const currentMetrics = state.nodeMetricsMap[row._id];
            return (
              <ClCurrentMetrics
                metric={currentMetrics}
                clickable
                onClick={async () => {
                  await router.push(`/nodes/${row._id}/monitoring`);
                }}
              />
            );
          },
        },
        {
          key: 'description',
          className: 'description',
          label: t('views.nodes.table.columns.description'),
          icon: ['fa', 'comment-alt'],
          width: 'auto',
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          className: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          fixed: 'right',
          width: '150',
          buttons: (
            [
              {
                tooltip: t('common.actions.view'),
                onClick: async row => {
                  await router.push(`/nodes/${row._id}`);
                },
                action: ACTION_VIEW,
              },
              {
                tooltip: t('common.actions.viewTasks'),
                onClick: async row => {
                  await router.push(`/nodes/${row._id}/tasks`);
                },
                action: ACTION_VIEW_TASKS,
                contextMenu: true,
              },
              {
                tooltip: t('common.actions.viewMonitoring'),
                onClick: async row => {
                  await router.push(`/nodes/${row._id}/monitoring`);
                },
                disabled: () => !isPro(),
                action: ACTION_VIEW_MONITORING,
                contextMenu: true,
              },
              {
                tooltip: t('common.actions.delete'),
                disabled: (row: Node) => !!row.active,
                onClick: async (row: Node) => {
                  if (row.active) return;
                  const res = await ElMessageBox.confirm(
                    t('common.messageBox.confirm.delete'),
                    t('common.actions.delete'),
                    {
                      type: 'warning',
                      confirmButtonClass: 'el-button--danger',
                    }
                  );
                  if (res) {
                    await deleteById(row._id as string);
                  }
                  await getList();
                },
                action: ACTION_DELETE,
                contextMenu: true,
              },
            ] as TableColumnButton<Node>[]
          ).filter(btn => {
            if (!isPro()) {
              return ![ACTION_VIEW_MONITORING].includes(btn.action);
            }
            return true;
          }),
          disableTransfer: true,
        },
      ] as TableColumns<Node>
    ).filter(col => {
      if (!isPro()) {
        return !['current-metric'].includes(col.key);
      }
      return true;
    })
  );

  // options
  const opts = getDefaultUseListOptions<Node>(navActions, tableColumns);

  // init
  setupListComponent(ns, store, []);

  if (isPro()) {
    onBeforeMount(() => store.dispatch(`${ns}/getNodeMetrics`));
    setupAutoUpdate(() => store.dispatch(`${ns}/getNodeMetrics`));
  }

  const selectableFunction: TableSelectableFunction<Node> = (row: Node) => {
    return !row.active;
  };

  return {
    ...useList<Node>(ns, store, opts),
    selectableFunction,
  };
};

export default useNodeList;
