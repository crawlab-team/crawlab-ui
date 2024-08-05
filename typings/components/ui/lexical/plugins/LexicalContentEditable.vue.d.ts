import type { LexicalEditor } from 'lexical';

declare const _default: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToOption<{
      editor: LexicalEditor;
      ariaActivedescendant?: string;
      ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
      ariaControls?: string;
      ariaDescribedby?: string;
      ariaExpanded?: boolean;
      ariaLabel?: string;
      ariaLabelledby?: string;
      ariaMultiline?: boolean;
      ariaOwns?: string;
      ariaRequired?: boolean;
      autoCapitalize?: boolean;
      autoComplete?: boolean;
      autoCorrect?: boolean;
      id?: string;
      editable?: boolean;
      role?: string;
      spellcheck?: boolean;
      tabindex?: number;
      enableGrammarly?: boolean;
    }>,
    {
      role: string;
      spellcheck: boolean;
    }
  >,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToOption<{
          editor: LexicalEditor;
          ariaActivedescendant?: string;
          ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
          ariaControls?: string;
          ariaDescribedby?: string;
          ariaExpanded?: boolean;
          ariaLabel?: string;
          ariaLabelledby?: string;
          ariaMultiline?: boolean;
          ariaOwns?: string;
          ariaRequired?: boolean;
          autoCapitalize?: boolean;
          autoComplete?: boolean;
          autoCorrect?: boolean;
          id?: string;
          editable?: boolean;
          role?: string;
          spellcheck?: boolean;
          tabindex?: number;
          enableGrammarly?: boolean;
        }>,
        {
          role: string;
          spellcheck: boolean;
        }
      >
    >
  >,
  {
    role: string;
    spellcheck: boolean;
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
