<script setup lang="tsx">
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
import {
  TAB_NAME_CONSOLE,
  TAB_NAME_OUTPUT,
  TAB_NAME_RESULTS,
} from '@/constants';
import { translate } from '@/utils';
import { useDatabaseDetail } from '@/views';
import {
  getDatabaseEditorLanguage,
  getDatabaseSyntaxKeywordRegexByDataSource,
  getDatabaseSyntaxKeywords,
  getDataType,
} from '@/utils/database';
import { ClTableEditCell } from '@/components';

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

const editorLanguage = computed(() =>
  getDatabaseEditorLanguage(state.form?.data_source || 'mongo')
);

let completionItemProvider: monaco.IDisposable | null = null;
const updateKeywords = () => {
  if (completionItemProvider) {
    completionItemProvider.dispose();
  }

  const { from, manipulateTable, manipulateField } =
    getDatabaseSyntaxKeywordRegexByDataSource(
      state.form?.data_source || 'mongo'
    );

  completionItemProvider = monaco.languages.registerCompletionItemProvider(
    editorLanguage.value,
    {
      provideCompletionItems: function (model, position) {
        // Get the content in the editor
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Create an array to store suggestions
        let suggestions: any[];

        // Check for different SQL keywords to provide appropriate suggestions
        if (from && from.test(textUntilPosition)) {
          // Provide table name suggestions after FROM or JOIN
          suggestions = Object.keys(tables.value).map(table => ({
            label: table,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: table,
            detail: 'Table name',
          }));
          return { suggestions };
        }

        if (manipulateField && manipulateField.test(textUntilPosition)) {
          // Provide column name suggestions
          const lastTableMatch = textUntilPosition.match(manipulateField);
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

        if (manipulateTable && manipulateTable.test(textUntilPosition)) {
          // Provide table name suggestions after INSERT INTO, UPDATE, ALTER TABLE, or DROP TABLE
          suggestions = Object.keys(tables.value).map(table => ({
            label: table,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: table,
            detail: 'Table name',
          }));
          return { suggestions };
        }

        // Provide SQL keyword suggestions
        const keywords = getDatabaseSyntaxKeywords(
          state.form?.data_source || 'mongo'
        );
        suggestions = keywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'Keyword',
        }));

        return { suggestions };
      },
    }
  );
};

const initEditor = debounce(async () => {
  if (!editorRef.value) return;
  editor?.dispose();
  editor = monaco.editor.create(editorRef.value, {
    language: editorLanguage.value,
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
  }, 1000);

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, async () => {
    await store.dispatch(`${ns}/runQuery`, { id: activeId.value });
  });

  updateKeywords();
});
watch(() => state.metadata, updateKeywords);
watch(() => state.form, initEditor);
watch(
  () => state.consoleContent,
  () => {
    if (editor && editor.getValue() !== state.consoleContent) {
      editor.setValue(state.consoleContent);
    }
  }
);
onMounted(initEditor);
watch(activeId, () => {
  store.commit(`${ns}/setConsoleContent`, '');
});

const resultsVisible = computed(() => !!activeResultsTabName.value);

const resultsColumns = computed(() => {
  return (
    state.consoleQueryResults?.columns?.map(c => {
      return {
        key: c.name,
        index: c.name,
        label: c.name,
        width: 200,
        value: (row: DatabaseTableRow) => (
          <ClTableEditCell
            modelValue={row[c.name as string]}
            dataType={getDataType(c.type as string)}
            readonly
          />
        ),
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
    hideResults();
  } else {
    store.commit(`${ns}/setConsoleQueryResultsActiveTabName`, id);
  }
};

const hideResults = () => {
  store.commit(`${ns}/setConsoleQueryResultsActiveTabName`, undefined);
};

onBeforeMount(() => {
  store.dispatch(`${ns}/getMetadata`, { id: activeId.value });
});

onBeforeUnmount(() => {
  editor?.dispose();
  completionItemProvider?.dispose();
});

// Dragging resize handle
const heightKey = 'database.console.resultsContainerHeight';
const resultsContainerRef = ref<HTMLElement | null>(null);
const onSizeChange = (size: number) => {
  if (!editorRef.value) return;
  editorRef.value.style.flex = `0 0 calc(100% - ${size}px)`;
  editorRef.value.style.height = `calc(100% - ${size}px)`;
};

defineOptions({ name: 'ClDatabaseDetailTabConsole' });
</script>

<template>
  <div
    class="database-detail-tab-console"
    :class="[resultsVisible ? 'results-visible' : ''].filter(Boolean).join(' ')"
  >
    <cl-database-sidebar :tab-name="TAB_NAME_CONSOLE" />

    <div class="content">
      <div ref="editorRef" class="editor" />
      <div ref="resultsContainerRef" class="results-container">
        <cl-resize-handle
          v-if="resultsVisible"
          :target-ref="resultsContainerRef"
          :size-key="heightKey"
          direction="horizontal"
          position="start"
          @size-change="onSizeChange"
        />
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
                @click="hideResults"
              />
            </div>
          </template>
        </cl-nav-tabs>
        <div class="results" v-if="activeResultsTabName === TAB_NAME_RESULTS">
          <cl-table
            :key="JSON.stringify(state.consoleQueryResults)"
            :columns="resultsColumns"
            :data="resultsData"
            embedded
            hide-footer
          />
        </div>
        <div
          class="output"
          v-else-if="activeResultsTabName === TAB_NAME_OUTPUT"
        >
          <pre>{{ state.consoleQueryResults?.output }}</pre>
          <pre class="error">{{ state.consoleQueryResults?.error }}</pre>
        </div>
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

  &.results-visible {
    .content {
      .editor {
        flex: 0 1 auto;
        height: 50%;
      }

      .results-container {
        overflow: auto;
        flex: 0 0 50%;
        height: 50%;
      }
    }
  }

  &:not(.results-visible) {
    .content {
      .editor {
        flex: 0 0 calc(100% - 41px) !important;
      }

      .results-container {
        flex: 0 0 41px !important;
        height: 41px !important;
      }
    }
  }

  .content {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
    flex-direction: column;

    .editor {
    }

    .results-container {
      position: relative;
      border-top: 1px solid var(--el-border-color);
      overflow: hidden;

      .resize-handle {
        position: absolute;
        width: 100%;
        top: -10px;
        height: 20px;
        cursor: ns-resize;
        z-index: 999;
      }

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
}
</style>
