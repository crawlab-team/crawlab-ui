import { RouteRecordRaw } from 'vue-router';
import { TAB_NAME_OVERVIEW } from '@/constants/tab';
import { ClUserDetail, ClUserDetailTabOverview, ClUserList } from '@/views';

export default [
  {
    name: 'UserList',
    path: 'users',
    component: async () => ClUserList,
  },
  {
    name: 'UserDetail',
    path: 'users/:id',
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: async () => ClUserDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: async () => ClUserDetailTabOverview,
      },
    ],
  },
] as Array<RouteRecordRaw>;
