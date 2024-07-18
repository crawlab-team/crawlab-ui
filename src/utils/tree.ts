type HandleNodeFn<T> = (
  parentNode: TreeNode<T>,
  node: TreeNode<T>
) => TreeNode<T>;

const getNormalizedNodes = <T = any>(
  node: TreeNode<T>,
  handleNodeFn?: HandleNodeFn<T>
): T[] => {
  let nodes = [] as T[];
  nodes.push(node as T);
  node.children?.forEach((subNode: TreeNode<T>) => {
    if (handleNodeFn) {
      subNode = handleNodeFn(node, subNode);
    }
    nodes = nodes.concat(getNormalizedNodes(subNode, handleNodeFn));
  });
  return nodes;
};

export const normalizeTree = <T = any>(
  nodes: TreeNode<T>[],
  handleNodeFn?: HandleNodeFn<T>
): T[] => {
  let results = [] as T[];
  nodes.forEach(node => {
    results = results.concat(getNormalizedNodes<T>(node, handleNodeFn));
  });
  return results;
};
