import { translate } from '@/utils';
import { ClDependencyList } from '@/views';

const t = translate;

const endpoint = '/dependencies';

export default [
  {
    routeConcept: 'dependency',
    name: 'DependencyList',
    path: endpoint,
    title: t('layouts.routes.dependencies.list.title'),
    component: async () => ClDependencyList,
  },
] as Array<ExtendedRouterRecord>;
