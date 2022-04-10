import makeInstaller from './make-installer';
import {mapElements} from './utils';
import * as components from '../components';
import * as layouts from '../layouts';
import {
  ClSpiderDetail,
} from '../views';

export const installer = makeInstaller([
  ...mapElements(components),
  ...mapElements(layouts),
  ...mapElements({
    ClSpiderDetail,
  }),
]);

export {default as createApp} from './create-app';
