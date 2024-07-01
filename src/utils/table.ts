import { ElMessageBox } from 'element-plus';
import { useStore } from 'vuex';
import {
  ACTION_CANCEL,
  ACTION_CLONE,
  ACTION_DELETE,
  ACTION_EDIT,
  ACTION_RUN,
  ACTION_VIEW,
} from '@/constants/action';
import { TABLE_COLUMN_NAME_ACTIONS } from '@/constants/table';
import { translate } from '@/utils/i18n';
import { getRouter } from '@/router';

// i18n
const t = translate;

export const getTableWidth = (el?: Element): number | undefined => {
  const elTable = el || document.querySelector('.table');
  if (!elTable) return;
  const style = getComputedStyle(elTable);
  const widthStr = style.width.replace('px', '');
  const width = Number(widthStr);
  if (isNaN(width)) return;
  return width;
};

export const getColumnWidth = (column: TableColumn): number | undefined => {
  let width: number;
  if (typeof column.width === 'string') {
    width = Number(column.width.replace('px', ''));
    if (isNaN(width)) return;
    return width;
  }
  {
    return column.width;
  }
};

export const getActionColumn = (
  endpoint: string,
  ns: ListStoreNamespace,
  actionNames: TableActionName[]
): TableColumn => {
  const store = useStore();

  const column = {
    key: TABLE_COLUMN_NAME_ACTIONS,
    label: t('components.table.columns.actions'),
    fixed: 'right',
    width: '200',
    buttons: [],
  } as TableColumn;

  const buttons =
    typeof column.buttons === 'function'
      ? column.buttons()
      : (column.buttons as TableColumnButton[]);

  const router = getRouter();

  actionNames.forEach(name => {
    // skip with empty buttons
    if (!buttons) return;

    // skip if router not exists
    if (!router) return;

    // current route path
    const currentRoutePath = router.currentRoute.value.path;

    // action visible function
    const actionVisibleFn = (store.state as RootStoreState).layout
      .actionVisibleFn;

    // skip if action is not allowed
    if (
      !!actionVisibleFn &&
      currentRoutePath &&
      !actionVisibleFn(currentRoutePath, name)
    ) {
      return;
    }

    switch (name) {
      case ACTION_VIEW:
        buttons.push({
          type: 'primary',
          icon: ['fa', 'search'],
          tooltip: t('common.actions.view'),
          onClick: async (row: BaseModel) => {
            await router.push(`${endpoint}/${row._id}`);
          },
        });
        break;
      case ACTION_EDIT:
        buttons.push({
          type: 'warning',
          icon: ['fa', 'edit'],
          tooltip: t('common.actions.edit'),
          onClick: (row: BaseModel) => {
            store.commit(`${ns}/setForm`, row);
            store.commit(`${ns}/showDialog`, 'edit');
          },
        });
        break;
      case ACTION_CLONE:
        buttons.push({
          type: 'info',
          size: 'small',
          icon: ['fa', 'clone'],
          tooltip: t('common.actions.clone'),
          onClick: (row: BaseModel) => {
            // TODO: implement
            // console.log('clone', row);
          },
        });
        break;
      case ACTION_DELETE:
        buttons.push({
          type: 'danger',
          size: 'small',
          icon: ['fa', 'trash-alt'],
          tooltip: t('common.actions.delete'),
          onClick: async (row: BaseModel) => {
            const res = await ElMessageBox.confirm(
              t('common.messageBox.confirm.delete'),
              t('common.actions.delete')
            );
            if (res) {
              await store.dispatch(`${ns}/deleteById`, row._id as string);
            }
            await store.dispatch(`${ns}/getList`);
          },
        });
        break;
      case ACTION_RUN:
        buttons.push({
          type: 'success',
          size: 'small',
          icon: ['fa', 'play'],
          tooltip: 'Run',
          onClick: async (row: BaseModel) => {
            store.commit(`${ns}/setForm`, row);
            store.commit(`${ns}/showDialog`, 'run');
          },
        });
        break;
      case ACTION_CANCEL:
        buttons.push({
          type: 'info',
          size: 'small',
          icon: ['fa', 'pause'],
          tooltip: 'Cancel',
          onClick: async (row: BaseModel) => {
            // TODO: implement
            // console.log('cancel', row);
          },
        });
        break;
    }
  });

  column.buttons = buttons;

  return column;
};
