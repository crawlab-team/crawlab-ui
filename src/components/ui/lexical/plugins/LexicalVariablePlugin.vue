<script setup lang="ts">
import { type LexicalEditor } from 'lexical';
import useVariableSetup from '@/components/ui/lexical/composables/useVariableSetup';
import useMounted from '@/components/ui/lexical/composables/useLexicalMounted';
import invariant from 'tiny-invariant';
import { VariableNode } from '@/components/ui/lexical/nodes/VariableNode';

const props = defineProps<{
  editor: LexicalEditor;
}>();

useMounted(() => {
  const { editor } = props;
  if (!editor.hasNodes([VariableNode])) {
    invariant(false, 'VariablePlugin: VariableNode not registered on editor');
  }
  return useVariableSetup(editor);
});

defineOptions({ name: 'ClLexicalVariablePlugin' });
</script>
