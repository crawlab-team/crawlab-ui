import { RouteRecordRaw } from 'vue-router';

const endpoint = '/login';

export default [
  {
    name: 'Login',
    path: endpoint,
    component: () => ClLogin,
  },
] as Array<RouteRecordRaw>;
