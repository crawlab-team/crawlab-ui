export declare const eventBus: import('mitt').Emitter<
  Record<import('mitt').EventType, unknown>
>;
export declare const subscribe: (
  event: string,
  handler: (...args: any[]) => void
) => () => void;
export declare const publish: (event: string, ...args: any[]) => void;
