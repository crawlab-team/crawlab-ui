import { ClDisclaimer, ClMySettings } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = 'misc';

export default [
  {
    routeConcept: 'disclaimer',
    name: 'Disclaimer',
    path: `${endpoint}/disclaimer`,
    title: t('layouts.routes.misc.disclaimer'),
    component: async () => ClDisclaimer,
  },
  {
    routeConcept: 'mySettings',
    name: 'MySettings',
    path: `${endpoint}/my-settings`,
    title: t('layouts.routes.misc.mySettings'),
    component: async () => ClMySettings,
  },
] as Array<ExtendedRouterRecord>;
