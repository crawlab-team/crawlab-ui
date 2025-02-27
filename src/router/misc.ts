import { ClDisclaimer, ClMyAccount, ClTokenList } from '@/views';
import { translate } from '@/utils';

const t = translate;

const endpoint = '/misc';

export default [
  {
    routeConcept: 'myAccount',
    name: 'MySettings',
    path: `${endpoint}/my-account`,
    title: t('layouts.routes.misc.tabs.myAccount'),
    component: async () => ClMyAccount,
  },
  {
    routeConcept: 'disclaimer',
    name: 'Disclaimer',
    path: `${endpoint}/disclaimer`,
    title: t('layouts.routes.misc.tabs.disclaimer'),
    component: async () => ClDisclaimer,
  },
  {
    routeConcept: 'pat',
    name: 'PAT',
    path: `${endpoint}/pat`,
    title: t('layouts.routes.misc.tabs.pat'),
    component: async () => ClTokenList,
  },
] as Array<ExtendedRouterRecord>;
