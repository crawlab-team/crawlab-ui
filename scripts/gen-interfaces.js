import path from 'path';
import fs from 'fs';
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

  // Recursive function to read directory
  const readDirRecursively = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        readDirRecursively(fullPath);
      } else if (entry.isFile() && fullPath.endsWith('.d.ts')) {
        files.push(fullPath);
      }
    }
  };

  // Read files recursively
  readDirRecursively(modulePath);
  
  log(`Found ${files.length} files.`, 'info');

  log('Generating definitions...', 'info');
  files.forEach((f, i) => {
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

    if (((i + 1) % 100 === 0 && i > 0) || i + 1 === files.length) {
      log(`Processed: ${i + 1}/${files.length}`, 'info');
    }
  });
  log('All definition files generated', 'success');

  const end = Date.now();

  const duration = ((end - start) / 1000).toFixed(1);

  log(`Done in ${duration}s`, 'success');
};

(async function () {
  await genInterfaces();
})();
