import { JSX } from 'vue/jsx-runtime';
import {
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
  TextFormatType,
} from 'lexical';

export type SerializedVariableNode = Spread<
  {
    key?: string;
    category?: NotificationVariableCategory;
    name: string;
    __bold?: boolean;
    __italic?: boolean;
    __underline?: boolean;
    __strikethrough?: boolean;
    __selected?: boolean;
  },
  SerializedLexicalNode
>;

export declare class VariableNode extends DecoratorNode<JSX.Element> {
  readonly version = 1;
  readonly category?: NotificationVariableCategory;
  readonly name: string;
  __bold: boolean;
  __italic: boolean;
  __underline: boolean;
  __strikethrough: boolean;
  __selected: boolean;

  constructor({
    key,
    category,
    name,
    __bold,
    __italic,
    __underline,
    __strikethrough,
  }: SerializedVariableNode);

  static getType(): string;

  static clone(node: VariableNode): VariableNode;

  exportDOM(_: LexicalEditor): DOMExportOutput;

  static importJSON(serializedNode: SerializedVariableNode): VariableNode;

  exportJSON(): SerializedVariableNode;

  onClick(editor: LexicalEditor): void;

  createDOM(_: EditorConfig): HTMLElement;

  updateDOM(): false;

  decorate(editor: any): JSX.Element;

  toggleFormat(formatType: TextFormatType): void;

  getCategory(): string;

  getName(): string;

  getTextContent(): string;

  toggle(key: any, value?: boolean): void;

  toggleBold(): void;

  toggleItalic(): void;

  toggleUnderline(): void;

  toggleStrikethrough(): void;

  setSelected(value: boolean): void;
}

export declare function $createVariableNode(
  params: SerializedVariableNode
): VariableNode;

export declare function $isVariableNode(
  node: LexicalNode | null | undefined
): node is VariableNode;
