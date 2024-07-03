<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import * as monaco from 'monaco-editor';
import { translate } from '@/utils';
import useNotification from '@/components/notification/notification';

const t = translate;

// store
const ns = 'notification';
const store = useStore();

const { form } = useNotification(store);

const internalTitle = ref();

const editorRef = ref();

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const updateEditorContent = () => {
  editor?.setValue(form.value.template || '');
  store.commit(`${ns}/setTemplate`, form.value.template);
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
  editor.setValue(form.value.template || '');
};

onMounted(() => {
  const { title } = form.value;
  internalTitle.value = title;
  initEditor();
});

onBeforeUnmount(() => {
  editor?.dispose();
});

watch(() => form.value.template, updateEditorContent);

watch(
  () => form.value.title,
  title => {
    internalTitle.value = title;
  }
);

const onTitleChange = (title: string) => {
  store.commit(`${ns}/setTemplateTitle`, title);
};
defineOptions({ name: 'ClNotificationDetailTabTemplate' });
</script>

<template>
  <div class="notification-detail-tab-template">
    <el-input
      v-model="internalTitle"
      class="title"
      :placeholder="t('views.notification.settings.form.title')"
      @input="onTitleChange"
    />
    <div ref="editorRef" class="editor" />
  </div>
</template>

<style scoped lang="scss">
.notification-detail-tab-template {
  display: flex;
  flex-direction: column;
  height: 100%;

  .editor {
    flex: 1;
  }
}
</style>
<style scoped>
.notification-detail-tab-template .title:deep(.el-input__wrapper) {
  border: none;
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: none;
}

.notification-detail-tab-template:deep(.editor-toolbar) {
  border-radius: 0;
  border-left: none;
  border-right: none;
}
</style>
