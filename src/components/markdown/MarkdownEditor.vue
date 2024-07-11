<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';
import TurndownService from 'turndown';

const modelValue = defineModel<string>();

const props = defineProps<{
  id?: string;
  richTextContent?: string;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const turndownService = new TurndownService();

const editorRef = ref();

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const addSaveKeyMap = () => {
  editor?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
    emit('save')
  );
};

watch(
  () => props.id,
  () => {
    editor?.setValue(modelValue.value || '');
  }
);

watch(
  () => props.richTextContent,
  value => {
    const markdown = turndownService.turndown(value);
    console.debug(markdown);
  }
);

const initEditor = async () => {
  if (!editorRef.value) return;
  editor = monaco.editor.create(editorRef.value, {
    language: 'markdown',
    lineNumbers: 'off',
    lineNumbersMinChars: 0,
    lineDecorationsWidth: 0,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    automaticLayout: true,
  });

  addSaveKeyMap();

  editor.setValue(modelValue.value || '');

  editor.onDidChangeModelContent(() => {
    modelValue.value = editor?.getValue() || '';
  });
};

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  editor?.dispose();
});

defineOptions({ name: 'ClMarkdownEditor' });
</script>

<template>
  <div class="markdown-editor">
    <div ref="editorRef" class="editor" />
  </div>
</template>

<style scoped>
.markdown-editor {
  height: 100%;
  width: 100%;

  .editor {
    height: 100%;
  }
}
</style>
