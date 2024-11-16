<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeMount } from 'vue';
import * as monaco from 'monaco-editor';
import { getLanguageByFileName, translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    filePath?: string;
    diff?: GitDiff;
    readonly: boolean;
  }>(),
  {
    readonly: true,
  }
);

const t = translate;

const language = computed<string>(() => {
  return getLanguageByFileName(props.filePath || '');
});

const editorRef = ref<HTMLDivElement | null>(null);

const themeColors = ref<monaco.editor.IColors>({});

const styles = computed<FileEditorStyles>(() => {
  return {
    default: {
      backgroundColor: themeColors.value['editor.background'],
      color: themeColors.value['editor.foreground'],
    },
    active: {
      backgroundColor: themeColors.value['editor.selectionHighlightBackground'],
      color: themeColors.value['editor.foreground'],
    },
  };
});

const updateEditorContent = () => {
  const { diff } = props;
  originalModel.setValue(diff?.parent_content || '');
  modifiedModel.setValue(diff?.current_content || '');
  monaco.editor.setModelLanguage(originalModel, language.value);
  monaco.editor.setModelLanguage(modifiedModel, language.value);
};

let diffEditor: monaco.editor.IDiffEditor | null = null;
let originalModel: monaco.editor.ITextModel;
let modifiedModel: monaco.editor.ITextModel;

onMounted(() => {
  const { filePath, diff, readonly } = props;

  originalModel = monaco.editor.createModel(
    diff?.current_content || '',
    language.value,
    monaco.Uri.parse(`file:///${filePath} (original)`)
  );
  modifiedModel = monaco.editor.createModel(
    diff?.parent_content || '',
    language.value,
    monaco.Uri.parse(`file://${filePath} (modified)`)
  );

  if (editorRef.value) {
    diffEditor = monaco.editor.createDiffEditor(editorRef.value, {
      automaticLayout: true,
      enableSplitViewResizing: true,
      renderSideBySide: true,
      theme: 'vs-dark',
      readOnly: readonly,
    });
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
    // @ts-ignore
    const themeService = diffEditor?._editors?.original?._themeService;
    themeColors.value = themeService?.getColorTheme()?.themeData?.colors || {};

    updateEditorContent();
  }
});
watch(() => JSON.stringify(props.diff), updateEditorContent);

onBeforeMount(() => {
  diffEditor?.dispose();
});
defineOptions({ name: 'ClFileDiff' });
</script>

<template>
  <div class="file-diff">
    <div class="header" :style="{ ...styles?.default }">
      <div class="title left">
        {{ t('components.file.diff.form.original') }}
      </div>
      <div class="title right">
        {{ t('components.file.diff.form.modified') }}
      </div>
    </div>
    <div ref="editorRef" class="editor"></div>
  </div>
</template>

<style scoped>
.file-diff {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    flex: 0 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;

    .title {
      padding: 0 64px;
    }
  }

  .editor {
    flex: 1;
  }
}
</style>
