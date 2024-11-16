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
  | 'uninstall';

interface DialogVisible {
  createEdit?: boolean;
}
