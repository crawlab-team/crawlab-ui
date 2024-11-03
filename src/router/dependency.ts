import { translate } from '@/utils';
import { ClDependencyList } from '@/views';

const t = translate;

const endpoint = 'dependencies';

export default [
  {
    name: 'DependencyList',
    path: endpoint,
    title: t('layouts.routes.dependencies.title'),
    icon: ['fa', 'cubes'],
    component: async () => ClDependencyList,
  },
] as Array<ExtendedRouterRecord>;
