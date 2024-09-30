import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

export const initMonaco = () => {
  self.MonacoEnvironment = {
    getWorker(workerId: string, label: string): Promise<Worker> | Worker {
      switch (label) {
        case 'javascript':
        case 'typescript':
          // @ts-ignore
          return tsWorker();
        default:
          // @ts-ignore
          return editorWorker();
      }
    },
  };
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
};
