export function debounce<T extends (...args: any[]) => Promise<any>>(func: T, wait: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: ReturnType<typeof setTimeout>;
  let resolveQueue: ((value: ReturnType<T> | PromiseLike<ReturnType<T>>) => void)[] = [];

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    // Clear the previous timeout
    clearTimeout(timeout);

    // Create a new promise and push its resolve function to the queue
    const promise = new Promise<ReturnType<T>>(resolve => {
      resolveQueue.push(resolve);
    });

    // Set the new timeout
    timeout = setTimeout(async () => {
      // Execute the function
      const result = await func(...args);

      // Resolve all promises in the queue with the result
      while (resolveQueue.length) {
        const resolve = resolveQueue.shift();
        if (resolve) {
          resolve(result);
        }
      }
    }, wait);

    return promise;
  };
}
