<script setup lang="ts">
import { onBeforeMount, onMounted, watch } from 'vue';
import {
  $createParagraphNode,
  $getRoot,
  $isParagraphNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  createEditor,
  CreateEditorArgs,
  KEY_DOWN_COMMAND,
} from 'lexical';
import { debounce } from 'lodash';
import type { LexicalEditor } from 'lexical';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { $generateHtmlFromNodes } from '@lexical/html';
import { subscribe } from '@/utils/eventBus';
import { ImageNode } from '@/components/ui/lexical/nodes/ImageNode';
import { VariableNode } from '@/components/ui/lexical/nodes/VariableNode';
import useLexicalMounted from '@/components/ui/lexical/composables/useLexicalMounted';
import { MARKDOWN_TRANSFORMERS } from '@/components/ui/lexical/utils/markdownTransformers';
import '@/components/ui/lexical/theme/default.css';
import { UPDATE_MARKDOWN_EVENT } from '@/utils';
import { theme } from '@/components/ui/lexical/utils/theme';

const modelValue = defineModel<RichTextPayload>({ required: true });

const props = defineProps<{
  markdownContent?: string;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'change-markdown', value: string): void;
}>();

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

let editor: LexicalEditor | null;
editor = createEditor(initialEditorConfig);

const UPDATE_MARKDOWN_COMMAND = createCommand('UPDATE_MARKDOWN_COMMAND');
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    emit('save');
  }
  return false;
};

const updateMarkdown = debounce(() => {
  editor?.dispatchCommand(UPDATE_MARKDOWN_COMMAND, {
    richTextContent: modelValue.value?.richTextContent,
    richTextContentJson: modelValue.value?.richTextContentJson,
  });
});
onBeforeMount(() => {
  subscribe(UPDATE_MARKDOWN_EVENT, updateMarkdown);
});

mergeRegister(
  // register rich text
  registerRichText(editor),

  // register history
  registerHistory(editor, createEmptyHistoryState(), 300),

  // keydown event
  editor?.registerCommand<KeyboardEvent>(
    KEY_DOWN_COMMAND,
    onKeyDown,
    COMMAND_PRIORITY_EDITOR
  ),

  // update rich text
  editor?.registerUpdateListener(
    ({ dirtyElements, dirtyLeaves, prevEditorState }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
      if (prevEditorState.isEmpty()) return;

      editor?.getEditorState().read(() => {
        const richTextContent = $generateHtmlFromNodes(editor);
        const richTextContentJson = JSON.stringify(editor?.toJSON());
        modelValue.value.richTextContent = richTextContent;
        modelValue.value.richTextContentJson = richTextContentJson;
      });

      addEmptyParagraph();

      updateMarkdown();
    }
  ),

  // update markdown
  editor?.registerCommand(
    UPDATE_MARKDOWN_COMMAND,
    () => {
      editor?.update(() => {
        const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
        emit('change-markdown', markdown);
      });
      return false;
    },
    COMMAND_PRIORITY_EDITOR
  )
);

const initEditorState = debounce(() => {
  const { richTextContentJson } = modelValue.value || {};
  const editorStateJSONObject = JSON.parse(
    richTextContentJson || '{}'
  )?.editorState;
  if (editorStateJSONObject?.root?.children?.length > 0) {
    const editorStateString = JSON.stringify(editorStateJSONObject);
    const editorState = editor?.parseEditorState(editorStateString);
    editor?.setEditorState(editorState);
  } else if (props.markdownContent) {
    editor?.update(() => {
      $convertFromMarkdownString(
        props.markdownContent || '',
        MARKDOWN_TRANSFORMERS
      );
    });
  }
});
useLexicalMounted(initEditorState);
watch(modelValue, initEditorState);

const addEmptyParagraph = () => {
  editor?.update(() => {
    const root = $getRoot();
    const lastChild = root.getLastChild();
    if (!$isParagraphNode(lastChild) || lastChild.getTextContent() !== '') {
      root.append($createParagraphNode());
    }
  });
};
onMounted(addEmptyParagraph);

defineOptions({ name: 'ClLexicalEditor' });
</script>

<template>
  <div v-if="editor" class="editor-container">
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
    </div>
  </div>
  <cl-lexical-list-plugin :editor="editor" />
  <cl-lexical-link-plugin :editor="editor" />
  <cl-lexical-auto-link-plugin :editor="editor" />
  <cl-lexical-auto-focus-plugin :editor="editor" />
  <cl-lexical-table-plugin :editor="editor" />
  <!--      <cl-lexical-image-plugin :editor="editor" />-->
  <cl-lexical-variable-plugin :editor="editor" />
</template>

<style scoped>
.editor-container {
  color: #000;
  position: relative;
  font-weight: 400;
  text-align: left;
  height: 100%;

  .editor-inner {
    flex: 0;
    height: calc(100% - 45px);
    background: #fff;
    position: relative;
    display: flex;

    .editor-placeholder {
      flex: 1;
      color: #999;
      overflow: hidden;
      position: absolute;
      text-overflow: ellipsis;
      top: 15px;
      left: 10px;
      font-size: 15px;
      user-select: none;
      display: inline-block;
      pointer-events: none;
    }

    .editor-input {
      flex: 1;
      overflow: auto;
      height: 100%;
      resize: none;
      font-size: 15px;
      position: relative;
      tab-size: 1;
      outline: 0;
      padding: 15px 10px;
      caret-color: #444;

      &::-webkit-scrollbar {
        display: none;
      }

      &:hover::-webkit-scrollbar {
        display: block;
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background-color: #ffffff;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--cl-info-light-color);
        border-radius: 3px;
      }

      &:deep(th) {
        background-color: #f2f3f5;
        text-align: start;
      }

      &:deep(th::after),
      &:deep(td::after) {
        cursor: col-resize;
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 5px;
        z-index: 1;
      }

      &:deep(table.resizing),
      &:deep(table.resizing *),
      &:deep(table.resizing *::after) {
        user-select: none;
      }
    }

    .editor-state {
      flex: 0 0 360px;
      font-size: 11px;
    }
  }
}
</style>
