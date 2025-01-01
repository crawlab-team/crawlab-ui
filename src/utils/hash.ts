import md5 from 'md5';

export const getMd5 = (value: any): string => {
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  return md5(value).toString();
};
