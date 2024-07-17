<script setup lang="ts">
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  getNearestEditorFromDOMNode,
  type LexicalEditor,
} from 'lexical';
import { $isLinkNode } from '@lexical/link';
import { $findMatchingParent, isHTMLAnchorElement } from '@lexical/utils';
import useMounted from '../composables/useLexicalMounted';

const props = withDefaults(
  defineProps<{
    editor: LexicalEditor;
    newTab?: boolean;
  }>(),
  {
    newTab: true,
  }
);

function findMatchingDOM<T extends Node>(
  startNode: Node,
  predicate: (node: Node) => node is T
): T | null {
  let node: Node | null = startNode;
  while (node != null) {
    if (predicate(node)) return node;

    node = node.parentNode;
  }
  return null;
}

useMounted(() => {
  const { editor } = props;
  const onClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    const nearestEditor = getNearestEditorFromDOMNode(target);

    if (nearestEditor === null) return;

    let url = null;
    let urlTarget = null;
    nearestEditor.update(() => {
      const clickedNode = $getNearestNodeFromDOMNode(target);
      if (clickedNode) {
        const maybeLinkNode = $findMatchingParent(clickedNode, $isElementNode);
        if ($isLinkNode(maybeLinkNode)) {
          url = maybeLinkNode.sanitizeUrl(maybeLinkNode.getURL());
          urlTarget = maybeLinkNode.getTarget();
        } else {
          const a = findMatchingDOM(target, isHTMLAnchorElement);
          if (a !== null) {
            url = a.href;
            urlTarget = a.target;
          }
        }
      }
    });

    if (url === null || url === '') return;

    // Allow user to select link text without following url
    const selection = editor.getEditorState().read($getSelection);
    if ($isRangeSelection(selection) && !selection.isCollapsed()) {
      event.preventDefault();
      return;
    }

    const isMiddle = event.type === 'auxclick' && event.button === 1;
    window.open(
      url,
      props.newTab ||
        isMiddle ||
        event.metaKey ||
        event.ctrlKey ||
        urlTarget === '_blank'
        ? '_blank'
        : '_self'
    );
    event.preventDefault();
  };

  const onMouseUp = (event: MouseEvent) => {
    if (event.button === 1 && editor.isEditable()) onClick(event);
  };

  return editor.registerRootListener((rootElement, prevRootElement) => {
    if (prevRootElement) {
      prevRootElement.removeEventListener('click', onClick);
      prevRootElement.removeEventListener('mouseup', onMouseUp);
    }
    if (rootElement) {
      rootElement.addEventListener('click', onClick);
      rootElement.addEventListener('mouseup', onMouseUp);
    }
  });
});
defineOptions({ name: 'ClLexicalClickableLinkPlugin' });
</script>

<template />
