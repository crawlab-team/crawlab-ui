import { ClTokenList } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = '/tokens';

export default [
  {
    routeConcept: 'token',
    name: 'TokenList',
    path: endpoint,
    title: t('layouts.routes.tokens.list.title'),
    component: async () => ClTokenList,
  },
] as Array<ExtendedRouterRecord>;
