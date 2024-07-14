import { $getRoot, $isTextNode } from 'lexical';
import type { ElementNode } from 'lexical';

// 获取所有文本节点的函数
export const getAllNodes = (checkNodeFn: (node: ElementNode) => boolean) => {
  let allNodes: ElementNode[] = [];
  const root = $getRoot();
  const nodes = root.getChildren<ElementNode>();
  nodes.forEach(node => {
    if (checkNodeFn(node)) {
      allNodes.push(node);
    }
    // 如果节点有子节点，递归获取文本节点
    getAllNodesRecursively(node, allNodes, checkNodeFn);
  });
  return allNodes;
};

export const getAllTextNodes = () => {
  return getAllNodes($isTextNode);
};

// 递归获取文本节点的辅助函数
const getAllNodesRecursively = (
  node: ElementNode,
  allNodes: ElementNode[],
  checkNodeFn: (node: ElementNode) => boolean
) => {
  const children = node.getChildren<ElementNode>?.() || [];
  children.forEach(child => {
    if (checkNodeFn(child)) {
      allNodes.push(child);
    } else {
      getAllNodesRecursively(child, allNodes, checkNodeFn);
    }
  });
};
