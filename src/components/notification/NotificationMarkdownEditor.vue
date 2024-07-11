<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';

const modelValue = defineModel<string>();

const editorRef = ref();

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const updateEditorContent = () => {
  // editor?.setValue(form.value.template || '');
  // store.commit(`${ns}/setTemplate`, form.value.template);
};

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
  console.debug(modelValue.value);
  editor.setValue(modelValue.value || '');
};

watch(modelValue, value => {
  editor?.setValue(value);
});

onMounted(() => {
  initEditor();
});

defineOptions({ name: 'ClNotificationMarkdownEditor' });
</script>

<template>
  <div class="notification-markdown-editor">
    <div ref="editorRef" class="editor" />
  </div>
</template>

<style scoped>
.notification-markdown-editor {
  height: 100%;
  width: 100%;

  .editor {
    padding: 10px 0 0;
    height: 100%;
  }
}
</style>
