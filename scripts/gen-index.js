import path from 'path';
import fs from 'fs';
import rd from 'rd';
import os from 'os';

const EXPORT_MODULES = [
  'components',
  'views',
  'directives',
  'layouts',
  // 'services',
  // 'store',
  // 'utils',
  // 'constants',
];

const COMPONENT_PREFIX = 'Cl';
const INDEX_COMP_NAME = 'index';

function isWindows() {
  return os.platform() === 'win32';
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
    filePath.endsWith('.ts') &&
    // !['components', 'layouts', 'views'].includes(moduleName) &&
    fileName !== INDEX_COMP_NAME
  ) {
    let compName = fileName.replace('.ts', '');
    compName += compName === 'export' ? '_' : '';

    let importLine;
    if (compName.startsWith('use')) {
      importLine = `import ${compName} from '${relPath.replace('.ts', '')}';`;
    } else {
      importLine = `import * as ${compName} from '${relPath.replace('.ts', '')}';`;
    }
    const exportLine = `${compName} as ${compName},`;
    return { importLine, exportLine };
  }
}

function getModulePath(moduleName) {
  let modulePath = path.resolve(`./src/${moduleName}`);
  if (isWindows()) {
    modulePath = modulePath.replace(/\\/g, '/');
  }
  return modulePath;
}

function genIndex(moduleName) {
  const modulePath = getModulePath(moduleName);
  const importExportLines = [];

  const processEachFile = filePath => {
    const lines = processFile(filePath, moduleName);
    if (lines) importExportLines.push(lines);
  };

  rd.eachSync(modulePath, (f, s) => {
    processEachFile(f.replace(/\\/g, '/'));
  });

  const importLines = importExportLines.map(line => line.importLine).join('\n');
  const exportLines = importExportLines
    .map(line => `  ${line.exportLine}`)
    .join('\n');

  const content = `${importLines}\n\nexport {\n${exportLines}\n};\n`;
  fs.writeFileSync(`${modulePath}/index.ts`, content);
}

function addComponentName(content, componentName) {
  const setupScriptTagRegex = /(<script\s+setup[^>]*lang=["']ts["'][^>]*>)/;
  const defineOptionsRegex = /defineOptions\(\{[^}]*}\);?/;
  const newDefineOptions = `defineOptions({ name: '${COMPONENT_PREFIX}${componentName}' });`;

  // Check if the script setup tag exists
  if (setupScriptTagRegex.test(content)) {
    if (defineOptionsRegex.test(content)) {
      // If defineOptions exists, update it
      return content.replace(defineOptionsRegex, newDefineOptions);
    } else {
      // If defineOptions does not exist, add it after the script setup tag
      return content.replace(setupScriptTagRegex, `$1\n${newDefineOptions}`);
    }
  }
  return content; // Return original content if no <script setup> tag found
}

// gen module index.ts
EXPORT_MODULES.forEach(m => genIndex(m));
