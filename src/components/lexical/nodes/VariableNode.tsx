import { DefineComponent, h } from 'vue';
import { JSX } from 'vue/jsx-runtime';
import { ElTooltip } from 'element-plus';
import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { translate } from '@/utils';
import { isValidVariable } from '@/utils/notification';

const t = translate;

export type SerializedVariableNode = Spread<
  {
    category?: NotificationVariableCategory;
    name: string;
  },
  SerializedLexicalNode
>;

export class VariableNode extends DecoratorNode<JSX.Element> {
  __category?: NotificationVariableCategory;
  __name: string;

  constructor({
    category,
    name,
    key,
  }: {
    category?: NotificationVariableCategory;
    name: string;
    key?: string;
  }) {
    super(key);
    this.__category = category;
    this.__name = name;
  }

  static getType(): string {
    return 'variable';
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode({
      category: node.__category,
      name: node.__name,
      key: node.__key,
    });
  }

  static importJSON(serializedNode: SerializedVariableNode): VariableNode {
    const { category, name } = serializedNode;
    return $createVariableNode({ category, name });
  }

  exportDOM(_: LexicalEditor): DOMExportOutput {
    const element = document.createElement('span');
    element.classList.add('variable');
    element.innerText = this.__name;
    return { element };
  }

  exportJSON(): SerializedVariableNode {
    return {
      category: this.__category,
      name: this.__name,
      type: VariableNode.getType(),
      version: 1,
    };
  }

  createDOM(_: EditorConfig): HTMLElement {
    const currentElement = document.createElement('span');
    currentElement.classList.add('variable');
    return currentElement;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    const isValid = isValidVariable({
      category: this.__category,
      name: this.__name,
    });
    const tooltip = isValid ? (
      <span>
        {t(`components.notification.variableCategories.${this.__category}`)}:
        {t(
          `components.notification.variables.${this.__category}.${this.__name}`
        )}
      </span>
    ) : (
      t('components.notification.variables.invalid')
    );
    const color = isValid
      ? 'var(--cl-warning-color)'
      : 'var(--cl-danger-color)';
    const label = this.__category
      ? `$${this.__category}:${this.__name}`
      : `$${this.__name}`;
    return h(ElTooltip, null, {
      default: <span style={{ color }}>{label}</span>,
      content: tooltip,
    });
  }

  getCategory(): string {
    return this.__name;
  }

  getName(): string {
    return this.__name;
  }
}

export function $createVariableNode({
  category,
  name,
}: {
  category?: NotificationVariableCategory;
  name: string;
}): VariableNode {
  return $applyNodeReplacement(new VariableNode({ category, name }));
}

export function $isVariableNode(
  node: LexicalNode | null | undefined
): node is VariableNode {
  return node instanceof VariableNode;
}
