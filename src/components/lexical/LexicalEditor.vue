<script setup lang="ts">
import { createEditor, CreateEditorArgs, EditorThemeClasses } from 'lexical';
import type { EditorState } from 'lexical';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { ImageNode } from '@/components/lexical/nodes/ImageNode';
import ClLexicalTypeheadMenu from '@/components/lexical/plugins/LexicalVariablePlugin.vue';
import ClLexicalVariablePlugin from '@/components/lexical/plugins/LexicalVariablePlugin.vue';
import { VariableNode } from '@/components/lexical/nodes/VariableNode';

const theme: EditorThemeClasses = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

const initialEditorConfig: CreateEditorArgs = {
  namespace: 'NotificationEditor',
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    LinkNode,
    AutoLinkNode,
    VariableNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    ImageNode,
  ],
  editable: true,
  theme,
  onError(error) {
    // Catch any errors that occur during Lexical updates and log them
    // or throw them as needed. If you don't throw them, Lexical will
    // try to recover gracefully without losing user data.
    console.error(error);
  },
};

const editor = createEditor(initialEditorConfig);
mergeRegister(
  registerRichText(editor),
  registerHistory(editor, createEmptyHistoryState(), 300)
);

const onEditorContentChange = (editorState: EditorState) => {
  // console.log(editorState);
};

defineOptions({ name: 'ClLexicalEditor' });
</script>

<template>
  <div class="editor-container">
    <cl-lexical-toolbar-plugin :editor="editor" />
    <div class="editor-inner">
      <cl-lexical-rich-text-plugin :editor="editor">
        <template #contentEditable>
          <cl-lexical-content-editable :editor="editor" class="editor-input" />
        </template>
        <template #placeholder>
          <div class="editor-placeholder">Enter some rich text...</div>
        </template>
      </cl-lexical-rich-text-plugin>
      <cl-lexical-list-plugin :editor="editor" />
      <cl-lexical-link-plugin :editor="editor" />
      <cl-lexical-auto-link-plugin :editor="editor" />
      <cl-lexical-auto-focus-plugin :editor="editor" />
      <cl-lexical-table-plugin :editor="editor" />
      <cl-lexical-image-plugin :editor="editor" />
      <cl-lexical-variable-plugin :editor="editor" />
      <cl-lexical-on-change-plugin
        :editor="editor"
        @change="onEditorContentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-container:deep(table) {
  border-collapse: collapse;
  border-spacing: 0;
  overflow-y: scroll;
  overflow-x: scroll;
  table-layout: fixed;
  width: max-content;
  margin: 0 25px 30px 0;
}

.editor-container:deep(th),
.editor-container:deep(td) {
  position: relative;
  border: 1px solid #bbb;
  width: 75px;
  min-width: 75px;
  vertical-align: top;
  text-align: start;
  padding: 6px 8px;
  outline: none;
  user-select: none;
}

.editor-container:deep(th) {
  background-color: #f2f3f5;
  text-align: start;
}

.editor-container:deep(th::after),
.editor-container:deep(td::after) {
  cursor: col-resize;
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  z-index: 1;
}

.editor-container:deep(table.resizing),
.editor-container:deep(table.resizing *),
.editor-container:deep(table.resizing *::after) {
  user-select: none;
}

.editor-container:deep(.variable) {
  padding: 3px;
  margin: 0 5px;
  color: var(--cl-warning-color);
  text-decoration: underline;
  font-style: italic;
  cursor: pointer;
}

.editor-container:deep(.variable.active) {
  background-color: var(--cl-warning-plain-color);
}
</style>
