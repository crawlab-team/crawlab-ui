<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { debounce } from 'lodash';
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { TAB_NAME_OUTPUT, TAB_NAME_RESULTS } from '@/constants';
import { translate } from '@/utils';
import { useDatabaseDetail } from '@/views';
import { SQL_KEYWORDS } from '@/utils/database';

const t = translate;

const ns: ListStoreNamespace = 'database';
const store = useStore();
const { database: state } = store.state as RootStoreState;

const { activeId } = useDatabaseDetail();

const editorRef = ref<HTMLElement | null>(null);

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const tables = computed(() => {
  const tables: { [key: string]: string[] } = {};
  state.metadata?.databases.forEach(db => {
    db.tables?.forEach(table => {
      tables[table.name as string] =
        table.columns?.map(c => c.name as string) || [];
    });
  });
  return tables;
});

let completionItemProvider: monaco.IDisposable | null = null;
const updateKeywords = () => {
  if (completionItemProvider) {
    completionItemProvider.dispose();
  }

  const fromRegex = /\b(FROM|JOIN)\b/i;
  const manipulateTableRegex =
    /\b(INSERT\s+INTO|UPDATE|ALTER\s+TABLE|DROP\s+TABLE)\b/i;
  const manipulateFieldRegex =
    /\b(FROM|JOIN|INSERT\s+INTO|UPDATE|ALTER\s+TABLE|DROP\s+TABLE)\s+(\w+)/i;

  completionItemProvider = monaco.languages.registerCompletionItemProvider(
    'sql',
    {
      provideCompletionItems: function (model, position) {
        // 获取编辑器中的内容
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // 用于存储补全建议
        let suggestions: any[];

        // Check for different SQL keywords to provide appropriate suggestions
        if (fromRegex.test(textUntilPosition)) {
          // Provide table name suggestions after FROM or JOIN
          suggestions = Object.keys(tables.value).map(table => ({
            label: table,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: table,
            detail: 'Table name',
          }));
          return { suggestions };
        }

        if (manipulateFieldRegex.test(textUntilPosition)) {
          // Provide column name suggestions
          const lastTableMatch = textUntilPosition.match(manipulateFieldRegex);
          if (lastTableMatch) {
            const tableName = lastTableMatch[2] as string;
            if (tables.value[tableName]) {
              const columns = tables.value[tableName] || [];
              suggestions = columns.map(column => ({
                label: column,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: column,
                detail: `Field from ${tableName}`,
              }));
              return { suggestions };
            }
          }
        }

        if (manipulateTableRegex.test(textUntilPosition)) {
          // Provide table name suggestions after INSERT INTO, UPDATE, ALTER TABLE, or DROP TABLE
          suggestions = Object.keys(tables.value).map(table => ({
            label: table,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: table,
            detail: 'Table name',
          }));
          return { suggestions };
        }

        // 添加 SQL 关键字的自动补全
        suggestions = SQL_KEYWORDS.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'SQL Keyword',
        }));

        return { suggestions };
      },
    }
  );
};

const initEditor = debounce(async () => {
  if (!editorRef.value) return;
  if (!editor) {
    editor = monaco.editor.create(editorRef.value, {
      language: 'sql',
      lineNumbersMinChars: 0,
      lineDecorationsWidth: 0,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      automaticLayout: true,
      lineNumbers: 'on',
      glyphMargin: true,
    });

    editor.setValue(state.consoleContent);

    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue();
      store.commit(`${ns}/setConsoleContent`, value);
    });

    // Add this new event listener
    editor.onDidChangeCursorSelection(e => {
      if (e.selection.isEmpty()) {
        const currentLine = editor
          ?.getModel()
          ?.getLineContent(e.selection.startLineNumber);
        if (currentLine) {
          store.commit(`${ns}/setConsoleSelectedContent`, currentLine);
        } else {
          store.commit(`${ns}/setConsoleSelectedContent`, undefined);
        }
      } else {
        const model = editor?.getModel();
        if (model) {
          store.commit(
            `${ns}/setConsoleSelectedContent`,
            model.getValueInRange(e.selection)
          );
        }
      }
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      async () => {
        await store.dispatch(`${ns}/runQuery`, { id: activeId.value });
      }
    );

    updateKeywords();
  }
});
onMounted(initEditor);
watch(() => state.metadata, updateKeywords);

