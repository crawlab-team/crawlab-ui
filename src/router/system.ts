import {
  ClSystemDetail,
  ClSystemDetailTabCustomize,
  ClSystemDetailTabAi,
  ClSystemDetailTabDependency,
  ClSystemDetailTabEnvironment,
} from '@/views';
import {
  getIconByGeneralConcept,
  getIconByRouteConcept,
  translate,
} from '@/utils';

const t = translate;

const endpoint = '/system';

export default [
  {
    routeConcept: 'system',
    name: 'SystemDetail',
    path: endpoint,
    title: t('layouts.routes.system.title'),
    component: async () => ClSystemDetail,
    redirect: `${endpoint}/customize`,
    children: [
      {
        path: 'customize',
        title: t('layouts.routes.system.tabs.customize'),
        icon: getIconByGeneralConcept('customize'),
        component: async () => ClSystemDetailTabCustomize,
      },
      {
        path: 'ai',
        title: t('layouts.routes.system.tabs.ai'),
        icon: getIconByRouteConcept('ai'),
        component: async () => ClSystemDetailTabAi,
      },
      {
        path: 'dependency',
        title: t('layouts.routes.system.tabs.dependency'),
        icon: getIconByRouteConcept('dependency'),
        component: async () => ClSystemDetailTabDependency,
      },
      {
        path: 'environment',
        title: t('layouts.routes.system.tabs.environment'),
        icon: getIconByRouteConcept('environment'),
        component: async () => ClSystemDetailTabEnvironment,
      },
    ],
  },
] as Array<ExtendedRouterRecord>;
