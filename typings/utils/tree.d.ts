type HandleNodeFn<T> = (
  parentNode: TreeNode<T>,
  node: TreeNode<T>
) => TreeNode<T>;
export declare const normalizeTree: <T = any>(
  nodes: TreeNode<T>[],
  handleNodeFn?: HandleNodeFn<T>
) => T[];
export {};
