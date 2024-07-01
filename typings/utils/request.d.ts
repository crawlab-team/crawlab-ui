export declare const getRequestBaseUrl: () => string;
export declare const getRequestBaseUrlWs: () => string;
export declare const getEmptyResponseWithListData: <T = any>() => ResponseWithListData<T>;
export declare const downloadURI: (uri: string, name: string) => void;
export declare const downloadData: (data: string | ArrayBuffer, name: string, type?: string) => void;
