import {
  $applyNodeReplacement,
  $getSelection,
  $isRangeSelection,
  DecoratorNode,
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { JSX } from 'vue/jsx-runtime';

export type SerializedVariableNode = Spread<
  {
    name: string;
  },
  SerializedLexicalNode
>;

export class VariableNode extends DecoratorNode<JSX.Element> {
  __name: string;

  constructor(name: string, key?: string) {
    super(key);
    this.__name = name;
  }

  static getType(): string {
    return 'variable';
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__name, node.__key);
  }

  static importJSON(serializedNode: SerializedVariableNode): VariableNode {
    const { name } = serializedNode;
    return $createVariableNode(name);
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('span');
    element.classList.add('variable');
    element.innerText = this.__name;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: element => {
        if (element.classList.contains('variable')) {
          return $createVariableNode(this.__name);
        }
        return null;
      },
    };
  }

  exportJSON(): SerializedVariableNode {
    return {
      name: this.__name,
      type: VariableNode.getType(),
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const currentElement = document.createElement('span');
    currentElement.classList.add('variable');
    return currentElement;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    const backgroundColor = this.isSelected($getSelection())
      ? 'lightblue'
      : 'transparent';
    return <span style={{ backgroundColor }}>${this.__name}</span>;
  }

  getName(): string {
    return this.__name;
  }
}

export function $createVariableNode(name: string): VariableNode {
  return $applyNodeReplacement(new VariableNode(name));
}

export function $isVariableNode(
  node: LexicalNode | null | undefined
): node is VariableNode {
  return node instanceof VariableNode;
}
