import { $getRoot, $isTextNode, TextNode } from 'lexical';
import type { ElementNode } from 'lexical';

// 获取所有文本节点的函数
export const getAllNodes = <T = ElementNode>(
  checkNodeFn: (node: T) => boolean
): T[] => {
  let allNodes: T[] = [];
  const root = $getRoot();
  const nodes = root.getChildren<T>();
  nodes.forEach(node => {
    if (checkNodeFn(node)) {
      allNodes.push(node);
    }
    // 如果节点有子节点，递归获取文本节点
    getAllNodesRecursively(node, allNodes, checkNodeFn);
  });
  return allNodes;
};

export const getAllTextNodes = (): TextNode[] => {
  return getAllNodes<TextNode>($isTextNode);
};

// 递归获取文本节点的辅助函数
const getAllNodesRecursively = <T = ElementNode>(
  node: T,
  allNodes: T[],
  checkNodeFn: (node: T) => boolean
) => {
  const children = node.getChildren<T>?.() || [];
  children.forEach(child => {
    if (checkNodeFn(child)) {
      allNodes.push(child);
    } else {
      getAllNodesRecursively<T>(child, allNodes, checkNodeFn);
    }
  });
};
