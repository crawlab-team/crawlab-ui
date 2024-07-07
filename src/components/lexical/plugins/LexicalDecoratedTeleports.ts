import { defineComponent, PropType } from 'vue';
import type { LexicalEditor } from 'lexical';
import useDecorators from '../composables/useDecorators';

export default defineComponent({
  name: 'LexicalDecoratedTeleports',
  props: {
    editor: {
      type: Object as PropType<LexicalEditor>,
      required: true,
    },
  },
  setup({ editor }) {
    const decorators = useDecorators(editor);

    return () => decorators.value;
  },
});
