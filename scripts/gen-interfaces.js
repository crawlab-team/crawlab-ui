import path from 'path';
import fs from 'fs';
import rd from 'rd';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const genInterfaces = async moduleName => {
  if (!moduleName) {
    moduleName = 'interfaces';
  }

  // module path
  const modulePath = path.resolve(`./src/${moduleName}`);

  // output directory path
  const outputDirPath = path.resolve(__dirname, '..', 'typings', moduleName);

  const files = [];

  const start = Date.now();

  log('Getting all files...', 'info');

  // read each file
  rd.eachSync(modulePath, (f, s) => {
    // skip non-definition files
    if (!f.endsWith('.d.ts')) return;
    files.push(f);
  });
  log(`Found ${files.length} files`, 'info');

  log('Generating definitions...', 'info');
  await Promise.all(
    files.map(async f => {
      // output file path
      const outputFilePath = f.replace(modulePath, outputDirPath);

      // output file directory path
      const outputFileDirPath = path.dirname(outputFilePath);

      // create directory if not exists
      if (!fs.existsSync(outputFileDirPath)) {
        fs.mkdirSync(outputFileDirPath, {
          recursive: true,
        });
      }

      // copy file
      fs.copyFileSync(f, outputFilePath);
      log(`Definition for file: ${path.basename(f)} generated`, 'success');
    })
  );
  log('All definition files generated', 'success');

  const end = Date.now();

  const duration = ((end - start) / 1000).toFixed(1);

  log(`Done in ${duration}s`, 'success');
};

(async function () {
  await genInterfaces();
})();
