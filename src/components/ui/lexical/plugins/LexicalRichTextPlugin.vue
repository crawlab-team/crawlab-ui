<script setup lang="ts">
import type { LexicalEditor } from 'lexical';
import useRichTextSetup from '../composables/useRichTextSetup';
import useCanShowPlaceholder from '../composables/useCanShowPlaceholder';
import Decorators from './LexicalDecoratedTeleports';

const props = defineProps<{
  editor: LexicalEditor;
}>();

const showPlaceholder = useCanShowPlaceholder(props.editor);
useRichTextSetup(props.editor);

defineOptions({ name: 'ClLexicalRichTextPlugin' });
</script>

<template>
  <slot name="contentEditable" />
  <slot v-if="showPlaceholder" name="placeholder" />
  <Decorators :editor="editor" />
</template>
