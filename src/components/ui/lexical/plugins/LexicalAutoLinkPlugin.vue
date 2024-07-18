<script setup lang="ts">
import type { LexicalEditor } from 'lexical';
import { matchers, useAutoLink } from '@/components/ui/lexical/utils/autoLink';

const props = defineProps<{
  editor: LexicalEditor;
}>();

const emit = defineEmits<{
  (e: 'change', value: { url: string | null; prevUrl: string | null }): void;
}>();

useAutoLink(
  props.editor,
  matchers,
  (url: string | null, prevUrl: string | null) => {
    emit('change', {
      url,
      prevUrl,
    });
  }
);
defineOptions({ name: 'ClLexicalAutoLinkPlugin' });
</script>
