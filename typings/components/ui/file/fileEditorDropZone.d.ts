declare const useFileEditorDropZone: () => {
  getRootProps: ({
    onKeyDown,
    onFocus,
    onBlur,
    onClick,
    onDragEnter,
    onDragenter,
    onDragOver,
    onDragover,
    onDragLeave,
    onDragleave,
    onDrop,
    ...rest
  }?: {
    [key: string]: any;
  }) => {
    tabIndex?: number | undefined;
    onKeyDown: (() => void) | undefined;
    onFocus: (() => void) | undefined;
    onBlur: (() => void) | undefined;
    onClick: (() => void) | undefined;
    onDragenter: (() => void) | undefined;
    onDragover: (() => void) | undefined;
    onDragleave: (() => void) | undefined;
    onDrop: (() => void) | undefined;
    ref: import('vue').Ref<import('vue').RendererElement | undefined>;
  };
  getInputProps: ({
    onChange,
    onClick,
    ...rest
  }?: {
    onChange?: (() => void) | undefined;
    onClick?: (() => void) | undefined;
  }) => {
    accept: string;
    multiple: boolean | undefined;
    style: string;
    type: string;
    onChange: (() => void) | undefined;
    onClick: (() => void) | undefined;
    autoComplete: string;
    tabIndex: number;
    ref: import('vue').Ref<import('vue').RendererElement | undefined>;
  };
  open: (() => void) | undefined;
};
export default useFileEditorDropZone;
