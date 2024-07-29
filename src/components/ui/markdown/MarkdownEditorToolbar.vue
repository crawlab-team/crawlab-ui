<script setup lang="ts">
import { ref, watch } from 'vue';
import * as monaco from 'monaco-editor';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { translate } from '@/utils';
import InsertVariableDialog from '@/components/ui/lexical/components/InsertVariableDialog.vue';

const props = defineProps<{
  editor?: monaco.editor.IStandaloneCodeEditor;
  content?: string;
}>();

const emit = defineEmits<{
  (e: 'undo'): void;
  (e: 'redo'): void;
  (e: 'bold'): void;
  (e: 'italic'): void;
  (e: 'underline'): void;
  (e: 'strikethrough'): void;
  (e: 'link'): void;
  (e: 'variable', value: VariableForm): void;
}>();

const t = translate;

const canUndo = ref(false);
const canRedo = ref(false);
const updateUndoRedo = () => {
  const { editor } = props;
  if (!editor) return false;
  const model = editor.getModel();
  // @ts-ignore
  canUndo.value = model.canUndo(model.uri);
  // @ts-ignore
  canRedo.value = model.canRedo(model.uri);
};
watch(() => props.content, updateUndoRedo);

const showInsertVariableDialog = ref(false);
const variableForm = ref<NotificationVariable>();
const insertVariable = () => {
  if (!variableForm.value) return;
  emit('variable', variableForm.value);
};

defineOptions({ name: 'ClMarkdownEditorToolbar' });
</script>

<template>
  <div ref="toolbarRef" class="toolbar">
    <button
      :disabled="!canUndo"
      class="toolbar-item spaced"
      @click="emit('undo')"
    >
      <i class="format undo" />
    </button>
    <button
      :disabled="!canRedo"
      class="toolbar-item spaced"
      @click="emit('redo')"
    >
      <i class="format redo" />
    </button>
    <div class="divider" />
    <button class="toolbar-item spaced" @click="emit('bold')">
      <i class="format bold" />
    </button>
    <button class="toolbar-item spaced" @click="emit('italic')">
      <i class="format italic" />
    </button>
    <button class="toolbar-item spaced" @click="emit('strikethrough')">
      <i class="format strikethrough" />
    </button>
    <button class="toolbar-item spaced" @click="emit('link')">
      <i class="format link" />
    </button>
    <div class="divider" />
    <button
      class="toolbar-item spaced"
      aria-label="Insert Variable"
      @click="showInsertVariableDialog = true"
    >
      <span class="icon">
        <font-awesome-icon :icon="['fa', 'dollar']" style="font-size: 14px" />
      </span>
      <span class="text">
        {{ t('components.editor.toolbar.insert.variable') }}
      </span>
    </button>
    <Teleport to="body">
      <InsertVariableDialog
        :visible="showInsertVariableDialog"
        v-model="variableForm"
        @close="
          () => {
            showInsertVariableDialog = false;
            variableForm = undefined;
          }
        "
        @confirm="
          () => {
            insertVariable();
            showInsertVariableDialog = false;
            variableForm = undefined;
          }
        "
      />
    </Teleport>
  </div>
</template>

<style scoped>
.toolbar {
  button {
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
