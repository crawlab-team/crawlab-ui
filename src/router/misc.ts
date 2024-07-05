import { RouteRecordRaw } from 'vue-router';
import { ClDisclaimer, ClMySettings } from '@/views';

const endpoint = 'misc';

export default [
  {
    name: 'Disclaimer',
    path: `${endpoint}/disclaimer`,
    component: () => ClDisclaimer,
  },
  {
    name: 'MySettings',
    path: `${endpoint}/my-settings`,
    component: () => ClMySettings,
  },
] as Array<RouteRecordRaw>;
