import { TextNode } from 'lexical';
import type { ElementNode } from 'lexical';

export declare const getAllNodes: <T = ElementNode>(
  checkNodeFn: (node: T) => boolean
) => T[];
export declare const getAllTextNodes: () => TextNode[];
