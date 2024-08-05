import { PropType } from 'vue';
import type { LexicalEditor } from 'lexical';

declare const _default: import('vue').DefineComponent<
  {
    editor: {
      type: PropType<LexicalEditor>;
      required: true;
    };
  },
  () => import('vue').VNode<
    import('vue').RendererNode,
    import('vue').RendererElement,
    {
      [key: string]: any;
    }
  >[],
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<{
      editor: {
        type: PropType<LexicalEditor>;
        required: true;
      };
    }>
  >,
  {},
  {}
>;
export default _default;
