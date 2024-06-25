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
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      // noEmitOnError: true,
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

  const sourceFiles = [];

  const start = Date.now();

  log('Getting all files...', 'info');
  const filePaths = klawSync(root, {
    nodir: true,
  })
    .map(item => item.path)
    .filter(path => !DEMO_RE.test(path))
    .filter(path => !TEST_RE.test(path))
    .filter(exclude)
    .filter(include);

  await Promise.all(
    filePaths.map(async file => {
      try {
        if (file.endsWith('.vue')) {
          // .vue file
          const content = await fs.promises.readFile(file, 'utf-8');
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
            const sourceFile = project.createSourceFile(
              path.relative(process.cwd(), file) + (isTS ? '.ts' : '.js'),
              content
            );
            sourceFiles.push(sourceFile);
          }
        } else if (file.endsWith('.ts')) {
          // .ts file
          const sourceFile = project.addSourceFileAtPath(file);
          sourceFiles.push(sourceFile);
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    })
  );
  log(
    `Found valid source files: ${sourceFiles.length}/${filePaths.length}`,
    'success'
  );

  log('Checking files...', 'info');
  const diagnostics = project.getPreEmitDiagnostics();
  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
  if (diagnostics.length) {
    log(`Files checked with ${diagnostics.length} errors`, 'warn');
  } else {
    log('Files checked without errors', 'success');
  }

  await project.emit({
    emitOnlyDtsFiles: true,
  });

  // iterate source files
  log('Parsing files...', 'info');
  await Promise.all(
    sourceFiles.map(async sourceFile => {
      const emitOutput = sourceFile.getEmitOutput();
      const outputFiles = emitOutput.getOutputFiles();
      log(
        `Generating definition for file: ${sourceFile.getBaseName()} (output files: ${outputFiles.length})`,
        'info'
      );

      await Promise.all(
        outputFiles.map(async outputFile => {
          const filepath = outputFile.getFilePath();
          await fs.promises.mkdir(path.dirname(filepath), {
            recursive: true,
          });
          await fs.promises.writeFile(filepath, outputFile.getText(), 'utf8');
          log(
            `Definition for file: ${sourceFile.getBaseName()} generated`,
            'success'
          );
        })
      );
    })
  );
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
