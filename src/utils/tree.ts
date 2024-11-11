type HandleNodeFn<T extends TreeNode> = (parentNode: T, node: T) => T;

const getNormalizedNodes = <T extends TreeNode>(
  node: T,
  handleNodeFn?: HandleNodeFn<T>
): T[] => {
  let nodes = [] as T[];
  nodes.push(node);
  node.children?.forEach((subNode: T) => {
    if (handleNodeFn) {
      subNode = handleNodeFn(node, subNode);
    }
    nodes = nodes.concat(getNormalizedNodes(subNode, handleNodeFn));
  });
  return nodes;
};

export const normalizeTree = <T extends TreeNode>(
  nodes: T[],
  handleNodeFn?: HandleNodeFn<T>
): T[] => {
  let results = [] as T[];
  nodes.forEach(node => {
    results = results.concat(getNormalizedNodes<T>(node, handleNodeFn));
  });
  return results;
};
