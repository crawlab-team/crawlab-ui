import { h } from 'vue';
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
  TextFormatType,
} from 'lexical';
import { translate } from '@/utils';
import { isValidVariable } from '@/utils/notification';
import { UPDATE_VARIABLE_COMMAND } from '@/components/ui/lexical/composables/useVariableSetup';

const t = translate;

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

export class VariableNode extends DecoratorNode<JSX.Element> {
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
  }: SerializedVariableNode) {
    super(key);
    this.category = category;
    this.name = name;
    this.__bold = __bold || false;
    this.__italic = __italic || false;
    this.__underline = __underline || false;
    this.__strikethrough = __strikethrough || false;
    this.__selected = false;
  }

  static getType(): string {
    return 'variable';
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode({
      category: node.category,
      name: node.name,
      key: node.__key,
    });
  }

  exportDOM(_: LexicalEditor): DOMExportOutput {
    const category = this.getCategory();
    const name = this.getName();
    const element = document.createElement('span');
    element.classList.add('variable');
    element.setAttribute('contenteditable', 'true');
    element.innerText = category ? `$\{${category}:${name}\}` : `$\{${name}\}`;
    return { element };
  }

  static importJSON(serializedNode: SerializedVariableNode): VariableNode {
    return $createVariableNode({ ...serializedNode });
  }

  exportJSON(): SerializedVariableNode {
    return {
      type: VariableNode.getType(),
      version: this.version,
      category: this.category,
      name: this.name,
      __bold: this.__bold,
      __italic: this.__italic,
      __underline: this.__underline,
      __strikethrough: this.__strikethrough,
      __selected: this.__selected,
    };
  }

  onClick(editor: LexicalEditor) {
    editor.dispatchCommand(UPDATE_VARIABLE_COMMAND, {
      nodeKey: this.getKey(),
      action: 'select',
    } as UpdateVariableCommandPayload);
  }

  createDOM(_: EditorConfig): HTMLElement {
    const currentElement = document.createElement('span');
    currentElement.classList.add('variable');
    currentElement.setAttribute('contenteditable', 'true');
    return currentElement;
  }

  updateDOM(): false {
    return false;
  }

  decorate(editor): JSX.Element {
    const latest = this.getLatest();
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

    const backgroundColor = latest.__selected
      ? 'var(--cl-warning-plain-color)'
      : '';
    const fontWeight = latest.__bold ? 'bold' : 'normal';
    const fontStyle = latest.__italic ? 'italic' : 'normal';
    const textDecoration = [
      latest.__underline && 'underline',
      latest.__strikethrough && 'line-through',
    ]
      .filter(Boolean)
      .join(' ');
    const label = category ? `$\{${category}:${name}\}` : `$\{${name}\}`;
    return h(ElTooltip, null, {
      default: () => (
        <span
          style={{
            color,
            backgroundColor,
            fontWeight,
            fontStyle,
            textDecoration,
          }}
          onClick={() => latest.onClick(editor)}
        >
          {label}
        </span>
      ),
      content: () => tooltip,
    });
  }

  toggleFormat(formatType: TextFormatType): void {
    switch (formatType) {
      case 'bold':
        this.toggleBold();
        break;
      case 'italic':
        this.toggleItalic();
        break;
      case 'underline':
        this.toggleUnderline();
        break;
      case 'strikethrough':
        this.toggleStrikethrough();
        break;
    }
  }

  getCategory(): string {
    return this.category;
  }

  getName(): string {
    return this.name;
  }

  getTextContent(): string {
    return this.category
      ? `$\{${this.category}:${this.name}\}`
      : `$\{${this.name}\}`;
  }

  toggle(key, value?: boolean) {
    const latest = this.getLatest().exportJSON();
    const writable = this.getWritable();
    for (const _key of Object.keys(latest)) {
      if (_key.startsWith('__')) writable[_key] = latest[_key];
    }
    if (value === undefined) {
      writable[key] = !latest[key];
    } else {
      writable[key] = value;
    }
  }

  toggleBold() {
    this.toggle('__bold');
  }

  toggleItalic() {
    this.toggle('__italic');
  }

  toggleUnderline() {
    this.toggle('__underline');
  }

  toggleStrikethrough() {
    this.toggle('__strikethrough');
  }

  setSelected(value: boolean) {
    this.toggle('__selected', value);
  }
}

export function $createVariableNode(
  params: SerializedVariableNode
): VariableNode {
  const node = new VariableNode({ ...params });
  return $applyNodeReplacement(node);
}

export function $isVariableNode(
  node: LexicalNode | null | undefined
): node is VariableNode {
  return node instanceof VariableNode;
}
