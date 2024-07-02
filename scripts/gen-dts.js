import fs from 'fs';
import { spawn } from 'child_process';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function main() {
  const typingsPath = resolve(join(__dirname, '..', 'typings'));
  if (fs.existsSync(typingsPath)) {
    fs.rmSync(typingsPath, { recursive: true });
  }

  const child = spawn(
    'vue-tsc',
    '--declaration --emitDeclarationOnly --declarationDir ./typings --rootDir ./src'.split(
      ' '
    ),
    { shell: true }
  );
  child.stdout.on('data', data => {
    log(`${data}`, 'info');
  });
  child.stderr.on('data', data => {
    log(`${data}`, 'error');
  });
  child.on('close', code => {
    log(`child process exited with code ${code}`, 'info');
  });
}

main();
