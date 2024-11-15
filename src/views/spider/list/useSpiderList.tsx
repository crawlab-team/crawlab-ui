import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { translate } from '@/utils/i18n';
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_RUN,
  ACTION_UPLOAD_FILES,
  ACTION_VIEW,
  ACTION_VIEW_DATA,
  ACTION_VIEW_DEPENDENCIES,
  ACTION_VIEW_FILES,
  ACTION_VIEW_SCHEDULES,
  ACTION_VIEW_TASKS,
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
} from '@/constants';
import { TABLE_COLUMN_NAME_ACTIONS } from '@/constants/table';
import { onListFilterChangeByKey, setupListComponent } from '@/utils/list';
import useList from '@/layouts/content/list/useList';
import {
  ClTaskStatus,
  ClNavLink,
  ClTime,
  ClSpiderStat,
  ClGitRepo,
} from '@/components';
import useProject from '@/components/core/project/useProject';
import { EMPTY_OBJECT_ID, getIconByAction, isPro } from '@/utils';

const useSpiderList = () => {
  // i18n
  const t = translate;

  // router
  const router = useRouter();

  // store
  const ns = 'spider';
  const store = useStore<RootStoreState>();
  const { commit } = store;

  // use list
  const { actionFunctions } = useList<Task>(ns, store);

  // action functions
  const { deleteByIdConfirm } = actionFunctions;

  const { allListSelectOptions: allProjectListSelectOptions } =
    useProject(store);
  // const allProjectList = computed<Project[]>(() => store.state.project.allList);

  // all project dict
  const allProjectDict = computed<Map<string, Project>>(
    () => store.getters['project/allDict']
  );

  // nav actions
  const navActions = computed<ListActionGroup[]>(() => [
    {
      action: ACTION_ADD,
      name: 'common',
      children: [
        {
          action: ACTION_ADD,
          id: 'add-btn',
          className: 'add-btn',
          buttonType: 'label',
          label: t('views.spiders.navActions.new.label'),
          tooltip: t('views.spiders.navActions.new.tooltip'),
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
          action: ACTION_FILTER_SEARCH,
          id: 'filter-search',
          className: 'search',
          placeholder: t('views.spiders.navActions.filter.search.placeholder'),
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'name',
            FILTER_OP_CONTAINS
          ),
        },
        {
          action: ACTION_FILTER_SELECT,
          id: 'filter-select-project',
          className: 'filter-select-project',
          label: t('views.spiders.navActionsExtra.filter.select.project.label'),
          optionsRemote: {
            colName: 'projects',
          },
          onChange: onListFilterChangeByKey(
            store,
            ns,
            'project_id',
            FILTER_OP_EQUAL
          ),
        },
      ],
    },
  ]);

  // table columns
  const tableColumns = computed<TableColumns<Spider>>(() =>
    (
      [
        {
          key: 'name',
          className: 'name',
          label: t('views.spiders.table.columns.name'),
          icon: ['fa', 'font'],
          width: '160',
          align: 'left',
          value: (row: Spider) => (
            <ClNavLink path={`/spiders/${row._id}`} label={row.name} />
          ),
          hasSort: true,
          hasFilter: true,
          allowFilterSearch: true,
        },
        {
          key: 'project_id',
          className: 'project_id',
          label: t('views.spiders.table.columns.project'),
          icon: ['fa', 'project-diagram'],
          width: '120',
          value: (row: Spider) => {
            if (!row.project_id) return;
            const p = allProjectDict.value.get(row.project_id);
            return (
              <ClNavLink label={p?.name} path={`/projects/${row.project_id}`} />
            );
          },
          hasFilter: true,
          allowFilterSearch: true,
          allowFilterItems: true,
          filterItems: allProjectListSelectOptions.value,
        },
        {
          key: 'git_id',
          className: 'git_id',
          label: t('views.spiders.table.columns.git'),
          icon: ['fab', 'git'],
          width: '240',
          value: (row: Spider) => {
            if (!row.git_id || row.git_id === EMPTY_OBJECT_ID) return;
            return (
              <ClGitRepo
                name={row.git?.name}
                gitRootPath={row.git_root_path}
                onClick={() => router.push(`/gits/${row.git_id}`)}
              />
            );
          },
          hasFilter: true,
          allowFilterSearch: true,
          proOnly: true,
        },
        {
          key: 'last_status',
          className: 'last_status',
          label: t('views.spiders.table.columns.lastStatus'),
          icon: ['fa', 'heartbeat'],
          width: '120',
          value: (row: Spider) => {
            const { _id, status, error } = row.stat?.last_task || {};
            if (!status) return;
            return (
              <ClTaskStatus
                status={status}
                error={error}
                clickable={true}
                onClick={() => router.push(`/tasks/${_id}`)}
              />
            );
          },
        },
        {
          key: 'last_run_ts',
          className: 'last_run_ts',
          label: t('views.spiders.table.columns.lastRunAt'),
          icon: ['fa', 'clock'],
          width: '160',
          value: (row: Spider) => {
            const time = row.stat?.last_task?.stat?.start_ts;
            if (!time) return;
            return <ClTime time={time} />;
          },
        },
        {
          key: 'stats',
          className: 'status',
          label: t('views.spiders.table.columns.stats'),
          icon: ['fa', 'chart-pie'],
          width: '240',
          value: (row: Spider) => {
            const stat = row.stat;
            if (!stat || !stat.tasks) return;
            return (
              <ClSpiderStat
                stat={stat}
                onTasksClick={() => router.push(`/spiders/${row._id}/tasks`)}
                onResultsClick={() => router.push(`/spiders/${row._id}/data`)}
                onDurationClick={() => router.push(`/spiders/${row._id}/tasks`)}
              />
            );
          },
        },
        {
          key: 'create_ts',
          className: 'create_ts',
          label: t('views.spiders.table.columns.createTs'),
          icon: ['far', 'calendar-plus'],
          width: '160',
          defaultHidden: true,
        },
        {
          key: 'update_ts',
          className: 'update_ts',
          label: t('views.spiders.table.columns.updateTs'),
          icon: ['far', 'calendar-check'],
          width: '160',
          defaultHidden: true,
        },
        {
          key: 'description',
          className: 'description',
          label: t('views.spiders.table.columns.description'),
          icon: ['fa', 'comment-alt'],
          width: 'auto',
        },
        {
          key: TABLE_COLUMN_NAME_ACTIONS,
          className: TABLE_COLUMN_NAME_ACTIONS,
          label: t('components.table.columns.actions'),
          icon: ['fa', 'tools'],
          width: '150',
          fixed: 'right',
          buttons: [
            {
              tooltip: t('common.actions.view'),
              onClick: async (row: Spider) => {
                await router.push(`/spiders/${row._id}`);
              },
              action: ACTION_VIEW,
            },
            {
              tooltip: t('common.actions.run'),
              onClick: (row: Spider) => {
                store.commit(`${ns}/setForm`, row);
                store.commit(`${ns}/showDialog`, 'run');
              },
              action: ACTION_RUN,
            },
            {
              tooltip: t('common.actions.uploadFiles'),
              onClick: (row: Spider) => {
                store.commit(`${ns}/setForm`, row);
                store.commit(`${ns}/showDialog`, 'uploadFiles');
              },
              action: ACTION_UPLOAD_FILES,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewFiles'),
              onClick: async (row: Spider) => {
                await router.push(`/spiders/${row._id}/files`);
              },
              action: ACTION_VIEW_FILES,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewTasks'),
              onClick: async (row: Spider) => {
                await router.push(`/spiders/${row._id}/tasks`);
              },
              action: ACTION_VIEW_TASKS,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewSchedules'),
              onClick: async (row: Spider) => {
                await router.push(`/spiders/${row._id}/schedules`);
              },
              action: ACTION_VIEW_SCHEDULES,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewData'),
              onClick: async (row: Spider) => {
                await router.push(`/spiders/${row._id}/data`);
              },
              action: ACTION_VIEW_DATA,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.viewDependencies'),
              onClick: async (row: Spider) => {
                await router.push(`/spiders/${row._id}/dependencies`);
              },
              action: ACTION_VIEW_DEPENDENCIES,
              proOnly: true,
              contextMenu: true,
            },
            {
              tooltip: t('common.actions.delete'),
              onClick: deleteByIdConfirm,
              action: ACTION_DELETE,
              contextMenu: true,
            },
          ],
          disableTransfer: true,
        },
      ] as TableColumns<Spider>
    ).filter(col => {
      if (isPro()) return true;
      return !col.proOnly;
    })
  );

  // options
  const opts = {
    navActions,
    tableColumns,
  } as UseListOptions<Spider>;

  // init
  setupListComponent(ns, store, ['node', 'project']);

  return {
    ...useList<Spider>(ns, store, opts),
  };
};

export default useSpiderList;
