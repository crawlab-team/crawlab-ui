import { TAB_NAME_OVERVIEW } from '@/constants/tab';
import { ClRoleList, ClRoleDetail, ClRoleDetailTabOverview } from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = 'roles';

export default [
  {
    name: 'RoleList',
    path: endpoint,
    title: t('layouts.routes.roles.list.title'),
    icon: ['fa', 'user-tag'],
    component: async () => ClRoleList,
  },
  {
    name: 'RoleDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.roles.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClRoleDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.roles.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClRoleDetailTabOverview,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
