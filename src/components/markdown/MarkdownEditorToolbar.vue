<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    editor?: monaco.editor.IStandaloneCodeEditor;
    content?: string;
  }>(),
  {
    showHistory: true,
  }
);

const emit = defineEmits<{
  (e: 'undo'): void;
  (e: 'redo'): void;
  (e: 'bold'): void;
  (e: 'italic'): void;
  (e: 'underline'): void;
  (e: 'strikethrough'): void;
  (e: 'link'): void;
}>();

const canUndo = ref(false);
const canRedo = ref(false);
const updateUndoRedo = () => {
  const { editor } = props;
  if (!editor) return false;
  const model = editor.getModel();
  canUndo.value = model.canUndo(model.uri);
  canRedo.value = model.canRedo(model.uri);
};
watch(() => props.content, updateUndoRedo);

defineOptions({ name: 'ClMarkdownEditorToolbar' });
</script>

<template>
  <div ref="toolbarRef" class="toolbar">
    <button
      :disabled="!canUndo"
      class="toolbar-item spaced"
      aria-label="Undo"
      @click="emit('undo')"
    >
      <i class="format undo" />
    </button>
    <button
      :disabled="!canRedo"
      class="toolbar-item spaced"
      aria-label="Redo"
      @click="emit('redo')"
    >
      <i class="format redo" />
    </button>
    <div class="divider" />
    <button
      class="toolbar-item spaced"
      aria-label="Format Bold"
      @click="emit('bold')"
    >
      <i class="format bold" />
    </button>
    <button
      class="toolbar-item spaced"
      aria-label="Format Italics"
      @click="emit('italic')"
    >
      <i class="format italic" />
    </button>
    <button
      class="toolbar-item spaced"
      aria-label="Format Strikethrough"
      @click="emit('strikethrough')"
    >
      <i class="format strikethrough" />
    </button>
    <button
      class="toolbar-item spaced"
      aria-label="Insert Link"
      @click="emit('link')"
    >
      <i class="format link" />
    </button>
    <div class="divider" />
  </div>
</template>

<style scoped lang="scss"></style>
