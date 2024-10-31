import path from 'path';
import fs from 'fs';
import os from 'os';

const EXPORT_MODULES = ['components', 'views', 'directives', 'layouts'];

const COMPONENT_PREFIX = 'Cl';
const INDEX_COMP_NAME = 'index';

function isWindows() {
  return os.platform() === 'win32';
}

function getModulePath(moduleName) {
  let modulePath = path.resolve(`./src/${moduleName}`);
  if (isWindows()) {
    modulePath = modulePath.replace(/\\/g, '/');
  }
  return modulePath;
}

function readFileAndModify(filePath, componentName) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let newFileContent = '';
  newFileContent = addComponentName(fileContent, componentName);
  if (newFileContent !== fileContent) {
    fs.writeFileSync(filePath, newFileContent);
  }
}

function processFile(filePath, moduleName) {
  const fileName = path.basename(filePath);
  const relPath = `.${filePath.replace(getModulePath(moduleName), '')}`;

  // skip index.ts
  if (fileName.split('.')[0] === INDEX_COMP_NAME) {
    return;
  }

  if (filePath.endsWith('.vue')) {
    const compName = fileName.replace('.vue', '');
    const importLine = `import ${compName} from '${relPath}';`;
    const exportLine = `${compName} as ${COMPONENT_PREFIX}${compName},`;

    readFileAndModify(filePath, compName);
    return { importLine, exportLine };
  } else if (
    !filePath.endsWith('.d.ts') &&
    (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) &&
    fileName !== INDEX_COMP_NAME
  ) {
    let compName = fileName.replace(/.tsx?$/, '');
    compName += compName === 'export' ? '_' : '';

    let importLine;
    if (compName.startsWith('use')) {
      importLine = `import ${compName} from '${relPath.replace(/.tsx?$/, '')}';`;
    } else {
      importLine = `import * as ${compName} from '${relPath.replace(/.tsx?$/, '')}';`;
    }
    const exportLine = `${compName} as ${compName},`;
    return { importLine, exportLine };
  }
}

function addComponentName(content, componentName) {
  const setupScriptTagRegex = /(<script\s+setup[^>]*lang=["']ts["'][^>]*>)/;
  const setupEndScriptTagRegex = /(<\/script>)/;
  const defineOptionsRegex = /defineOptions\(\{[^}]*}\);?\n/;
  const newDefineOptions = `defineOptions({ name: '${COMPONENT_PREFIX}${componentName}' });`;

  // Default to returning the original content
  let newContent = content;

  // Check if the script setup tag exists
  if (setupScriptTagRegex.test(content)) {
    if (defineOptionsRegex.test(content)) {
      // If defineOptions exists, remove it and add to end of the script setup tag
      newContent = newContent.replace(defineOptionsRegex, '');
      newContent = newContent.replace(
        setupEndScriptTagRegex,
        `${newDefineOptions}\n$1`
      );
    } else {
      // If defineOptions does not exist, add it after the script setup tag
      newContent = newContent.replace(
        setupEndScriptTagRegex,
        `${newDefineOptions}\n$1`
      );
    }
  }
  return newContent; // Return original content if no <script setup> tag found
}

function genIndex(moduleName) {
  const modulePath = getModulePath(moduleName);
  const importExportLines = [];

  const processEachFile = filePath => {
    const lines = processFile(filePath, moduleName);
    if (lines) importExportLines.push(lines);
  };

  // Recursive function to read directory
  function readDirRecursively(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name).replace(/\\/g, '/');
      if (file.isDirectory()) {
        readDirRecursively(filePath);
      } else {
        processEachFile(filePath);
      }
    }
  }

  // Read directory recursively
  readDirRecursively(modulePath);

  // sort import lines by file name
  importExportLines.sort((a, b) => {
    const aName = a.importLine.match(/import (.*) from/)[1];
    const bName = b.importLine.match(/import (.*) from/)[1];
    return aName.localeCompare(bName);
  });

  const importLines = importExportLines.map(line => line.importLine).join('\n');
  const exportLines = importExportLines
    .map(line => `  ${line.exportLine}`)
    .join('\n');

  const content = `${importLines}\n\nexport {\n${exportLines}\n};\n`;
  fs.writeFileSync(`${modulePath}/index.ts`, content);
}

// gen module index.ts
EXPORT_MODULES.forEach(m => genIndex(m));
