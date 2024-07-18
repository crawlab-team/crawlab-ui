import { ClDisclaimer, ClMySettings } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = 'misc';

export default [
  {
    name: 'Disclaimer',
    path: `${endpoint}/disclaimer`,
    title: t('layouts.routes.misc.disclaimer'),
    icon: ['fa', 'file-signature'],
    component: async () => ClDisclaimer,
  },
  {
    name: 'MySettings',
    path: `${endpoint}/my-settings`,
    title: t('layouts.routes.misc.mySettings'),
    icon: ['fa', 'user-cog'],
    component: async () => ClMySettings,
  },
] as Array<ExtendedRouterRecord>;
