import { RouteRecordRaw } from 'vue-router';
import { ClHome } from '@/views';

const endpoint = 'home';

export default [
  {
    name: 'Home',
    path: endpoint,
    component: async () => ClHome,
  },
] as Array<RouteRecordRaw>;
