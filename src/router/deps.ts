import {
  ClDependencyNode,
  ClDependencyPython,
  ClDependencySettings,
} from '@/views';
import { translate } from '@/utils';
import { RouteLocation } from 'vue-router';

const t = translate;

const endpoint = 'deps';

export default [
  {
    name: 'Deps',
    path: endpoint,
    title: t('layouts.routes.dependencies.title'),
    icon: ['fa', 'puzzle-piece'],
    redirect: (to: RouteLocation) => {
      return { path: to.path + '/settings' };
    },
    children: [
      {
        name: 'DepsSettings',
        path: 'settings',
        title: t('layouts.routes.dependencies.settings'),
        icon: ['fa', 'cog'],
        component: async () => ClDependencySettings,
      },
      {
        name: 'DepsPython',
        path: 'python',
        title: t('layouts.routes.dependencies.lang.python'),
        icon: ['fab', 'python'],
        component: async () => ClDependencyPython,
      },
      {
        name: 'DepsNode',
        path: 'node',
        title: t('layouts.routes.dependencies.lang.node'),
        icon: ['fab', 'node'],
        component: async () => ClDependencyNode,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
