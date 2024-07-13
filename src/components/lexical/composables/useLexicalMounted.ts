import { onMounted, onUnmounted } from 'vue';

/**
 * @internal
 */
export default (cb: Function) => {
  let unregister: (() => void) | undefined;

  onMounted(() => {
    unregister = cb();
  });

  onUnmounted(() => {
    unregister?.();
  });
};
