<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { debounce } from 'lodash';
import {
  $getNodeByKey,
  $getSelection,
  $createParagraphNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type LexicalEditor,
  type RangeSelection,
  type NodeSelection,
  $isNodeSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  ParagraphNode,
  $isParagraphNode,
  createCommand,
} from 'lexical';
import { $wrapNodes } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import { $isLinkNode } from '@lexical/link';
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
} from '@lexical/code';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isTableCellNode,
  $isTableSelection,
  INSERT_TABLE_COMMAND,
  type TableSelection,
} from '@lexical/table';
import BlockOptionsDropdownList from '../components/BlockOptionsDropdownList.vue';
import InsertOptionsDropdownList from '../components/InsertOptionsDropdownList.vue';
import FloatLinkEditor from '../components/FloatLinkEditor.vue';
import InsertVariableDialog from '../components/InsertVariableDialog.vue';
import InsertTableDialog from '../components/InsertTableDialog.vue';
import InsertImageDialog from '../components/InsertImageDialog.vue';
import {
  getActiveVariableNodeKey,
  INSERT_VARIABLE_COMMAND,
} from '@/components/ui/lexical/composables/useVariableSetup';
import { translate } from '@/utils';
import {
  $isVariableNode,
  VariableNode,
} from '@/components/ui/lexical/nodes/VariableNode';
import ClDropdownButton from '@/components/ui/lexical/components/DropdownButton.vue';

const props = defineProps<{
  editor: LexicalEditor;
}>();

const t = translate;

const supportedBlockTypes = new Set(['paragraph', 'h1', 'h2', 'h3']);

const blockTypeToBlockName = {
  code: t('components.editor.toolbar.block.code'),
  h1: t('components.editor.toolbar.block.h1'),
  h2: t('components.editor.toolbar.block.h2'),
  h3: t('components.editor.toolbar.block.h3'),
  h4: t('components.editor.toolbar.block.h4'),
  h5: t('components.editor.toolbar.block.h5'),
  paragraph: t('components.editor.toolbar.block.paragraph'),
  quote: t('components.editor.toolbar.block.quote'),
};

const toolbarRef = ref<HTMLDivElement | null>(null);
const blockButtonRef = ref<HTMLButtonElement | null>(null);
const insertButtonRef = ref<HTMLButtonElement | null>(null);

const canUndo = ref(false);
const canRedo = ref(false);
const blockType = ref<keyof typeof blockTypeToBlockName>('paragraph');
const selectedElementKey = ref();
const codeLanguage = ref('');

const toolbarStates = ref<ToolbarStates>({
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  left: false,
  center: false,
  right: false,
  justify: false,
  h1: false,
  h2: false,
  h3: false,
  ol: false,
  ul: false,
  link: false,
  quote: false,
  code: false,
  table: false,
  variable: false,
});
const resetToolbarStates = () => {
  for (const key in toolbarStates.value) {
    toolbarStates.value[key] = false;
  }
};

const showBlockOptionsDropdown = ref(false);
const showInsertOptionsDropdown = ref(false);
const showInsertVariableDialog = ref(false);
const showInsertTableDialog = ref(false);
const showInsertImageDialog = ref(false);

const updateToolbarMain = () => {
  const { editor } = props;
  editor.getEditorState().read(() => {
    const selection = $getSelection() as
      | RangeSelection
      | TableSelection
      | NodeSelection;

    if (!selection || $isNodeSelection(selection)) {
      return;
    }

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
        if ($isCodeNode(element)) {
          codeLanguage.value =
            element.getLanguage() || getDefaultCodeLanguage();
        } else if (
          $isTableSelection(selection) ||
          $isTableCellNode(element.getParent())
        ) {
          toolbarStates.value.table = true;
        }
      }
      if ((blockType.value as any) === 'root') {
        blockType.value = 'paragraph';
      }
    }

    if ($isTableSelection(selection)) {
      return;
    }

    // Update text format
    toolbarStates.value.bold = selection.hasFormat('bold');
    toolbarStates.value.italic = selection.hasFormat('italic');
    toolbarStates.value.underline = selection.hasFormat('underline');
    toolbarStates.value.strikethrough = selection.hasFormat('strikethrough');
    toolbarStates.value.left = elementDOM?.style.textAlign === 'left';
    toolbarStates.value.center = elementDOM?.style.textAlign === 'center';
    toolbarStates.value.right = elementDOM?.style.textAlign === 'right';
    toolbarStates.value.justify = elementDOM?.style.textAlign === 'justify';
    toolbarStates.value.link = $isLinkNode(focusNode.getParent());
    toolbarStates.value.ul = blockType.value === 'ul';
    toolbarStates.value.ol = blockType.value === 'ol';
    toolbarStates.value.code = blockType.value === 'code';
    toolbarStates.value.quote = blockType.value === 'quote';
  });
};

