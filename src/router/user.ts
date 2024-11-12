import { TAB_NAME_OVERVIEW } from '@/constants/tab';
import { ClUserDetail, ClUserDetailTabOverview, ClUserList } from '@/views';
import { getIconByTabName, translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = '/users';

export default [
  {
    routeConcept: 'user',
    name: 'UserList',
    path: endpoint,
    title: t('layouts.routes.users.list.title'),
    component: async () => ClUserList,
  },
  {
    routeConcept: 'user',
    name: 'UserDetail',
    path: `${endpoint}/:id`,
    title: t('layouts.routes.users.detail.title'),
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClUserDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.users.detail.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClUserDetailTabOverview,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
