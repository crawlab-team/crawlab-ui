export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  // 将ArrayBuffer转换为Uint8Array
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // 将字符串编码为base64
  return btoa(binary);
};