const updateToolbarVariable = () => {
  const { editor } = props;

  const activeVariableNodeKey = getActiveVariableNodeKey();

  editor.getEditorState().read(() => {
    const node = $getNodeByKey<VariableNode>(activeVariableNodeKey);
    let paragraphNode = node.getParent<ParagraphNode>();
    if (!$isParagraphNode(paragraphNode)) {
      paragraphNode = null;
    }
    const elementKey = paragraphNode?.getKey();
    const elementDOM = elementKey ? editor.getElementByKey(elementKey) : null;

    // Update text format
    toolbarStates.value.bold = node.__bold;
    toolbarStates.value.italic = node.__italic;
    toolbarStates.value.underline = node.__underline;
    toolbarStates.value.strikethrough = node.__strikethrough;
    toolbarStates.value.left = elementDOM?.style.textAlign === 'left';
    toolbarStates.value.center = elementDOM?.style.textAlign === 'center';
    toolbarStates.value.right = elementDOM?.style.textAlign === 'right';
    toolbarStates.value.justify = elementDOM?.style.textAlign === 'justify';
    toolbarStates.value.ul = blockType.value === 'ul';
    toolbarStates.value.ol = blockType.value === 'ol';
    toolbarStates.value.variable = true;
  });
};

const updateToolbar = debounce(() => {
  resetToolbarStates();

  if (getActiveVariableNodeKey()) {
    updateToolbarVariable();
    return;
  }

  updateToolbarMain();
});

let unregisterMergeListener: () => void;
onMounted(() => {
  const { editor } = props;
  unregisterMergeListener = mergeRegister(
    // update toolbar
    editor.registerUpdateListener(updateToolbar),

    // default format update
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW
    ),

    // undo/redo update
    editor.registerCommand(
      CAN_UNDO_COMMAND,
      payload => {
        canUndo.value = payload;
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      CAN_REDO_COMMAND,
      payload => {
        canRedo.value = payload;
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    ),

    // format block
    editor.registerCommand(
      FORMAT_BLOCK_COMMAND,
      (blockType: BlockType) => {
        if (supportedBlockTypes.has(blockType)) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            switch (blockType) {
              case 'paragraph':
                $wrapNodes(selection, () => $createParagraphNode());
                break;
              case 'h1':
              case 'h2':
              case 'h3':
                $wrapNodes(selection, () => $createHeadingNode(blockType));
                break;
            }
          });
        }
      },
      COMMAND_PRIORITY_EDITOR
    )
  );
});

const FORMAT_BLOCK_COMMAND = createCommand<BlockType>('FORMAT_BLOCK_COMMAND');

const insertLink = () => {
  const { editor } = props;
  if (!toolbarStates.value.link) {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
  } else {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }
};

const variableForm = ref<VariableForm>({
  category: 'task',
  name: '',
});
const insertVariable = () => {
  const { editor } = props;
  editor.dispatchCommand(INSERT_VARIABLE_COMMAND, {
    category: variableForm.value.category,
    name: variableForm.value.name,
  } as InsertVariableCommandPayload);
};

const tableForm = ref<TableForm>({
  rows: 5,
  columns: 5,
  includeHeaders: true,
});
const insertTable = () => {
  const { editor } = props;
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    rows: tableForm.value.rows.toString(),
    columns: tableForm.value.columns.toString(),
    includeHeaders: tableForm.value.includeHeaders,
  });
  editor.update(() => {
    const selection = $getSelection();
    selection?.insertNodes([$createParagraphNode()]);
  });
};

const imageForm = ref<ImageForm>({
  src: '',
});
const insertImage = () => {
  // const { editor } = props;
  // editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
  //   src: imageForm.value.src,
  // });
};

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

