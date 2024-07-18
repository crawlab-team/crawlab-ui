import { TAB_NAME_OVERVIEW } from '@/constants/tab';
import { ClUserDetail, ClUserDetailTabOverview, ClUserList } from '@/views';
import { getIconByTabName, translate } from '@/utils';

const t = translate;

const endpoint = 'users';

export default [
  {
    name: 'UserList',
    path: endpoint,
    title: t('layouts.routes.users.title'),
    icon: ['fa', 'users'],
    component: async () => ClUserList,
  },
  {
    name: 'UserDetail',
    path: `${endpoint}/:id`,
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClUserDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        title: t('layouts.routes.users.tabs.overview'),
        icon: getIconByTabName(TAB_NAME_OVERVIEW),
        component: async () => ClUserDetailTabOverview,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
