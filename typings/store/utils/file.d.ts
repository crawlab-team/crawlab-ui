export declare const getBaseFileStoreState: () => BaseFileStoreState;
export declare const getBaseFileStoreMutations: <S extends BaseFileStoreState>() => BaseFileStoreMutations<S>;
export declare const getBaseFileStoreActions: <S extends BaseFileStoreState>(endpoint: string) => BaseFileStoreActions<S>;
