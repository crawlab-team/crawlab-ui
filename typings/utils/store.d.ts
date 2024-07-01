export declare const getDefaultStoreState: <T = any>(ns: StoreNamespace) => BaseStoreState<T>;
export declare const getDefaultStoreGetters: <T = any>(opts?: GetDefaultStoreGettersOptions) => BaseStoreGetters<BaseStoreState<T>>;
export declare const getDefaultStoreMutations: <T = any>() => BaseStoreMutations<T>;
export declare const getDefaultStoreActions: <T = any>(endpoint: string) => {
    deleteList: ({ commit }: StoreActionContext<BaseStoreState<T>>, ids: string[]) => Promise<Response>;
    getAllList: ({ commit, }: StoreActionContext<BaseStoreState<T>>) => Promise<ResponseWithListData<T>>;
    createList: ({ state, commit }: StoreActionContext<BaseStoreState<T>>, data: T[]) => Promise<ResponseWithListData<T>>;
    getById: ({ commit }: StoreActionContext<BaseStoreState<T>>, id: string) => Promise<ResponseWithData<T>>;
    getList: ({ state, commit, }: StoreActionContext<BaseStoreState<T>>) => Promise<ResponseWithListData<T>>;
    deleteById: ({ commit }: StoreActionContext<BaseStoreState<T>>, id: string) => Promise<Response>;
    create: ({ commit }: StoreActionContext<BaseStoreState<T>>, form: T) => Promise<ResponseWithData<T>>;
    getListWithParams: (_: StoreActionContext<BaseStoreState<T>>, params?: ListRequestParams) => Promise<ResponseWithListData<T>>;
    updateById: ({ commit }: StoreActionContext<BaseStoreState<T>>, { id, form, }: {
        id: string;
        form: T;
    }) => Promise<ResponseWithData<T>>;
    updateList: ({ state, commit }: StoreActionContext<BaseStoreState<T>>, { ids, data, fields }: BatchRequestPayloadWithData) => Promise<Response>;
};
