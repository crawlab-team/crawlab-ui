type DialogKey =
  | 'create'
  | 'edit'
  | 'run'
  | 'uploadFiles'
  | 'logs'
  | 'diff'
  | 'createDatabase'
  | 'createTable';

interface DialogVisible {
  createEdit: boolean;
}
