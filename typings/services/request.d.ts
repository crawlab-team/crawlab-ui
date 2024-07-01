import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Router } from 'vue-router';
export declare const initRequest: (router?: Router) => void;
declare const useRequest: () => {
    request: <R = any>(opts: AxiosRequestConfig) => Promise<R>;
    get: <T = any, R = ResponseWithData<T>, PM = any>(url: string, params?: PM, opts?: AxiosRequestConfig) => Promise<R>;
    post: <T = any, R = ResponseWithData<T>, PM = any>(url: string, data?: T, params?: PM, opts?: AxiosRequestConfig) => Promise<R>;
    put: <T = any, R = ResponseWithData<T>, PM = any>(url: string, data?: T, params?: PM, opts?: AxiosRequestConfig) => Promise<R>;
    del: <T = any, R = ResponseWithData<T>, PM = any>(url: string, data?: T, params?: PM, opts?: AxiosRequestConfig) => Promise<R>;
    getList: <T = any>(url: string, params?: ListRequestParams, opts?: AxiosRequestConfig) => Promise<ResponseWithListData<any>>;
    getAll: <T = any>(url: string, opts?: AxiosRequestConfig) => Promise<ResponseWithListData<any>>;
    postList: <T = any, R = ResponseWithListData<any>, PM = any>(url: string, data?: T[], params?: PM, opts?: AxiosRequestConfig) => Promise<R>;
    putList: <T = any, R = Response, PM = any>(url: string, data?: BatchRequestPayloadWithJsonStringData, params?: PM, opts?: AxiosRequestConfig) => Promise<R>;
    delList: <T = any, R = Response, PM = any>(url: string, data?: BatchRequestPayload, params?: PM, opts?: AxiosRequestConfig) => Promise<R>;
    requestRaw: <R = any>(opts: AxiosRequestConfig) => Promise<AxiosResponse>;
    getRaw: <T = any, PM = any>(url: string, params?: PM, opts?: AxiosRequestConfig) => Promise<AxiosResponse>;
};
export default useRequest;
