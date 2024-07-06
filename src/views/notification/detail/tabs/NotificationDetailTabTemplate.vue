<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import {
  createEditor,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  CreateEditorArgs,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
  registerRichText,
} from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { translate } from '@/utils';
import useNotification from '@/components/notification/notification';
import ToolbarPlugin from '@/components/lexical/plugins/ToolbarPlugin.vue';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

const t = translate;

// store
const ns = 'notification';
const store = useStore();

const { form } = useNotification(store);

const internalTitle = ref();
onMounted(() => {
  const { title } = form.value;
  internalTitle.value = title;
});
watch(
  () => form.value.title,
  title => {
    internalTitle.value = title;
  }
);
const onTitleChange = (title: string) => {
  store.commit(`${ns}/setTemplateTitle`, title);
};

const prepopulatedRichText = () => {
  const root = $getRoot();
  if (root.getFirstChild()) {
    return;
  }

  const heading = $createHeadingNode('h1');
  heading.append($createTextNode('Welcome to the Vanilla JS Lexical Demo!'));
  root.append(heading);
  const quote = $createQuoteNode();
  quote.append(
    $createTextNode(
      `In case you were wondering what the text area at the bottom is – it's the debug view, showing the current state of the editor. `
    )
  );
  root.append(quote);
  const paragraph = $createParagraphNode();
  paragraph.append(
    $createTextNode('This is a demo environment built with '),
    $createTextNode('lexical').toggleFormat('code'),
    $createTextNode('.'),
    $createTextNode(' Try typing in '),
    $createTextNode('some text').toggleFormat('bold'),
    $createTextNode(' with '),
    $createTextNode('different').toggleFormat('italic'),
    $createTextNode(' formats.')
  );
  root.append(paragraph);
};

const editorThemePrefix = 'LexicalEditorTheme';
const initialEditorConfig: CreateEditorArgs = {
  namespace: 'NotificationEditor',
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
  editable: true,
  theme: {
    ltr: `${editorThemePrefix}__ltr`,
    rtl: `${editorThemePrefix}__rtl`,
    paragraph: `${editorThemePrefix}__paragraph`,
  },
  onError(error) {
    // Catch any errors that occur during Lexical updates and log them
    // or throw them as needed. If you don't throw them, Lexical will
    // try to recover gracefully without losing user data.
    console.error(error);
  },
};
const editorRef = ref<HTMLElement | null>(null);
const editor = createEditor(initialEditorConfig);
mergeRegister(
  registerRichText(editor),
  registerHistory(editor, createEmptyHistoryState(), 300)
);

onMounted(() => {
  editor.setRootElement(editorRef.value);

  editor.update(prepopulatedRichText, { tag: 'history-merge' });
});

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
    <ToolbarPlugin :editor="editor" />
    <div ref="editorRef" class="editor" contenteditable />
  </div>
</template>

<style scoped lang="scss">
.notification-detail-tab-template {
  display: flex;
  flex-direction: column;
  height: 100%;

  .editor {
    flex: 1;
    padding: 20px;
  }
}
</style>
<style scoped>
.notification-detail-tab-template .title:deep(.el-input__wrapper) {
  border: none;
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: none;
}
</style>
