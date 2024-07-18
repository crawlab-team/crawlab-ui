import {
  $createNodeSelection,
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  type TextFormatType,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { onMounted, onUnmounted, ref } from 'vue';
import {
  $createVariableNode,
  $isVariableNode,
  VariableNode,
} from '@/components/ui/lexical/nodes/VariableNode';
import {
  getAllNodes,
  getAllTextNodes,
} from '@/components/ui/lexical/utils/node';
import { publish, subscribe } from '@/utils/eventBus';
import useLexicalMounted from '@/components/ui/lexical/composables/useLexicalMounted';
import { $isTableSelection } from '@lexical/table';

export const INSERT_VARIABLE_COMMAND =
  createCommand<InsertVariableCommandPayload>('INSERT_VARIABLE');

export const UPDATE_VARIABLE_COMMAND =
  createCommand<UpdateVariableCommandPayload>('UPDATE_VARIABLE');

let unregisterListener: () => void;

const variableRegex = /(.*)\$\{(\w+):(\w+)\}(.*)/;

const highlightVariables = (editor: LexicalEditor) => {
  editor.update(() => {
    getAllTextNodes().forEach(node => {
      const text = node.getTextContent();
      if (variableRegex.test(text)) {
        // find matches
        const matches = text.match(variableRegex);
        if (!matches) return;

        // extract parts
        const preText = matches[1];
        const category = matches[2];
        const name = matches[3];
        const postText = matches[4];

        // convert text into array of nodes
        const nodes = [];
        if (preText) {
          nodes.push($createTextNode(preText));
        }
        nodes.push($createVariableNode({ category, name }));
        if (postText) {
          nodes.push($createTextNode(postText));
        }

        // replace the text node with the array of nodes
        for (const newNode of nodes) {
          node.insertBefore(newNode);
        }
        node.remove();
      }
    });
  });
};

let activeVariableNodeKey: string | null = null;
export const getActiveVariableNodeKey = () => {
  return activeVariableNodeKey;
};

export default (editor: LexicalEditor) => {
  unregisterListener = mergeRegister(
    // highlight variables on editor update
    editor.registerUpdateListener(() => {
      highlightVariables(editor);
    }),

    // on selection change
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) && !$isTableSelection(selection)) {
          return;
        }
        getAllNodes<VariableNode>($isVariableNode).forEach(node => {
          node.setSelected(false);
        });
        activeVariableNodeKey = null;
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    ),

    // insert variable command
    editor.registerCommand(
      INSERT_VARIABLE_COMMAND,
      ({ category, name }) => {
        const selection = $getSelection();
        const rootNode = $getRoot();
        const variable = $createVariableNode({
          category,
          name,
        });
        const paragraph = $createParagraphNode();
        paragraph.append(variable);
        if (selection) {
          selection.insertNodes([paragraph]);
        } else if (rootNode) {
          rootNode.append(paragraph);
        } else {
          throw new Error('No selection or root node found');
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),

    // update variable command
    editor.registerCommand(
      UPDATE_VARIABLE_COMMAND,
      ({ nodeKey, action, value }) => {
        const node = $getNodeByKey(nodeKey);
        if (!node || !$isVariableNode(node)) return;
        switch (action) {
          case 'select':
            activeVariableNodeKey = nodeKey;
            getAllNodes<VariableNode>($isVariableNode).forEach(node => {
              node.setSelected(node.getKey() === nodeKey);
            });
            $setSelection(null);
            break;
          case 'format':
            node.toggleFormat(value);
            break;
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),

    // variable node format update
    editor.registerCommand(
      FORMAT_TEXT_COMMAND,
      formatType => {
        if (!activeVariableNodeKey) return true;
        editor.dispatchCommand(UPDATE_VARIABLE_COMMAND, {
          nodeKey: activeVariableNodeKey,
          action: 'format',
          value: formatType,
        } as UpdateVariableCommandPayload);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    )
  );
};

onUnmounted(() => {
  unregisterListener?.();
});
