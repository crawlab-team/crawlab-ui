<script setup lang="ts">
import type { EditorState, LexicalEditor } from 'lexical';
import useMounted from '../composables/useMounted';

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
  (e: 'change', editorState: EditorState): void;
}>();

useMounted(() => {
  const { editor } = props;
  return editor.registerUpdateListener(
    ({ editorState, dirtyElements, dirtyLeaves, prevEditorState }) => {
      if (
        props.ignoreSelectionChange &&
        dirtyElements.size === 0 &&
        dirtyLeaves.size === 0
      )
        return;

      if (props.ignoreInitialChange && prevEditorState.isEmpty()) return;

      emit('change', editorState);
    }
  );
});
defineOptions({ name: 'ClLexicalOnChangePlugin' });
</script>

<template />
