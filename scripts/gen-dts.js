import path from 'path';
import fs from 'fs';
import { Project } from 'ts-morph';
import vueCompiler from '@vue/compiler-sfc';
import klawSync from 'klaw-sync';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TSCONFIG_PATH = path.resolve(__dirname, '../tsconfig.dts.json');
const DEMO_RE = /\/demo\/\w+\.vue$/;
const TEST_RE = /__test__|__tests__/;
const excludedFiles = [
  'mock',
  'package.json',
  'spec',
  'test',
  'tests',
  'css',
  '.DS_Store',
];
const includedFiles = ['.vue', '.ts'];
const exclude = path => !excludedFiles.some(f => path.includes(f));
const include = path => includedFiles.some(f => path.includes(f));

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
async function genVueTypes(
  root,
  outDir = path.resolve(__dirname, '../typings')
) {
  const options = {
    compilerOptions: {
      allowJs: false,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir,
      paths: {
        '@': [path.resolve(__dirname, '../src')],
        '@/*': [path.resolve(__dirname, '../src/*')],
      },
      skipLibCheck: true,
    },
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  };
  const project = new Project(options);

  const start = Date.now();

  log('Getting all files...', 'info');
  const filePaths = klawSync(root, { nodir: true })
    .map(item => item.path)
    .filter(path => !DEMO_RE.test(path))
    .filter(path => !TEST_RE.test(path))
    .filter(exclude)
    .filter(include);

  filePaths.forEach((file, i) => {
    let sourceFile;
    try {
      if (file.endsWith('.vue')) {
        // .vue file
        const content = fs.readFileSync(file, 'utf-8');
        const sfc = vueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content = '';
          let isTS = false;
          if (script && script.content) {
            content += script.content;
            if (script.lang === 'ts') isTS = true;
          }
          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            });
            content += compiled.content;
            if (scriptSetup.lang === 'ts') isTS = true;
          }
          sourceFile = project.createSourceFile(
            path.relative(process.cwd(), file) + (isTS ? '.ts' : '.js'),
            content
          );
        }
      } else if (file.endsWith('.ts')) {
        // .ts file
        const content = fs.readFileSync(file, 'utf-8');
        sourceFile = project.createSourceFile(
          path.relative(process.cwd(), file),
          content
        );
      }

      if (!sourceFile) return;

      log(`Processing ${sourceFile.getFilePath()}`, 'info');
      const emitOutput = sourceFile.getEmitOutput({ emitOnlyDtsFiles: true });
      log(`Emitting ${sourceFile.getFilePath()}`, 'info');
      const outputFiles = emitOutput.getOutputFiles();
      outputFiles.forEach(outputFile => {
        const filepath = outputFile.getFilePath();
        fs.mkdirSync(path.dirname(filepath), {
          recursive: true,
        });
        fs.writeFileSync(filepath, outputFile.getText(), 'utf8');
      });

      if (((i + 1) % 100 === 0 && i > 0) || i + 1 === filePaths.length) {
        log(`Processed: ${i + 1}/${filePaths.length}`, 'info');
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
  log('All definition files generated', 'success');

  // export interfaces in typings/index.d.ts
  log('Exporting interfaces...', 'info');
  const idxFilePath = path.resolve(__dirname, '../typings/index.d.ts');
  if (fs.existsSync(idxFilePath)) {
    let fileContent = fs.readFileSync(idxFilePath);
    const exportInterfacesLine = "export * from './interfaces';";
    if (!fileContent.includes(exportInterfacesLine)) {
      fileContent = exportInterfacesLine + '\n' + fileContent;
    }
    fs.writeFileSync(idxFilePath, fileContent);
  }
  log('Interfaces exported', 'success');

  const end = Date.now();

  const duration = ((end - start) / 1000).toFixed(1);

  log(`Done in ${duration}s`, 'success');
}

(async function () {
  await genVueTypes(
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../typings')
  );
})();
