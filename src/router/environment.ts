import { ClEnvironmentList } from '@/views';
import { getIconByRouteConcept, translate } from '@/utils';

const t = translate;

const endpoint = '/environments';

export default [
  {
    routeConcept: 'environment',
    name: 'EnvironmentList',
    path: endpoint,
    title: t('layouts.routes.environments.list.title'),
    component: async () => ClEnvironmentList,
  },
] as Array<ExtendedRouterRecord>;
