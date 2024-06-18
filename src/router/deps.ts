import { RouteRecordRaw } from 'vue-router';

const endpoint = 'deps';

export default [
  {
    name: 'Deps',
    path: `${endpoint}`,
    redirect: to => {
      return { path: to.path + '/settings' };
    },
  },
  {
    name: 'DepsSettings',
    path: `${endpoint}/settings`,
    component: () => import('@/views/deps/setting/DependencySettings.vue'),
  },
  {
    name: 'DepsPython',
    path: `${endpoint}/python`,
    component: () => import('@/views/deps/python/DependencyPython.vue'),
  },
  {
    name: 'DepsNode',
    path: `${endpoint}/node`,
    component: () => import('@/views/deps/node/DependencyNode.vue'),
  },
] as Array<RouteRecordRaw>;
