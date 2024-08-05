import { type LexicalEditor } from 'lexical';

export declare const INSERT_VARIABLE_COMMAND: import('lexical').LexicalCommand<InsertVariableCommandPayload>;
export declare const UPDATE_VARIABLE_COMMAND: import('lexical').LexicalCommand<UpdateVariableCommandPayload>;
export declare const getActiveVariableNodeKey: () => string | null;
declare const _default: (editor: LexicalEditor) => void;
export default _default;
