import { ClSystemDetail } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = '/system';

export default [
  {
    routeConcept: 'system',
    name: 'SystemDetail',
    path: endpoint,
    title: t('layouts.routes.system.title'),
    component: async () => ClSystemDetail,
  },
] as Array<ExtendedRouterRecord>;
