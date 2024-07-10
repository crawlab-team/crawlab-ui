import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalEditor,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { onUnmounted } from 'vue';
import {
  $createVariableNode,
  $isVariableNode,
} from '@/components/lexical/nodes/VariableNode';

export const INSERT_VARIABLE_COMMAND =
  createCommand<InsertVariableCommandPayload>('INSERT_VARIABLE');

let unregisterListener: () => void;

const resetVariables = () => {
  document.querySelectorAll('.editor-container .variable').forEach(element => {
    element.classList.remove('active');
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
    }),
    editor.registerCommand<InsertVariableCommandPayload>(
      INSERT_VARIABLE_COMMAND,
      ({ name }) => {
        const selection = $getSelection();
        const rootNode = $getRoot();
        const variable = $createVariableNode(name);
        const paragraph = $createParagraphNode();
        paragraph.append(variable);
        if (selection) {
          selection.insertNodes([paragraph]);
        } else if (rootNode) {
          rootNode.append(paragraph);
        } else {
          throw new Error('No selection or root node found');
        }
      },
      COMMAND_PRIORITY_EDITOR
    )
  );
};

onUnmounted(() => {
  unregisterListener?.();
});
