declare const _default: import('vue').DefineComponent<
  __VLS_TypePropsToOption<{
    mode: FileUploadMode;
    targetDirectory: string;
    directoryOptions?: SelectOption[];
    uploadInfo?: FileUploadInfo;
  }>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    'mode-change': (mode: any) => void;
    'directory-change': (dir: string) => void;
    'files-change': (files: (FileWithPath | undefined)[]) => void;
  },
  string,
  import('vue').PublicProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_TypePropsToOption<{
        mode: FileUploadMode;
        targetDirectory: string;
        directoryOptions?: SelectOption[];
        uploadInfo?: FileUploadInfo;
      }>
    >
  > & {
    'onMode-change'?: ((mode: any) => any) | undefined;
    'onDirectory-change'?: ((dir: string) => any) | undefined;
    'onFiles-change'?:
      | ((files: (FileWithPath | undefined)[]) => any)
      | undefined;
  },
  {},
  {}
>;
export default _default;
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
