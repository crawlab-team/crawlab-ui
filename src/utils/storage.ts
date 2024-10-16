export const loadLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadNamespaceLocalStorage = (ns: StoreNamespace, key: string) => {
  const data = loadLocalStorage(key);
  if (!data) return {};
  return data[ns] || {};
};

export const saveNamespaceLocalStorage = (
  ns: StoreNamespace,
  key: string,
  values: Record<string, any>
) => {
  const existingValues = loadLocalStorage(key) || {};
  existingValues[ns] = {
    ...existingValues[ns],
    ...values,
  };
  saveLocalStorage(key, existingValues);
};
