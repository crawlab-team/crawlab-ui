import type { WatchOptionsBase } from 'vue';

/**
 * @internal
 */
export default function useLexicalEffect(
  cb: () => (() => any) | undefined,
  options?: WatchOptionsBase
): void;
