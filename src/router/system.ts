import { RouteRecordRaw } from 'vue-router';

const endpoint = 'system';

export default [
  {
    name: 'SystemDetail',
    path: endpoint,
    component: () => import('@/views/system/detail/SystemDetail.vue'),
  },
] as Array<RouteRecordRaw>;
