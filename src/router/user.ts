import { RouteRecordRaw } from 'vue-router';
import { TAB_NAME_OVERVIEW } from '@/constants/tab';
import { ClUserDetail, ClUserDetailTabOverview, ClUserList } from '@/views';

export default [
  {
    name: 'UserList',
    path: 'users',
    component: () => ClUserList,
  },
  {
    name: 'UserDetail',
    path: 'users/:id',
    redirect: to => {
      return { path: to.path + '/' + TAB_NAME_OVERVIEW };
    },
    component: () => ClUserDetail,
    children: [
      {
        path: TAB_NAME_OVERVIEW,
        component: () => ClUserDetailTabOverview,
      },
    ],
  },
] as Array<RouteRecordRaw>;
