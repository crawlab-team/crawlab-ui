import { RouteRecordRaw } from 'vue-router';
import {
  ClDependencyNode,
  ClDependencyPython,
  ClDependencySettings,
} from '@/views';

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
    component: async () => ClDependencySettings,
  },
  {
    name: 'DepsPython',
    path: `${endpoint}/python`,
    component: async () => ClDependencyPython,
  },
  {
    name: 'DepsNode',
    path: `${endpoint}/node`,
    component: async () => ClDependencyNode,
  },
] as Array<RouteRecordRaw>;
