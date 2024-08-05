declare const _default: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<{
      modelValue?: string;
      localBranches: GitRef[];
      remoteBranches: GitRef[];
      disabled?: boolean;
      loading?: boolean;
      className?: string;
    }>,
    {
      localBranches: () => never[];
      remoteBranches: () => never[];
    }
  >,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'update:modelValue': (value: string) => void;
    'select-local': (value: string) => void;
    'select-remote': (value: string) => void;
    'new-branch': () => void;
    'delete-branch': (value: string) => void;
    'new-tag': () => void;
    pull: () => void;
    commit: () => void;
    push: () => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<{
          modelValue?: string;
          localBranches: GitRef[];
          remoteBranches: GitRef[];
          disabled?: boolean;
          loading?: boolean;
          className?: string;
        }>,
        {
          localBranches: () => never[];
          remoteBranches: () => never[];
        }
      >
    >
  > & {
    onCommit?: (() => any) | undefined;
    onPull?: (() => any) | undefined;
    onPush?: (() => any) | undefined;
    'onUpdate:modelValue'?: ((value: string) => any) | undefined;
    'onSelect-local'?: ((value: string) => any) | undefined;
    'onSelect-remote'?: ((value: string) => any) | undefined;
    'onNew-branch'?: (() => any) | undefined;
    'onDelete-branch'?: ((value: string) => any) | undefined;
    'onNew-tag'?: (() => any) | undefined;
  },
  {
    localBranches: GitRef[];
    remoteBranches: GitRef[];
  },
  {}
>;
export default _default;
type __VLS_WithDefaults<P, D> = {
  [K in keyof Pick<P, keyof P>]: K extends keyof D
    ? __VLS_Prettify<
        P[K] & {
          default: D[K];
        }
      >
    : P[K];
};
type __VLS_Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
  [K in keyof T]-?: {} extends Pick<T, K>
    ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
      }
    : {
        type: import('vue').PropType<T[K]>;
        required: true;
      };
};
