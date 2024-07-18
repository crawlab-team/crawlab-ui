import { ClSystemDetail } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = 'system';

export default [
  {
    name: 'SystemDetail',
    path: endpoint,
    title: t('layouts.routes.system.title'),
    icon: ['fa', 'cogs'],
    component: async () => ClSystemDetail,
  },
] as Array<ExtendedRouterRecord>;
