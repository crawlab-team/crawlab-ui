import { ClDisclaimer, ClMyAccount } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = '/misc';

export default [
  {
    routeConcept: 'disclaimer',
    name: 'Disclaimer',
    path: `${endpoint}/disclaimer`,
    title: t('layouts.routes.misc.disclaimer'),
    component: async () => ClDisclaimer,
  },
  {
    routeConcept: 'myAccount',
    name: 'MySettings',
    path: `${endpoint}/my-account`,
    title: t('layouts.routes.misc.myAccount'),
    component: async () => ClMyAccount,
  },
] as Array<ExtendedRouterRecord>;
