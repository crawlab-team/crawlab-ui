import { Store } from 'vuex';
import { getDefaultService } from '@/utils/service';

const useFileService = <T>(
  ns: ListStoreNamespace,
  store: Store<RootStoreState>
): FileServices<T> => {
  const { dispatch } = store;

  const listDir = (id: string, path: string) => {
    return dispatch(`${ns}/listDir`, { id, path });
  };

  const listRootDir = (id: string) => {
    return listDir(id, '/');
  };

  const getFile = (id: string, path: string) => {
    return dispatch(`${ns}/getFile`, { id, path });
  };

  const getFileInfo = async (id: string, path: string) => {
    return dispatch(`${ns}/getFileInfo`, { id, path });
  };

  const saveFile = (id: string, path: string, data: string) => {
    return dispatch(`${ns}/saveFile`, { id, path, data });
  };

  const saveFileBinary = (id: string, path: string, file: File) => {
    return dispatch(`${ns}/saveFileBinary`, { id, path, file });
  };

  const saveFilesBinary = (
    id: string,
    files: { path: string; file: File }[]
  ) => {
    return dispatch(`${ns}/saveFilesBinary`, { id, files });
  };

  const saveDir = (id: string, path: string) => {
    return dispatch(`${ns}/saveDir`, { id, path });
  };

  const renameFile = (id: string, path: string, new_path: string) => {
    return dispatch(`${ns}/renameFile`, { id, path, new_path });
  };

  const deleteFile = (id: string, path: string) => {
    return dispatch(`${ns}/deleteFile`, { id, path });
  };

  const copyFile = (id: string, path: string, new_path: string) => {
    return dispatch(`${ns}/copyFile`, { id, path, new_path });
  };

  return {
    ...getDefaultService<T>(ns, store),
    listDir,
    listRootDir,
    getFile,
    getFileInfo,
    saveFile,
    saveFileBinary,
    saveFilesBinary,
    saveDir,
    renameFile,
    deleteFile,
    copyFile,
  };
};

export default useFileService;
