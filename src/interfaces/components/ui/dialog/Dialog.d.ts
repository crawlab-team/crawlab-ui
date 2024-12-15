type DialogKey =
  | 'create'
  | 'edit'
  | 'run'
  | 'uploadFiles'
  | 'logs'
  | 'diff'
  | 'createDatabase'
  | 'createTable'
  | 'install'
  | 'uninstall'
  | 'config'
  | 'setup';

interface DialogVisible {
  createEdit?: boolean;
}
