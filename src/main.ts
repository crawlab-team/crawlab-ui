import { createApp } from '@/package';

(function () {
  // create app options
  const options = {} as CreateAppOptions;

  // create app
  createApp(options).then(app => {
    // @ts-ignore
    window._app = app;
  });
})();
