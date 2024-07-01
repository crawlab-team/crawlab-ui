export declare function debounce<T extends (...args: any[]) => any>(func: T, wait?: number): (...args: Parameters<T>) => ReturnType<T> extends Promise<any> ? Promise<ReturnType<T>> : ReturnType<T>;
