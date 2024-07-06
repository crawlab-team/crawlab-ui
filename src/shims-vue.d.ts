import { VNode } from 'vue';

declare module '*.scss';
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  namespace JSX {
    interface Element extends VNode {}

    interface ElementClass {
      $props: any;
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
