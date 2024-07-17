import mitt from 'mitt';

export const eventBus = mitt();

export const subscribe = (event: string, handler: (...args: any[]) => void) => {
  eventBus.on(event, handler);
  return () => eventBus.off(event, handler);
};

export const publish = (event: string, ...args: any[]) => {
  eventBus.emit(event, ...args);
};
