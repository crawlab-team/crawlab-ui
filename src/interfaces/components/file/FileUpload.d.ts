import { FILE_UPLOAD_MODE_DIR, FILE_UPLOAD_MODE_FILES } from '@/constants';

export declare global {
  interface FileUploadModeOption {
    label: string;
    value: string;
  }

  interface FileUploadInfo {
    dirName?: string;
    fileCount?: number;
    filePaths?: string[];
  }

  type FileUploadMode = FILE_UPLOAD_MODE_DIR | FILE_UPLOAD_MODE_FILES;

  interface FileWithPath extends File {
    path?: string;
  }

  type InputFile = (FileWithPath | DataTransferItem) & {
    path?: string;
    size?: number;
  };
}
