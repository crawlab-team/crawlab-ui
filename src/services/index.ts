import useRequest from '@/services/request';
import { debounce } from '@/utils';
import * as llmService from './llm';

// Export the LLM service
export { llmService };

const { get, put, post, del, getList, getAll, putList, postList, delList } =
  useRequest();

export const useService = <T = any>(endpoint: string): Services<T> => {
  return {
    getById: debounce(async (id: string) => {
      return await get<T>(`${endpoint}/${id}`);
    }) as any,
    create: async (form: T) => {
      return await post<{ data: T }, ResponseWithData<T>>(`${endpoint}`, {
        data: form,
      });
    },
    updateById: async (id: string, form: T) => {
      return await put<{ data: T }, ResponseWithData<T>>(`${endpoint}/${id}`, {
        data: form,
      });
    },
    deleteById: async (id: string) => {
      return await del(`${endpoint}/${id}`);
    },
    getList: async (params?: ListRequestParams) => {
      return await getList<T>(`${endpoint}`, params);
    },
    getAll: async () => {
      return await getAll<T>(`${endpoint}`);
    },
    createList: async (data: T[]) => {
      return await postList<T>(`${endpoint}/batch`, data);
    },
    updateList: async (ids: string[], data: T, fields: string[]) => {
      return await putList<T>(`${endpoint}`, {
        ids,
        data: JSON.stringify(data),
        fields,
      });
    },
    deleteList: async (ids: string[]) => {
      return await delList(`${endpoint}`, { ids });
    },
  };
};
