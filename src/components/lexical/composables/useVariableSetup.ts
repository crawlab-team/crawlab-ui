import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { onUnmounted } from 'vue';
import {
  $createVariableNode,
  $isVariableNode,
} from '@/components/lexical/nodes/VariableNode';
import { getAllTextNodes } from '@/components/lexical/utils/node';

export const INSERT_VARIABLE_COMMAND =
  createCommand<InsertVariableCommandPayload>('INSERT_VARIABLE');

let unregisterListener: () => void;

const resetVariables = () => {
  document.querySelectorAll('.editor-container .variable').forEach(element => {
    element.classList.remove('active');
  });
};

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

export default (editor: LexicalEditor) => {
  unregisterListener = mergeRegister(
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        resetVariables();
        const selection = $getSelection();
        if (!selection) return;
        const variableNode = selection.getNodes().find($isVariableNode);
        if (!variableNode) return;
      });
      highlightVariables(editor);
    }),
    editor.registerCommand<InsertVariableCommandPayload>(
      INSERT_VARIABLE_COMMAND,
      ({ category, name }) => {
        const selection = $getSelection();
        const rootNode = $getRoot();
        const variable = $createVariableNode({ category, name });
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
    )
  );
};

onUnmounted(() => {
  unregisterListener?.();
});
