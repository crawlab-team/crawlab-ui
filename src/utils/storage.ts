export const loadLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
