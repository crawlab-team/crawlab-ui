<script setup lang="ts">
import {
  $getRoot,
  EditorState,
  LexicalEditor,
  SerializedEditor,
} from 'lexical';
import useMounted from '../composables/useLexicalMounted';
import { $generateHtmlFromNodes } from '@lexical/html';

const props = withDefaults(
  defineProps<{
    editor: LexicalEditor;
    ignoreInitialChange?: boolean;
    ignoreSelectionChange?: boolean;
  }>(),
  {
    ignoreInitialChange: true,
    ignoreSelectionChange: false,
  }
);

const emit = defineEmits<{
  (e: 'change-rich-text', value: string): void;
  (e: 'change-rich-text-json', value: string): void;
}>();

useMounted(() => {
  const { editor } = props;
  return editor.registerUpdateListener(
    ({ _, dirtyElements, dirtyLeaves, prevEditorState }) => {
      if (
        props.ignoreSelectionChange &&
        dirtyElements.size === 0 &&
        dirtyLeaves.size === 0
      )
        return;

      if (props.ignoreInitialChange && prevEditorState.isEmpty()) return;

      editor?.getEditorState().read(() => {
        emit('change-rich-text', $generateHtmlFromNodes(editor));
        emit('change-rich-text-json', JSON.stringify(editor.toJSON()));
      });
    }
  );
});
defineOptions({ name: 'ClLexicalOnChangePlugin' });
</script>

<template />
