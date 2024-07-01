type Node = CNode;
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToOption<{
    visible?: boolean;
    lang?: string;
    names?: string[];
    nodes?: Node[];
    loading?: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    confirm: (data: {
        mode: string;
        nodeIds: string[];
        version: string;
    }) => void;
    close: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToOption<{
    visible?: boolean;
    lang?: string;
    names?: string[];
    nodes?: Node[];
    loading?: boolean;
}>>> & {
    onClose?: (() => any) | undefined;
    onConfirm?: ((data: {
        mode: string;
        nodeIds: string[];
        version: string;
    }) => any) | undefined;
}, {}, {}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
