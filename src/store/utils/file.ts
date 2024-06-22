import { FILE_UPLOAD_MODE_DIR } from '@/constants';
import useRequest from '@/services/request';

const { get, post, del } = useRequest();

export const getBaseFileStoreState = (): BaseFileStoreState => {
  return {
    fileNavItems: [],
    activeNavItem: undefined,
    fileContent: '',
    defaultFilePaths: [],
  };
};

export const getBaseFileStoreMutations = <
  S extends BaseFileStoreState,
>(): BaseFileStoreMutations<S> => {
  return {
    setFileNavItems: (state: S, navItems: FileNavItem[]) => {
      state.fileNavItems = navItems;
    },
    resetFileNavItems: (state: S) => {
      state.fileNavItems = [];
    },
    setActiveFileNavItem: (state: S, navItem: FileNavItem) => {
      state.activeNavItem = navItem;
    },
    resetActiveFileNavItem: (state: S) => {
      state.activeNavItem = undefined;
    },
    setFileContent: (state: S, content: string) => {
      state.fileContent = content;
    },
    resetFileContent: (state: S) => {
      state.fileContent = '';
    },
    setDefaultFilePaths: (state: S, paths: string[]) => {
      state.defaultFilePaths = paths;
    },
    resetDefaultFilePaths: (state: S) => {
      state.defaultFilePaths = [];
    },
  };
};

export const getBaseFileStoreActions = <S extends BaseFileStoreState>(
  endpoint: string
): BaseFileStoreActions<S> => {
  return {
    listDir: async (
      { commit }: StoreActionContext<BaseStoreState<Spider>>,
      { id, path }: FileRequestPayload
    ) => {
      const res = await get(`${endpoint}/${id}/files/list`, { path });
      const navItems = res.data as FileNavItem[];
      commit('setFileNavItems', navItems);
      return res;
    },
    getFile: async (
      { commit }: StoreActionContext<S>,
      { id, path }: FileRequestPayload
    ) => {
      const res = await get(`${endpoint}/${id}/files/get`, { path });
      commit('setFileContent', res.data);
      return res;
    },
    getFileInfo: async (
      { commit }: StoreActionContext<S>,
      { id, path }: FileRequestPayload
    ) => {
      return await get(`${endpoint}/${id}/files/info`, { path });
    },
    saveFile: async (
      { commit }: StoreActionContext<S>,
      { id, path, data }: FileRequestPayload
    ) => {
      return await post(`${endpoint}/${id}/files/save`, { path, data });
    },
    saveFileBinary: async (
      { commit }: StoreActionContext<S>,
      { id, path, file }: FileRequestPayload
    ) => {
      const data = new FormData();
      data.set('path', path as string);
      data.set('file', file as File, file?.name);
      return await post(`${endpoint}/${id}/files/save`, data, null, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    saveFilesBinary: async (
      { commit }: StoreActionContext<S>,
      { id, files }: SaveFilesRequestPayload
    ) => {
      const data = new FormData();
      files.forEach(({ path, file }) => {
        data.append(path, file);
      });
      return await post(`${endpoint}/${id}/files/save/batch`, data, null, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    saveDir: async (
      { commit }: StoreActionContext<S>,
      { id, path }: FileRequestPayload
    ) => {
      return await post(`${endpoint}/${id}/files/save/dir`, { path });
    },
    renameFile: async (
      { commit }: StoreActionContext<S>,
      { id, path, new_path }: FileRequestPayload
    ) => {
      return await post(`${endpoint}/${id}/files/rename`, { path, new_path });
    },
    deleteFile: async (
      { commit }: StoreActionContext<S>,
      { id, path }: FileRequestPayload
    ) => {
      return await del(`${endpoint}/${id}/files`, { path });
    },
    copyFile: async (
      { commit }: StoreActionContext<S>,
      { id, path, new_path }: FileRequestPayload
    ) => {
      return await post(`${endpoint}/${id}/files/copy`, { path, new_path });
    },
    exportFiles: async (
      { commit }: StoreActionContext<S>,
      { id }: { id: string }
    ) => {
      return (await post(
        `${endpoint}/${id}/files/export`,
        {},
        {},
        { responseType: 'arraybuffer' }
      )) as any;
    },
  };
};
