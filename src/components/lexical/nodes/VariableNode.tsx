import { h } from 'vue';
import { JSX } from 'vue/jsx-runtime';
import { ElTooltip } from 'element-plus';
import {
  $applyNodeReplacement,
  $getNodeByKey,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
  TextFormatType,
} from 'lexical';
import { translate } from '@/utils';
import { isValidVariable } from '@/utils/notification';

const t = translate;

export type SerializedVariableNode = Spread<
  {
    category?: NotificationVariableCategory;
    name: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    selected?: boolean;
  },
  SerializedLexicalNode
>;

export class VariableNode extends DecoratorNode<JSX.Element> {
  readonly __category?: NotificationVariableCategory;
  readonly __name: string;
  __bold: boolean;
  __italic: boolean;
  __underline: boolean;
  __strikethrough: boolean;
  __selected: boolean;

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
    this.__bold = false;
    this.__italic = false;
    this.__underline = false;
    this.__strikethrough = false;
    this.__selected = false;
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
    const category = this.getCategory();
    const name = this.getName();
    const element = document.createElement('span');
    element.classList.add('variable');
    element.innerText = category ? `$\{${category}:${name}\}` : `$\{${name}\}`;
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

  decorate(editor): JSX.Element {
    console.debug(Object.isFrozen(this));
    const category = this.getCategory();
    const name = this.getName();
    const isValid = isValidVariable({
      category,
      name,
    });
    const tooltip = isValid ? (
      <span>
        {t(`components.notification.variableCategories.${category}`)}:
        {t(`components.notification.variables.${category}.${name}`)}
      </span>
    ) : (
      t('components.notification.variables.invalid')
    );
    const color = isValid
      ? 'var(--cl-warning-color)'
      : 'var(--cl-danger-color)';
    const label = category ? `$\{${category}:${name}\}` : `$\{${name}\}`;
    return h(ElTooltip, null, {
      default: (
        <span
          class={{
            'variable-label': true,
            selected: this.getSelected(),
          }}
          style={{
            color,
            fontWeight: this.__bold ? 'bold' : 'normal',
            fontStyle: this.__italic ? 'italic' : 'normal',
            textDecoration: this.__underline ? 'underline' : 'none',
            textDecorationLine: this.__strikethrough ? 'line-through' : 'none',
          }}
          onClick={() => {
            editor.update(() => {
              const node = $getNodeByKey(this.getKey()) as VariableNode;
              node.setSelected(!node.getSelected());
            });
          }}
        >
          {label}
        </span>
      ),
      content: tooltip,
    });
  }

  toggleFormat(formatType: TextFormatType): void {
    switch (formatType) {
      case 'bold':
        this.setBold(!this.getBold());
        break;
      case 'italic':
        this.setItalic(!this.getItalic());
        break;
      case 'underline':
        this.setUnderline(!this.getUnderline());
        break;
      case 'strikethrough':
        this.setStrikethrough(!this.getStrikethrough());
        break;
    }
  }

  getCategory(): string {
    return this.__category;
  }

  getName(): string {
    return this.__name;
  }

  getBold(): boolean {
    return this.__bold;
  }

  getItalic(): boolean {
    return this.__italic;
  }

  getUnderline(): boolean {
    return this.__underline;
  }

  getStrikethrough(): boolean {
    return this.__strikethrough;
  }

  getSelected(): boolean {
    return this.__selected;
  }

  setBold(bold: boolean): void {
    this.__bold = bold;
  }

  setItalic(italic: boolean): void {
    this.__italic = italic;
  }

  setUnderline(underline: boolean): void {
    this.__underline = underline;
  }

  setStrikethrough(strikethrough: boolean): void {
    this.__strikethrough = strikethrough;
  }

  setSelected(selected: boolean): void {
    this.__selected = selected;
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
