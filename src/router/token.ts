import { ClTokenList } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = 'tokens';

export default [
  {
    name: 'TokenList',
    path: endpoint,
    title: t('layouts.routes.tokens.title'),
    icon: ['fa', 'key'],
    component: async () => ClTokenList,
  },
] as Array<ExtendedRouterRecord>;
