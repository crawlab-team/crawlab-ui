<script setup lang="ts">
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  type LexicalEditor,
} from 'lexical';
import useMounted from '@/components/lexical/composables/useLexicalMounted';
import { INSERT_IMAGE_COMMAND } from '@/components/lexical/utils/image';

const props = defineProps<{
  editor: LexicalEditor;
}>();

useMounted(() => {
  const { editor } = props;

  return editor.registerCommand<InsertImageCommandPayload>(
    INSERT_IMAGE_COMMAND,
    ({ src }) => {
      editor.update(() => {
        const selection = $getSelection();
        const rootElement = editor.getRootElement();
        const paragraphNode = $createParagraphNode();
        const paragraphElement = editor.getElementByKey(paragraphNode.getKey());
        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', src);
        paragraphElement?.appendChild(imgElement);
        if (selection) {
          selection.insertNodes([paragraphNode]);
        } else {
          rootElement?.appendChild(paragraphElement!);
        }
      });
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );
});

defineOptions({ name: 'ClLexicalImagePlugin' });
</script>
