import {
  TAB_NAME_OVERVIEW,
  TAB_NAME_PAGES,
  TAB_NAME_USERS,
} from '@/constants/tab';
import {
  ClRoleList,
  ClRoleDetail,
  ClRoleDetailTabOverview,
  ClRoleDetailTabPages,
  ClRoleDetailTabUsers,
} from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = '/roles';

export default [
  {
    routeConcept: 'role',
    name: 'RoleList',
    path: endpoint,
    title: t('layouts.routes.roles.list.title'),
    component: async () => ClRoleList,
  },
  {
    routeConcept: 'role',
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
      {
        path: TAB_NAME_PAGES,
        title: t('layouts.routes.roles.detail.tabs.pages'),
        icon: getIconByTabName(TAB_NAME_PAGES),
        component: async () => ClRoleDetailTabPages,
      },
      {
        path: TAB_NAME_USERS,
        title: t('layouts.routes.roles.detail.tabs.users'),
        icon: getIconByTabName(TAB_NAME_USERS),
        component: async () => ClRoleDetailTabUsers,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
