import { onMounted, onUnmounted } from 'vue';

/**
 * @internal
 */
export default (cb: () => undefined | (() => any)) => {
  let unregister: (() => void) | undefined;

  onMounted(() => {
    unregister = cb();
  });

  onUnmounted(() => {
    unregister?.();
  });
};
