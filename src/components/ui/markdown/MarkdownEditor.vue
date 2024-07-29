<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';
import { ElMessageBox } from 'element-plus';
import { debounce } from 'lodash';

const modelValue = defineModel<string>();

const props = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const editorRef = ref();

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const initMarkdown = async () => {
  // 获取现有的 Markdown 配置
  const markdown = monaco.languages
    .getLanguages()
    .find(lang => lang.id === 'markdown');
  if (markdown) {
    // @ts-ignore
    const { language } = await markdown.loader();
    language.tokenizer.root.push([/\$\{(\w+):(\w+)\}/, 'variable']);
  }

  // 定义新的配色方案
  monaco.editor.defineTheme('default', {
    base: 'vs',
    inherit: true,
    rules: [
      {
        token: 'variable',
        foreground: 'E6A23C',
        fontStyle: 'italic',
      },
    ],
    colors: {},
  });
  monaco.editor.setTheme('default');
};

const addSaveKeyMap = () => {
  editor?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
    emit('save')
  );
};

const updateValue = () => {
  if (!modelValue.value) return;
  editor?.setValue(modelValue.value || '');
};

const initEditor = debounce(async () => {
  if (!editorRef.value) return;
  if (!editor) {
    await initMarkdown();

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

  updateValue();
});
onMounted(initEditor);
watch(
  () => props.id,
  () => {
    editor?.dispose();
    editor = null;
    initEditor();
  }
);

onBeforeUnmount(() => {
  editor?.dispose();
});

const onEdit = async (
  handleText: (value?: string, prompt?: string) => string,
  prompt?: () => Promise<{ value: string }>
) => {
  let promptValue = '';
  if (prompt) {
    promptValue = (await prompt()).value;
  }

  if (!editor) return;
  const model = editor.getModel();
  if (!model) return;
  let range = editor?.getSelection() as monaco.Selection;
  if (!range || range.isEmpty()) {
    const position = editor.getPosition();
    if (!position) return;
    const wordInfo = model.getWordAtPosition(position);
    if (wordInfo) {
      range = new monaco.Selection(
        position.lineNumber,
        wordInfo.startColumn,
        position.lineNumber,
        wordInfo.endColumn
      );
      editor.setSelection(range);
    }
  }
  const value = editor?.getModel()?.getValueInRange(range);
  const text = handleText(value, promptValue);
  model.pushEditOperations(
    [],
    [
      {
        range,
        text,
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
      @undo="editor?.trigger(editor?.getModel()?.uri.toString(), 'undo', null)"
      @redo="editor?.trigger(editor?.getModel()?.uri.toString(), 'redo', null)"
      @bold="onEdit(value => `**${value}**`)"
      @italic="onEdit(value => `_${value}_`)"
      @strikethrough="onEdit(value => `~~${value}~~`)"
      @link="
        onEdit(
          (value, url) => `[${value}](${url || 'https://example.com'})`,
          linkPrompt
        )
      "
      @variable="
        ({ name, category }: VariableForm) =>
          onEdit(() => `\${${category}:${name}}`)
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
