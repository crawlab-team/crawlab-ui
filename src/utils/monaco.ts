import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

export const initMonaco = () => {
  self.MonacoEnvironment = {
    getWorker(workerId: string, label: string): Promise<Worker> | Worker {
      const isProd = process.env.NODE_ENV === 'production';
      const workerUrlBase = './workers/';
      switch (label) {
        case 'javascript':
        case 'typescript':
          // @ts-ignore
          return isProd
            ? new Worker(workerUrlBase + 'ts.worker.js')
            : tsWorker();
        default:
          // @ts-ignore
          return isProd
            ? new Worker(workerUrlBase + 'editor.worker.js')
            : editorWorker();
      }
    },
  };
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
};