const blockTypeOptions = computed<SelectOption[]>(() => [
  { value: 'paragraph', label: t('components.editor.toolbar.block.paragraph') },
  { value: 'h1', label: t('components.editor.toolbar.block.h1') },
  { value: 'h2', label: t('components.editor.toolbar.block.h2') },
  { value: 'h3', label: t('components.editor.toolbar.block.h3') },
]);
const onFormatBlock = (value: BlockType) => {
  const { editor } = props;
  editor.dispatchCommand(FORMAT_BLOCK_COMMAND, value);
};

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
    <div class="divider" />
    <cl-dropdown-button
      :model-value="blockType"
      :options="blockTypeOptions"
      @select="onFormatBlock"
    />
    <div class="divider" />
    <button
      :class="`toolbar-item spaced ${toolbarStates.bold ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')"
    >
      <i class="format bold" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.italic ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')"
    >
      <i class="format italic" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.underline ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')"
    >
      <i class="format underline" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.strikethrough ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')"
    >
      <i class="format strikethrough" />
    </button>
    <div class="divider" />
    <button
      :class="`toolbar-item spaced ${toolbarStates.left ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')"
    >
      <i class="format left-align" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.center ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')"
    >
      <i class="format center-align" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.right ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')"
    >
      <i class="format right-align" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.justify ? 'active' : ''}`"
      @click="editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')"
    >
      <i class="format justify-align" />
    </button>
    <div class="divider" />
    <button
      :class="`toolbar-item spaced ${toolbarStates.ul ? 'active' : ''}`"
      @click="
        () => {
          if (!toolbarStates.ul) {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }
      "
    >
      <i class="format ul" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.ol ? 'active' : ''}`"
      @click="
        () => {
          if (!toolbarStates.ol) {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }
      "
    >
      <i class="format ol" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.link ? 'active' : ''}`"
      @click="insertLink"
    >
      <i class="format link" />
    </button>
    <Teleport to="body">
      <FloatLinkEditor
        v-if="toolbarStates.link"
        :editor="editor"
        :priority="COMMAND_PRIORITY_LOW"
      />
    </Teleport>
    <button
      :class="`toolbar-item spaced ${toolbarStates.code ? 'active' : ''}`"
      @click="
        () => {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $wrapNodes(selection, () => $createCodeNode());
            }
          });
        }
      "
    >
      <i class="format code" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.quote ? 'active' : ''}`"
      @click="
        () => {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              $wrapNodes(selection, () => $createQuoteNode());
            }
          });
        }
      "
    >
      <i class="format quote" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.table ? 'active' : ''}`"
      @click="insertTable"
    >
      <i class="format table" />
    </button>
    <button
      :class="`toolbar-item spaced ${toolbarStates.variable ? 'active' : ''}`"
      @click="showInsertVariableDialog = true"
    >
      <span class="format">
        <cl-icon :icon="['fa', 'dollar']" />
      </span>
    </button>
    <div class="divider" />
    <button
      v-if="false"
      ref="insertButtonRef"
      class="toolbar-item insert-controls"
      @click="showInsertOptionsDropdown = !showInsertOptionsDropdown"
    >
      <span class="icon plus" />
      <span class="text">{{ t('components.editor.actions.insert') }}</span>
      <i class="chevron-down" />
    </button>
    <Teleport to="body">
      <InsertOptionsDropdownList
        v-if="showInsertOptionsDropdown"
        :visible="showInsertOptionsDropdown"
        :editor="editor"
        :toolbar-ref="toolbarRef"
        :button-ref="insertButtonRef"
        @hide="showInsertOptionsDropdown = false"
        @insert-variable="showInsertVariableDialog = true"
        @insert-table="showInsertTableDialog = true"
        @insert-image="showInsertImageDialog = true"
      />
      <InsertVariableDialog
        :visible="showInsertVariableDialog"
        v-model="variableForm"
        @close="showInsertVariableDialog = false"
        @confirm="
          () => {
            insertVariable();
            showInsertVariableDialog = false;
            variableForm.name = '';
          }
        "
      />
      <InsertTableDialog
        :visible="showInsertTableDialog"
        v-model="tableForm"
        @close="
          () => {
            showInsertTableDialog = false;
            tableForm.rows = 5;
            tableForm.columns = 5;
            tableForm.includeHeaders = true;
          }
        "
        @confirm="
          () => {
            insertTable();
            showInsertTableDialog = false;
            tableForm.rows = 5;
            tableForm.columns = 5;
            tableForm.includeHeaders = true;
          }
        "
      />
      <InsertImageDialog
        :visible="showInsertImageDialog"
        v-model="imageForm"
        @close="
          () => {
            showInsertImageDialog = false;
            imageForm.src = '';
          }
        "
        @confirm="
          () => {
            insertImage();
            showInsertImageDialog = false;
            imageForm.src = '';
          }
        "
      />
    </Teleport>
  </div>
</template>
