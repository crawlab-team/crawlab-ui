import { createApp } from '@/package';

createApp().then(app => {
  // @ts-ignore
  window._app = app;
});
