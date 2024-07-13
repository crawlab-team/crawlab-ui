import { $getRoot, $isTextNode } from 'lexical';
import type { LexicalEditor, TextNode, ElementNode } from 'lexical';

// 获取所有文本节点的函数
export const getAllTextNodes = () => {
  let textNodes: TextNode[] = [];
  const root = $getRoot();
  const nodes = root.getChildren();
  nodes.forEach(node => {
    if ($isTextNode(node)) {
      textNodes.push(node);
    }
    // 如果节点有子节点，递归获取文本节点
    getAllTextNodesRecursively(node, textNodes);
  });
  return textNodes;
};

// 递归获取文本节点的辅助函数
const getAllTextNodesRecursively = (
  node: ElementNode,
  textNodes: TextNode[]
) => {
  const children = node.getChildren?.() || [];
  children.forEach(child => {
    if ($isTextNode(child)) {
      textNodes.push(child);
    } else {
      getAllTextNodesRecursively(child, textNodes);
    }
  });
};
