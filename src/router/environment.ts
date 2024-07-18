import { ClEnvironmentList } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = 'environments';

export default [
  {
    name: 'EnvironmentList',
    path: endpoint,
    title: t('layouts.routes.environments.title'),
    icon: ['fa', 'percent'],
    component: async () => ClEnvironmentList,
  },
] as Array<ExtendedRouterRecord>;
