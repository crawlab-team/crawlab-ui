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

const initEditor = async () => {
  if (!editorRef.value) return;
  if (!editor) {
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

    editor.onDidChangeModelContent(() => {
      modelValue.value = editor?.getValue() || '';
    });
  }

  let handle = setInterval(() => {
    if (modelValue.value) {
      editor?.setValue(modelValue.value || '');
    } else if (props.richTextContent) {
      const markdown = turndownService.turndown(props.richTextContent);
      editor?.setValue(markdown);
    } else {
      return;
    }
    clearInterval(handle);
  }, 50);
};

onMounted(() => {
  console.debug('onMounted');
  initEditor();
});

onBeforeUnmount(() => {
  console.debug('onBeforeUnmount');
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
  padding-top: 10px;
  height: 100%;
  width: 100%;

  .editor {
    height: 100%;
  }
}
</style>
