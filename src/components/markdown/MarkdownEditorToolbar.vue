<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showHistory: boolean;
  }>(),
  {
    showHistory: true,
  }
);

const emit = defineEmits<{
  (e: 'bold'): void;
  (e: 'italic'): void;
  (e: 'underline'): void;
  (e: 'strikethrough'): void;
  (e: 'link'): void;
}>();

defineOptions({ name: 'ClEditorToolbar' });
</script>

<template>
  <div ref="toolbarRef" class="toolbar">
    <template v-if="showHistory">
      <button
        :disabled="!canUndo"
        class="toolbar-item spaced"
        aria-label="Undo"
        @click="editor.dispatchCommand(UNDO_COMMAND, undefined)"
      >
        <i class="format undo" />
      </button>
      <button
        :disabled="!canRedo"
        class="toolbar-item spaced"
        aria-label="Redo"
        @click="editor.dispatchCommand(REDO_COMMAND, undefined)"
      >
        <i class="format redo" />
      </button>
      <div class="divider" />
    </template>
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
      aria-label="Format Underline"
      @click="emit('underline')"
    >
      <i class="format underline" />
    </button>
    <button
      class="toolbar-item spaced"
      aria-label="Format Strikethrough"
      @click="emit('strikethrough')"
    >
      <i class="format strikethrough" />
    </button>
    <button
      class="`toolbar-item spaced"
      aria-label="Insert Link"
      @click="emit('link')"
    >
      <i class="format link" />
    </button>
    <div class="divider" />
  </div>
</template>

<style scoped lang="scss"></style>
