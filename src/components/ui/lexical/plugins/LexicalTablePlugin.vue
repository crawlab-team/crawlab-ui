<script setup lang="ts">
import type {
  HTMLTableElementWithWithTableSelectionState,
  TableObserver,
} from '@lexical/table';
import {
  $computeTableMap,
  $createTableCellNode,
  $createTableNodeWithDimensions,
  $getNodeTriplet,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  INSERT_TABLE_COMMAND,
  TableCellNode,
  TableNode,
  TableRowNode,
  applyTableHandlers,
} from '@lexical/table';
import {
  $insertFirst,
  $insertNodeToNearestRoot,
  mergeRegister,
} from '@lexical/utils';
import {
  $getNodeByKey,
  $isTextNode,
  $nodesOfType,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
  type NodeKey,
} from 'lexical';
import invariant from 'tiny-invariant';
import useMounted from '../composables/useLexicalMounted';
import useLexicalEffect from '../composables/useLexicalEffect';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    editor: LexicalEditor;
    hasCellMerge?: boolean;
    hasCellBackgroundColor?: boolean;
    hasTabHandler?: boolean;
  }>(),
  {
    hasCellMerge: true,
    hasCellBackgroundColor: true,
    hasTabHandler: true,
  }
);

const startX = ref(0);
const startWidth = ref(0);
const endWidth = ref(0);
const isResizing = ref(false);
const resetResize = () => {
  isResizing.value = false;
  startX.value = 0;
  startWidth.value = 0;
};

const SET_TABLE_CELL_WIDTH_COMMAND =
  createCommand<SetTableHeadCellWidthPayload>('SET_TABLE_CELL_WIDTH_COMMAND');
const INITIALIZE_TABLE_NODE_COMMAND = createCommand<{ nodeKey: string }>(
  'INITIALIZE_TABLE_NODE_COMMAND'
);

const isEdge = (e: MouseEvent) => {
  const cell = e.target as HTMLTableCellElement;
  const rect = cell.getBoundingClientRect();
  return e.clientX > rect.right - 10;
};

