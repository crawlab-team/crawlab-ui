import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
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
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const currentElement = document.createElement('span');
    currentElement.classList.add('variable');
    currentElement.addEventListener('click', () => {
      currentElement.classList.toggle('active');
      document
        .querySelectorAll('.editor-container .variable')
        .forEach(element => {
          if (currentElement === element) return;
          element.classList.remove('active');
        });
    });
    return currentElement;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return `\$${this.__name}`;
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

export function $findVariableNode(
  node: ElementNode | null | undefined
): VariableNode | null {
  if (!node?.getChildren) return null;
  return node.getChildren().find($isVariableNode);
}
