import { AutoLinkNode, LinkAttributes } from '@lexical/link';
import {
  type ElementNode,
  type LexicalEditor,
  LexicalNode,
  TextNode,
} from 'lexical';
import { MaybeRef } from 'vue';

type ChangeHandler = (url: string | null, prevUrl: string | null) => void;

interface LinkMatcherResult {
  attributes?: LinkAttributes;
  index: number;
  length: number;
  text: string;
  url: string;
}

type LinkMatcher = (text: string) => LinkMatcherResult | null;
export declare const EMAIL_MATCHER: RegExp;
export declare const matchers: ((text: string) => LinkMatcherResult)[];

export declare function findFirstMatch(
  text: string,
  matchers: Array<LinkMatcher>
): LinkMatcherResult | null;

export declare const PUNCTUATION_OR_SPACE: RegExp;

export declare function isSeparator(char: string): boolean;

export declare function endsWithSeparator(textContent: string): boolean;

export declare function startsWithSeparator(textContent: string): boolean;

export declare function isPreviousNodeValid(node: LexicalNode): boolean;

export declare function isNextNodeValid(node: LexicalNode): boolean;

export declare function isContentAroundIsValid(
  matchStart: number,
  matchEnd: number,
  text: string,
  node: TextNode
): boolean;

export declare function handleLinkCreation(
  node: TextNode,
  matchers: Array<LinkMatcher>,
  onChange: ChangeHandler
): void;

export declare function handleLinkEdit(
  linkNode: AutoLinkNode,
  matchers: Array<LinkMatcher>,
  onChange: ChangeHandler
): void;

export declare function handleBadNeighbors(
  textNode: TextNode,
  onChange: ChangeHandler
): void;

export declare function replaceWithChildren(
  node: ElementNode
): Array<LexicalNode>;

export declare function useAutoLink(
  editor: LexicalEditor,
  matchers: MaybeRef<Array<LinkMatcher>>,
  onChange?: ChangeHandler
): void;

export {};
