export const getRequestBaseUrl = (): string => {
  return import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000';
};

export const getEmptyResponseWithListData = <T = any>(): ResponseWithListData<T> => {
  return {
    total: 0,
    data: [] as T[],
  } as ResponseWithListData<T>;
};

export const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  link.click();
};

export const downloadData = (data: string | ArrayBuffer, name: string, type: string) => {
  let blobArr: any[] = [data];
  let options: BlobPropertyBag = {};
  if (type === 'json') {
    blobArr = [JSON.stringify(data)];
  }
  const blob = new Blob(blobArr, options);
  const url = window.URL.createObjectURL(blob);
  downloadURI(url, name);
  window.URL.revokeObjectURL(url);
};
