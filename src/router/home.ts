import { ClHome } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = 'home';

export default [
  {
    name: 'Home',
    path: endpoint,
    title: t('layouts.routes.home'),
    icon: ['fa', 'home'],
    component: async () => ClHome,
  },
] as Array<ExtendedRouterRecord>;
