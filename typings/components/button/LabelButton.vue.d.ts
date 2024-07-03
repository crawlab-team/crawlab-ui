interface ButtonProps {
    tooltip?: string;
    type?: BasicType;
    size?: BasicSize;
    round?: boolean;
    circle?: boolean;
    plain?: boolean;
    disabled?: boolean;
    isIcon?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
    id?: string;
    noMargin?: boolean;
}
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToOption<ButtonProps & {
    label?: string;
    icon?: Icon;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: () => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToOption<ButtonProps & {
    label?: string;
    icon?: Icon;
}>>> & {
    onClick?: (() => any) | undefined;
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