const resultsVisible = computed(() => !!activeResultsTabName.value);

const resultsColumns = computed(() => {
  return (
    state.consoleQueryResults?.columns?.map(c => {
      return {
        key: c.name,
        index: c.name,
        label: c.name,
        width: 200,
      } as TableColumn;
    }) || []
  );
});
const resultsData = computed(() => {
  return state.consoleQueryResults?.rows || [];
});

const resultsTabItems = ref<NavItem[]>([
  {
    id: TAB_NAME_RESULTS,
    title: t('common.tabs.results'),
  },
  {
    id: TAB_NAME_OUTPUT,
    title: t('common.tabs.output'),
  },
]);

const activeResultsTabName = computed(
  () => state.consoleQueryResultsActiveTabName
);

const onResultsTabSelect = (id: string) => {
  if (activeResultsTabName.value === id) {
    store.commit(`${ns}/setConsoleQueryResultsActiveTabName`, undefined);
  } else {
    store.commit(`${ns}/setConsoleQueryResultsActiveTabName`, id);
  }
};

onBeforeMount(() => {
  store.dispatch(`${ns}/getMetadata`, { id: activeId.value });
});

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }
  if (completionItemProvider) {
    completionItemProvider.dispose();
  }
});

defineOptions({ name: 'ClDatabaseDetailTabConsole' });
</script>

<template>
  <div
    class="database-detail-tab-console"
    :class="resultsVisible ? 'results-visible' : ''"
  >
    <div ref="editorRef" class="editor" />
    <div class="results-container">
      <cl-nav-tabs
        :active-key="activeResultsTabName"
        :items="resultsTabItems"
        @select="onResultsTabSelect"
      >
        <template #extra>
          <div class="results-actions">
            <cl-icon
              v-if="resultsVisible"
              color="var(--cl-info-color)"
              :icon="['fa', 'minus']"
              @click="resultsVisible = false"
            />
          </div>
        </template>
      </cl-nav-tabs>
      <div class="results" v-if="activeResultsTabName === TAB_NAME_RESULTS">
        <cl-table
          :key="JSON.stringify(state.consoleQueryResults)"
          :row-key="(row: DatabaseTableRow) => JSON.stringify(row)"
          :columns="resultsColumns"
          :data="resultsData"
          embedded
          hide-footer
        />
      </div>
      <div class="output" v-else-if="activeResultsTabName === TAB_NAME_OUTPUT">
        <pre>{{ state.consoleQueryResults?.output }}</pre>
        <pre class="error">{{ state.consoleQueryResults?.error }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.database-detail-tab-console {
  display: flex;
  height: calc(100vh - 64px - 40px - 41px - 50px);
  width: 100%;
  overflow: hidden;
  flex-direction: column;

  &.results-visible {
    .editor {
      flex: 0 0 50% !important;
      height: 50% !important;
    }

    .results-container {
      overflow: auto;
      flex: 0 0 50% !important;
      height: 50% !important;
    }
  }

  .editor {
    flex: 0 0 calc(100% - 41px);
    transition: flex 0.3s;
  }

  .results-container {
    border-top: 1px solid var(--el-border-color);
    flex: 0 0 41px;
    overflow: hidden;
    transition: flex 0.3s;

    .results-actions {
      display: flex;
      align-items: center;
      padding: 0 10px;

      &:deep(.icon) {
        cursor: pointer;
        padding: 6px;
        font-size: 14px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }

      &:deep(.icon:hover) {
        background-color: var(--cl-info-plain-color);
      }
    }

    .results {
      height: calc(100% - 41px);

      &:deep(.table) {
        width: 100%;
        height: 100%;
      }

      &:deep(.table .el-table__inner-wrapper) {
        position: relative;
        overflow: unset;
      }

      &:deep(.table .el-table__header-wrapper) {
        position: sticky;
        top: 0;
      }
    }

    .output {
      padding: 10px;
      height: calc(100% - 41px);
      overflow: auto;
      white-space: pre-wrap;

      pre {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--cl-text-color);
        white-space: pre-wrap;

        &.error {
          color: var(--cl-danger-color);
        }
      }
    }
  }
}
</style>
