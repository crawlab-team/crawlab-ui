import {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { DecoratorNode } from 'lexical';

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth: number;
    showCaption: boolean;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export declare class ImageNode extends DecoratorNode<JSX.Element> {
  __editor: LexicalEditor;
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;
  __showCaption: boolean;
  __caption: LexicalEditor;
  __captionsEnabled: boolean;

  static getType(): string;

  static clone(node: ImageNode): ImageNode;

  static importJSON(serializedNode: SerializedImageNode): ImageNode;

  exportDOM(): DOMExportOutput;

  static importDOM(): DOMConversionMap | null;

  constructor(
    editor: LexicalEditor,
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    captionsEnabled?: boolean,
    key?: NodeKey
  );

  exportJSON(): SerializedImageNode;

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number
  ): void;

  setShowCaption(showCaption: boolean): void;

  createDOM(config: EditorConfig): HTMLElement;

  updateDOM(): false;

  getSrc(): string;

  getAltText(): string;

  decorate(): JSX.Element;
}

export declare function $createImageNode({
  editor,
  altText,
  height,
  maxWidth,
  captionsEnabled,
  src,
  width,
  showCaption,
  caption,
  key,
}: ImagePayload): ImageNode;

export declare function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode;

export declare const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent>;
export declare const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload>;
