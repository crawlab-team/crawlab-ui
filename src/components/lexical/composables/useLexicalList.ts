import type { LexicalEditor } from 'lexical';
import { COMMAND_PRIORITY_LOW, INSERT_PARAGRAPH_COMMAND } from 'lexical';
import {
  $handleListInsertParagraph,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  insertList,
  REMOVE_LIST_COMMAND,
  removeList,
} from '@lexical/list';
import { mergeRegister } from '@lexical/utils';
import useMounted from './useLexicalMounted';

export default (editor: LexicalEditor) => {
  useMounted(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'number');
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'bullet');
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          removeList(editor);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          return $handleListInsertParagraph();
        },
        COMMAND_PRIORITY_LOW
      )
    );
  });
};
