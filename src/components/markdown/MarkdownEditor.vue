<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';
import TurndownService from 'turndown';
import ClMarkdownEditorToolbar from '@/components/markdown/MarkdownEditorToolbar.vue';
import { ElMessageBox } from 'element-plus';

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
  initEditor();
});

onBeforeUnmount(() => {
  editor?.dispose();
});

const onEdit = async (
  handleText: (value: string, prompt?: string) => string,
  prompt?: () => Promise<{ value: string }>
) => {
  let promptValue = '';
  if (prompt) {
    promptValue = (await prompt()).value;
  }

  if (!editor) return;
  const model = editor.getModel();
  let range = editor?.getSelection();
  if (range.isEmpty()) {
    const position = editor.getPosition();
    const wordInfo = model.getWordAtPosition(position);
    range = new monaco.Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn
    );
    editor.setSelection(range);
  }
  const value = editor?.getModel()?.getValueInRange(range);
  model.pushEditOperations(
    [],
    [
      {
        range,
        text: handleText(value || '', promptValue),
      },
    ],
    () => null
  );
};

const linkPrompt = async () => {
  return await ElMessageBox.prompt('Link URL', {
    inputPlaceholder: 'Please enter URL',
  });
};

defineOptions({ name: 'ClMarkdownEditor' });
</script>

<template>
  <div class="markdown-editor">
    <cl-markdown-editor-toolbar
      :editor="editor"
      :content="modelValue"
      @undo="editor?.trigger(editor?.getModel().uri, 'undo')"
      @redo="editor?.trigger(editor?.getModel().uri, 'redo')"
      @bold="onEdit(value => `**${value}**`)"
      @italic="onEdit(value => `_${value}_`)"
      @strikethrough="onEdit(value => `~~${value}~~`)"
      @link="
        onEdit(
          (value, url) => `[${value}](${url || 'https://example.com'})`,
          linkPrompt
        )
      "
    />
    <div ref="editorRef" class="editor" />
  </div>
</template>

<style scoped>
.markdown-editor {
  height: calc(100% - 45px);
  width: 100%;

  .editor {
    height: 100%;
  }
}
</style>
