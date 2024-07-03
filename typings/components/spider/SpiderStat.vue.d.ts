import { PropType } from '@vue/runtime-dom';
declare const _default: import("@vue/runtime-core").DefineComponent<{
    stat: {
        type: PropType<SpiderStat>;
        required: false;
    };
}, {
    tooltips: import("@vue/reactivity").ComputedRef<SpiderStatTooltips>;
    labels: import("@vue/reactivity").ComputedRef<SpiderStatLabels>;
}, unknown, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, ("tasks-click" | "results-click" | "duration-click")[], "tasks-click" | "results-click" | "duration-click", import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<{
    stat: {
        type: PropType<SpiderStat>;
        required: false;
    };
}>> & {
    "onTasks-click"?: ((...args: any[]) => any) | undefined;
    "onResults-click"?: ((...args: any[]) => any) | undefined;
    "onDuration-click"?: ((...args: any[]) => any) | undefined;
}, {}, {}>;
export default _default;
