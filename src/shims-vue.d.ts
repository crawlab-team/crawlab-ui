import { VNode } from 'vue';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module '*.svg' {
  import { DefineComponent } from 'vue';
  const content: DefineComponent<{}, {}, any>;
  export default content;
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