useMounted(() => {
  const { editor } = props;

  if (!editor.hasNodes([TableNode, TableCellNode, TableRowNode])) {
    invariant(
      false,
      'TablePlugin: TableNode, TableCellNode or TableRowNode not registered on editor'
    );
  }

  const tableSelections = new Map<NodeKey, TableObserver>();

  const initializeResizableTableCellNodes = (tableNode: TableNode) => {
    const tableHeadCellNodes =
      tableNode
        .getFirstChild<TableRowNode>()
        ?.getChildren<TableCellNode>()
        ?.filter(cell => !!$isTableCellNode(cell)) || [];
    const tableElement = editor.getElementByKey(tableNode.getKey());
    if (!tableElement) return;
    const thElements = tableElement.querySelectorAll('th') || [];
    thElements.forEach((th, index) => {
      const tableHeadCellNode = tableHeadCellNodes[index];

      // head cells
      th.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.target === tableElement || !isEdge(e)) {
          return;
        }

        startX.value = e.pageX;
        startWidth.value = th.offsetWidth;
        tableElement.classList.add('resizing');
        document.addEventListener('mousemove', onTableCellMouseMove);
        document.addEventListener('mouseup', onTableCellMouseUp);
      });

      // body cells
      tableElement
        ?.querySelectorAll<HTMLTableCellElement>(`td:nth-child(${index + 1})`)
        .forEach(td => {
          td.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target === tableElement || !isEdge(e)) {
              return;
            }

            startX.value = e.pageX;
            startWidth.value = th.offsetWidth;
            document.addEventListener('mousemove', onTableCellMouseMove);
            document.addEventListener('mouseup', onTableCellMouseUp);
          });
        });

      const onTableCellMouseMove = (e: MouseEvent) => {
        e.stopPropagation();
        if (editor.isEditable()) {
          editor.setEditable(false);
          isResizing.value = true;
        }
        if (!isResizing.value) return;
        const newWidth = startWidth.value + (e.pageX - startX.value);
        th.style.width = `${newWidth}px`;
        endWidth.value = newWidth;
      };

      const onTableCellMouseUp = () => {
        resetResize();
        editor.setEditable(true);
        tableElement.classList.remove('resizing');
        document.removeEventListener('mousemove', onTableCellMouseMove);
        document.removeEventListener('mouseup', onTableCellMouseUp);
        editor.dispatchCommand(SET_TABLE_CELL_WIDTH_COMMAND, {
          nodeKey: tableHeadCellNode.getKey(),
          width: endWidth.value,
        });
      };
    });
  };

  const initializeTableNode = (tableNode: TableNode) => {
    const nodeKey = tableNode.getKey();
    const tableElement = editor.getElementByKey(
      nodeKey
    ) as HTMLTableElementWithWithTableSelectionState;
    if (tableElement && !tableSelections.has(nodeKey)) {
      const tableSelection = applyTableHandlers(
        tableNode,
        tableElement,
        editor,
        props.hasTabHandler
      );
      tableSelections.set(nodeKey, tableSelection);

      initializeResizableTableCellNodes(tableNode);
    }
  };

  // Plugins might be loaded _after_ initial content is set, hence existing table nodes
  // won't be initialized from mutation[create] listener. Instead, doing it here,
  editor.getEditorState().read(() => {
    const tableNodes = $nodesOfType(TableNode);
    for (const tableNode of tableNodes) {
      if ($isTableNode(tableNode)) initializeTableNode(tableNode);
    }
  });

  const unregisterMutationListener = editor.registerMutationListener(
    TableNode,
    nodeMutations => {
      for (const [nodeKey, mutation] of nodeMutations) {
        if (mutation === 'created') {
          editor.getEditorState().read(() => {
            const tableNode = $getNodeByKey<TableNode>(nodeKey);
            if ($isTableNode(tableNode)) initializeTableNode(tableNode);
          });
        } else if (mutation === 'destroyed') {
          const tableSelection = tableSelections.get(nodeKey);

          if (tableSelection) {
            tableSelection.removeListeners();
            tableSelections.delete(nodeKey);
          }
        }
      }
    }
  );

  const unregisterMergeListener = mergeRegister(
    editor.registerCommand(
      INSERT_TABLE_COMMAND,
      ({ columns, rows, includeHeaders }) => {
        const tableNode = $createTableNodeWithDimensions(
          Number(rows),
          Number(columns),
          includeHeaders
        );
        $insertNodeToNearestRoot(tableNode);

        const firstDescendant = tableNode.getFirstDescendant();
        if ($isTextNode(firstDescendant)) firstDescendant.select();

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      SET_TABLE_CELL_WIDTH_COMMAND,
      ({ nodeKey, width }) => {
        editor.update(() => {
          const tableCellNode = $getNodeByKey<TableCellNode>(nodeKey);
          tableCellNode?.setWidth(width);
        });
        editor.dispatchCommand(INITIALIZE_TABLE_NODE_COMMAND, { nodeKey });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    ),
    editor.registerCommand(
      INITIALIZE_TABLE_NODE_COMMAND,
      ({ nodeKey }) => {
        editor.update(() => {
          const tableNode = $getNodeByKey<TableNode>(nodeKey);
          if ($isTableNode(tableNode)) {
            initializeTableNode(tableNode);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    )
  );

  return () => {
    unregisterMutationListener();
    unregisterMergeListener();
    // Hook might be called multiple times so cleaning up tables listeners as well,
    // as it'll be reinitialized during recurring call
    for (const [, tableSelection] of tableSelections)
      tableSelection.removeListeners();
  };
});

// Unmerge cells when the feature isn't enabled
useLexicalEffect(() => {
  const { editor } = props;

  if (props.hasCellMerge) return;

  return editor.registerNodeTransform(TableCellNode, node => {
    if (node.getColSpan() > 1 || node.getRowSpan() > 1) {
      // When we have rowSpan we have to map the entire Table to understand where the new Cells
      // fit best; let's analyze all Cells at once to save us from further transform iterations
      const [, , gridNode] = $getNodeTriplet(node);
      const [gridMap] = $computeTableMap(gridNode, node, node);
      // TODO this function expects Tables to be normalized. Look into this once it exists
      const rowsCount = gridMap.length;
      const columnsCount = gridMap[0].length;
      let row = gridNode.getFirstChild();
      invariant(
        $isTableRowNode(row),
        'Expected TableNode first child to be a RowNode'
      );

      const unmerged = [];
      for (let i = 0; i < rowsCount; i++) {
        if (i !== 0) {
          row = row.getNextSibling();
          invariant(
            $isTableRowNode(row),
            'Expected TableNode first child to be a RowNode'
          );
        }
        let lastRowCell: null | TableCellNode = null;
        for (let j = 0; j < columnsCount; j++) {
          const cellMap = gridMap[i][j];
          const cell = cellMap.cell;
          if (cellMap.startRow === i && cellMap.startColumn === j) {
            lastRowCell = cell;
            unmerged.push(cell);
          } else if (cell.getColSpan() > 1 || cell.getRowSpan() > 1) {
            invariant(
              $isTableCellNode(cell),
              'Expected TableNode cell to be a TableCellNode'
            );
            const newCell = $createTableCellNode(cell.__headerState);
            if (lastRowCell) lastRowCell.insertAfter(newCell);
            else $insertFirst(row, newCell);
          }
        }
      }
      for (const cell of unmerged) {
        cell.setColSpan(1);
        cell.setRowSpan(1);
      }
    }
  });
});

useLexicalEffect(() => {
  const { editor } = props;

  if (props.hasCellBackgroundColor) return;

  return editor.registerNodeTransform(TableCellNode, node => {
    if (node.getBackgroundColor()) node.setBackgroundColor(null);
  });
});

defineOptions({ name: 'ClLexicalTablePlugin' });
</script>
