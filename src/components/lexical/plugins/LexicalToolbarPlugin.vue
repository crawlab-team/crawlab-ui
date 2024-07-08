<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
  type LexicalEditor,
  $getNodeByKey,
  $getSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { $isParentElementRTL } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $isListNode, ListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isLinkNode } from '@lexical/link';
import { $isCodeNode, getDefaultCodeLanguage } from '@lexical/code';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import BlockOptionsDropdownList from '../components/BlockOptionsDropdownList.vue';
import FloatLinkEditor from '../components/FloatLinkEditor.vue';

const props = defineProps<{
  editor: LexicalEditor;
}>();

const LowPriority = 1;

const supportedBlockTypes = new Set([
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'ul',
  'ol',
]);

const blockTypeToBlockName = {
  code: 'Code Block',
  h1: 'Large Heading',
  h2: 'Small Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  ol: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
  ul: 'Bulleted List',
};

const toolbarRef = ref<HTMLDivElement | null>(null);

const canUndo = ref(false);
const canRedo = ref(false);
const blockType = ref<BlockType>('paragraph');
const selectedElementKey = ref();
const codeLanguage = ref('');
const isRTL = ref(false);
const isLink = ref(false);
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);
const isStrikethrough = ref(false);
const isCode = ref(false);
const showBlockOptionsDropDown = ref(false);

function updateToolbar() {
  const { editor } = props;
  const selection = $getSelection();
  if (!selection) return;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  const element =
    anchorNode.getKey() === 'root'
      ? anchorNode
      : anchorNode.getTopLevelElementOrThrow();
  const elementKey = element.getKey();
  const elementDOM = editor.getElementByKey(elementKey);
  if (elementDOM) {
    selectedElementKey.value = elementKey;
    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType(anchorNode, ListNode);
      blockType.value = parentList ? parentList.getTag() : element.getTag();
    } else {
      blockType.value = $isHeadingNode(element)
        ? element.getTag()
        : (element.getType() as any);
      if ($isCodeNode(element))
        codeLanguage.value = element.getLanguage() || getDefaultCodeLanguage();
    }
  }
  // Update text format
  isBold.value = selection.hasFormat('bold');
  isItalic.value = selection.hasFormat('italic');
  isUnderline.value = selection.hasFormat('underline');
  isStrikethrough.value = selection.hasFormat('strikethrough');
  isCode.value = selection.hasFormat('code');
  isRTL.value = $isParentElementRTL(selection);
  isLink.value = $isLinkNode(focusNode.getParent());
}

let unregisterMergeListener: () => void;

onMounted(() => {
  const { editor } = props;
  unregisterMergeListener = mergeRegister(
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    }),
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      LowPriority
    ),
    editor.registerCommand(
      CAN_UNDO_COMMAND,
      payload => {
        canUndo.value = payload;
        return false;
      },
      LowPriority
    ),
    editor.registerCommand(
      CAN_REDO_COMMAND,
      payload => {
        canRedo.value = payload;
        return false;
      },
      LowPriority
    )
  );
});

function insertLink() {
  const { editor } = props;
  if (!isLink.value) editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
  else editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
}

watch(codeLanguage, value => {
  const { editor } = props;
  editor.update(() => {
    if (selectedElementKey.value) {
      const node = $getNodeByKey(selectedElementKey.value);
      if ($isCodeNode(node)) node.setLanguage(value);
    }
  });
});

onUnmounted(() => {
  unregisterMergeListener?.();
});

defineOptions({ name: 'ClLexicalToolbarPlugin' });
</script>

<template>
  <div ref="toolbarRef" class="toolbar">
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
    <template v-if="supportedBlockTypes.has(blockType)">
      <button
        class="toolbar-item block-controls"
        aria-label="Formatting Options"
        @click="showBlockOptionsDropDown = !showBlockOptionsDropDown"
      >
        <span :class="`icon block-type ${blockType}`" />
        <span class="text">{{ blockTypeToBlockName[blockType] }}</span>
        <i class="chevron-down" />
      </button>
      <Teleport to="body">
        <BlockOptionsDropdownList
          v-if="showBlockOptionsDropDown"
          :visible="showBlockOptionsDropDown"
          :editor="editor"
          :block-type="blockType"
          :toolbar-ref="toolbarRef"
          @hide="showBlockOptionsDropDown = false"
        />
      </Teleport>
    </template>
    <button
      :class="`toolbar-item spaced ${isBold ? 'active' : ''}`"
      aria-label="Format Bold"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')"
    >
      <i class="format bold" />
    </button>
    <button
      :class="`toolbar-item spaced ${isItalic ? 'active' : ''}`"
      aria-label="Format Italics"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')"
    >
      <i class="format italic" />
    </button>
    <button
      :class="`toolbar-item spaced ${isUnderline ? 'active' : ''}`"
      aria-label="Format Underline"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')"
    >
      <i class="format underline" />
    </button>
    <button
      :class="`toolbar-item spaced ${isStrikethrough ? 'active' : ''}`"
      aria-label="Format Strikethrough"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')"
    >
      <i class="format strikethrough" />
    </button>
    <button
      v-if="false"
      :class="`toolbar-item spaced ${isCode ? 'active' : ''}`"
      aria-label="Insert Code"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')"
    >
      <i class="format code" />
    </button>
    <button
      :class="`toolbar-item spaced ${isLink ? 'active' : ''}`"
      aria-label="Insert Link"
      @click="insertLink"
    >
      <i class="format link" />
    </button>
    <Teleport to="body">
      <FloatLinkEditor v-if="isLink" :editor="editor" :priority="LowPriority" />
    </Teleport>
    <button
      class="toolbar-item spaced"
      aria-label="Left Align"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')"
    >
      <i class="format left-align" />
    </button>
    <button
      class="toolbar-item spaced"
      aria-label="Center Align"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')"
    >
      <i class="format center-align" />
    </button>
    <button
      class="toolbar-item spaced"
      aria-label="Right Align"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')"
    >
      <i class="format right-align" />
    </button>
    <button
      class="toolbar-item"
      aria-label="Justify Align"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')"
    >
      <i class="format justify-align" />
    </button>
  </div>
</template>
