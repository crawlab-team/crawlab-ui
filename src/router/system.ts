import { RouteRecordRaw } from 'vue-router';
import { ClSystemDetail } from '@/views';

const endpoint = 'system';

export default [
  {
    name: 'SystemDetail',
    path: endpoint,
    component: async () => ClSystemDetail,
  },
] as Array<RouteRecordRaw>;
