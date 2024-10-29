import { App, ComponentOptionsMixin, Plugin } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'normalize.css/normalize.css';
import 'element-plus/theme-chalk/index.css';
import '@/styles/index.css';

// fontawesome
library.add(fab, far, fas);

const COMPONENT_PREFIX = 'Cl';

const makeInstaller = (
  items: [string, ComponentOptionsMixin][] = []
): Plugin => {
  const apps: App[] = [];

  // install function
  const install = (app: App<Element>) => {
    // skip if already exists in apps
    if (apps.includes(app)) return;

    // add to apps
    apps.push(app);

    // install components
    items.forEach(([name, component]) => {
      if (!name.startsWith(COMPONENT_PREFIX)) return;
      component.name = name;
      app.component(`${name}`, component);
    });
  };

  return {
    install,
  };
};

export default makeInstaller;
