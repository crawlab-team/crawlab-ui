export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait?: number
): (
  ...args: Parameters<T>
) => ReturnType<T> extends Promise<any>
  ? Promise<ReturnType<T>>
  : ReturnType<T> {
  let timeout: ReturnType<typeof setTimeout>;
  let resolveQueue: ((value: any) => void)[] = [];

  return function (this: any, ...args: Parameters<T>): any {
    clearTimeout(timeout);

    if (func.constructor.name === 'AsyncFunction') {
      const promise = new Promise<ReturnType<T>>(resolve => {
        resolveQueue.push(resolve);
      });

      timeout = setTimeout(async () => {
        const result = await func.apply(this, args);

        while (resolveQueue.length) {
          const resolve = resolveQueue.shift();
          if (resolve) {
            resolve(result);
          }
        }
      }, wait || 100);

      return promise;
    } else {
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait || 100);
    }
  };
}
