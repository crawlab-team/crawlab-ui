import { RouteRecordRaw } from 'vue-router';
import { ClLogin } from '@/views';

const endpoint = '/login';

export default [
  {
    name: 'Login',
    path: endpoint,
    component: () => ClLogin,
  },
] as Array<RouteRecordRaw>;
